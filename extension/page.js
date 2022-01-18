"use strict";

var ocrKey = false;
var ocrFunctionality = 0;
var ocrFormat = "png";
var extension = "png";
var orcinprogress = false;

function OCR() {
  if (orcinprogress) {
    return;
  }
  orcinprogress = true;
  showOCR("Generating, Please wait...");
  var player = document.getElementsByClassName("video-stream")[0];

  var canvas = document.createElement("canvas");
  canvas.width = player.videoWidth;
  canvas.height = player.videoHeight;
  canvas.getContext("2d").drawImage(player, 0, 0, canvas.width, canvas.height);

  var dataURL = canvas.toDataURL();
  try {
    fetch("api-here", {
      method: "POST",
      mode: "cors",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ image: dataURL }),
    })
      .then((response) => response.json())
      .then((body) => {
        showOCR(body);
        orcinprogress = false;
      });
  } catch (error) {
    console.log(error);
  }
}

function AddOcrButton() {
  var ytpRightControls =
    document.getElementsByClassName("ytp-right-controls")[0];

  if (ytpRightControls) {
    ytpRightControls.prepend(ocrButton);
  }
}

var ocrButton = document.createElement("button");
ocrButton.className = "ocrButton ytp-button";
ocrButton.style.width = "auto";
ocrButton.innerHTML = "OCR";
ocrButton.style.cssFloat = "left";
ocrButton.style.marginRight = "10px";
ocrButton.onclick = OCR;

function showOCR(text) {
  var checkfortag = document.getElementsByClassName("ocr-text")[0];
  if (checkfortag) {
    checkfortag.innerHTML = text;
  } else {
    var ocrText = document.createElement("pre");
    ocrText.className = "ocr-text";
    ocrText.innerHTML = text;
    ocrText.style.color = "#32cd32";
    ocrText.style.fontSize = "18px";
    ocrText.style.fontFamily = "Roboto";
    ocrText.style.marginBottom = "15px";

    var watchFlexy = document.getElementsByTagName(
      "ytd-video-primary-info-renderer"
    )[0];

    if (watchFlexy) {
      watchFlexy.prepend(ocrText);
    }
  }
}

AddOcrButton();
