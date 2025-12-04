// JavaScript to handle mouseover and mouseout events
var activeMethodPill = null;
var activeScenePill = null;
var activeModePill = null;
var activeVidID = 0;
var select = false;

var editor = null;

function loadViewer(url) {
  window.app.load_url(url);

  // Reset the camera settings just in case.
  window.app.set_camera_settings(
    new window.wasmBindings.CameraSettings(
      0.9, // fov_y
      0.0, // x
      0.0, // y
      -4.0, // z
      0.0, // euler_x
      0.0, // euler_y
      0.0, // euler_z
      3.75, // focus_distance
      1.0, // speed_scale
      0.5, // min_focus_distance
      5.5, // max_focus_distance
      -20.0, // min_pitch
      20.0, // max_pitch
      -25.0, // min_yaw
      25.0, // max_yaw
    ),
  );
}

$(document).ready(function () {
  editor = CodeMirror.fromTextArea(document.getElementById("bibtex"), {
    lineNumbers: false,
    lineWrapping: true,
    readOnly: true,
  });
  $(function () {
    $('[data-toggle="tooltip"]').tooltip();
  });

  editor.removeTag = CodeMirror.removeTag;
  var cm = $(".CodeMirror");
  cm.editor = editor;
  editor.save();
  editor.setOption("mode", "htmlmixed");

  // resizeAndPlay($('#sparsity')[0]);
});

function copyBibtex() {
  if (editor) {
    navigator.clipboard.writeText(editor.getValue());
  }
}// JavaScript to handle mouseover and mouseout events
var activeMethodPill = null;
var activeScenePill = null;
var activeModePill = null;
var activeVidID = 0;
var select = false;


$(document).ready(function () {
    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
    });

    activeMethodPill = $('.method-pill').filter('.active')[0];
    activeModePill = $('.mode-pill').filter('.active')[0];
    activeScenePill = $('.scene-pill').filter('.active')[0];
});

function selectdoublevideos(methodPill, scenePill, baseline, video0, video1) {
    // Your existing logic for video selection
    // var video = document.getElementById("compVideo");
    select = true;

    if (activeMethodPill) {
        activeMethodPill.classList.remove("active");
    }

    if (activeScenePill) {
        activeScenePill.classList.remove("active");
    }

    activeMethodPill = methodPill;
    activeScenePill = scenePill;
    scenePill.classList.add("active");
    scene = scenePill.getAttribute("data-value");

    // video_active0 = document.getElementById("compVideo0");
    video0.src = `assets/videos/${baseline}/${scene}.mp4`;

    // video_active1 = document.getElementById("compVideo1");
    video1.src = `assets/videos/${"ours"}/${scene}.mp4`;

    video0.load();    
    video1.load();    
}

function selectvideos(methodPill, scenePill, video) {
    // Your existing logic for video selection
    // var video = document.getElementById("compVideo");
    select = true;

    if (activeMethodPill) {
        activeMethodPill.classList.remove("active");
    }

    if (activeScenePill) {
        activeScenePill.classList.remove("active");
    }

    activeMethodPill = methodPill;
    activeScenePill = scenePill;
    scenePill.classList.add("active");
    scene = scenePill.getAttribute("data-value");

    video.src = `assets/videos/ours/more/${scene}.mp4`;

    video.load();    
}

function selectvideos_large(methodPill, scenePill, video) {
  // Your existing logic for video selection
  // var video = document.getElementById("compVideo");
  select = true;

  if (activeMethodPill) {
      activeMethodPill.classList.remove("active");
  }

  if (activeScenePill) {
      activeScenePill.classList.remove("active");
  }

  activeMethodPill = methodPill;
  activeScenePill = scenePill;
  scenePill.classList.add("active");
  scene = scenePill.getAttribute("data-value");

  video.src = `assets/videos/ours/large_motion/${scene}.mp4`;

  video.load();    
}
