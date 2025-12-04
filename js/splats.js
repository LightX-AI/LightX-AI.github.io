
const bucket = "https://storage.googleapis.com/mf_gaussian_splats"

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

async function listFolders() {
    // Interacting with the google cloud storage APIS requires full on node installatiosn and such so meh, just parse the returned XML :) 
    let xmlDoc = await fetch(bucket).then(response => response.text()).then(xmlString => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
        return xmlDoc;
    }).catch(error => {
        console.error('Error:', error);
    });
    const contentsElements = xmlDoc.getElementsByTagName('Contents');
    let nodeArray = [].slice.call(contentsElements);

    function xmlToKey(folder) {
        let key = folder.getElementsByTagName("Key")[0].textContent;
        let parts = key.split("/");
        return parts[0] + "/" + parts[1];
    }

    const keys = [...new Set(nodeArray.map(f => xmlToKey(f)))];
    return keys.filter(f => !f.includes("."))
}


export async function setupCarousel(viewer, carousel) {
    let files = await listFolders();

    shuffleArray(files);

    const prototype = carousel.querySelector("#splat-carousel-prototype");
    const elements = Object.fromEntries(
        files.map(f => [f, prototype.firstElementChild.cloneNode(true)])
    );

    async function onClickSplatThumb(splatName) {
        const elem = elements[splatName];
        if (elem.classList.contains("active")) {
            return;
        }

        const itemsParent = carousel.getElementsByClassName("splat-carousel-items")[0];
        const items = [...itemsParent.getElementsByClassName('splat-carousel-item')];
        currentIndex = items.indexOf(elem);

        // TODO TODO:
        viewer.load_url(bucket + "/" + splatName + "/splat.ply");

        Object.values(elements).forEach(e => {
            e.classList.remove("active");
        });
        elem.classList.add("active");
    }

    // TODO: probably want to download a bunch of metadata-y thing here.
    for (var i = 0; i < files.length; ++i) {
        const file = files[i];

        // Wrap in function to capture CURRENT file.
        // Js is bad :)
        function setup(file) {
            const card = elements[file];
            var startScroll = undefined;

            card.addEventListener("mousedown", function () { startScroll = itemsParent.scrollLeft; });
            card.addEventListener("mouseup", function () {
                console.log(Math.abs(itemsParent.scrollLeft - startScroll));
                if (Math.abs(itemsParent.scrollLeft - startScroll) < 10) {
                    onClickSplatThumb(file);
                }
            });

            const img = card.querySelector("img");
            img.src = bucket + "/" + file + "/input.png";

            let isAnimating = false;
            let latestEvent = null;

            card.addEventListener('pointermove', (e) => {
                latestEvent = e;
                if (!isAnimating) {
                    isAnimating = true;
                    requestAnimationFrame(updateCardTransform);
                }
            });

            function updateCardTransform() {
                const e = latestEvent;
                if (e === null || e === undefined) {
                    isAnimating = false;
                    return;
                }
                const cardRect = card.getBoundingClientRect();
                const centerX = cardRect.left + cardRect.width / 2;
                const centerY = cardRect.top + cardRect.height / 2;

                const mouseX = e.clientX - centerX;
                const mouseY = e.clientY - centerY;

                const rotateY = (mouseX / cardRect.width) * 35;
                const rotateX = -(mouseY / cardRect.height) * 35;

                card.style.transform = `translateZ(15px) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;

                isAnimating = false;
                if (latestEvent !== e) { // Check for new event
                    requestAnimationFrame(updateCardTransform);
                }
            }

            card.addEventListener('mouseleave', () => {
                latestEvent = null; // Clear event to stop animation
                card.style.transform = ''; // Reset on leave
            });
            prototype.parentNode.appendChild(card);
        }

        setup(file);
    }

    prototype.remove();

    const itemsParent = carousel.getElementsByClassName("splat-carousel-items")[0];
    const items = [...itemsParent.getElementsByClassName('splat-carousel-item')];
    let currentIndex = 0;

    function scrollToTarget() {
        items[currentIndex].scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }

    carousel.querySelector('.splat-carousel-button.left').addEventListener('mousedown', () => {
        currentIndex = (currentIndex + items.length - 2) % items.length;
        scrollToTarget();
    });

    carousel.querySelector('.splat-carousel-button.right').addEventListener('mousedown', () => {
        currentIndex = (currentIndex + 2) % items.length;
        scrollToTarget();
    });

    let mouseDown = false;
    let startX, scrollLeft;

    const startDragging = (e) => {
        mouseDown = true;
        startX = e.pageX - itemsParent.offsetLeft;
        scrollLeft = itemsParent.scrollLeft;
    }

    const stopDragging = (e) => {
        e.preventDefault();
        mouseDown = false;
    }

    const move = (e) => {
        e.preventDefault();
        if (!mouseDown) { return; }
        const x = e.pageX - itemsParent.offsetLeft;
        const scroll = x - startX;
        itemsParent.scrollLeft = scrollLeft - scroll;
    }

    // Add the event listeners
    itemsParent.addEventListener('mousemove', move, false);
    itemsParent.addEventListener('mousedown', startDragging, false);
    itemsParent.addEventListener('mouseup', stopDragging, false);
    itemsParent.addEventListener('mouseleave', stopDragging, false);

    // Activate the first thumbnail.
    onClickSplatThumb(files[0]);
}
