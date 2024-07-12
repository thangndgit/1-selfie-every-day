"use strict";

const maxWidth = 1280;
const maxHeight = 720;
const screenRatio = window.screen.width / window.screen.height;

let webcamWidth = window.screen.availWidth;
let webcamHeight = window.screen.availHeight;

if (webcamWidth > maxWidth) {
  const divideRate = webcamWidth / maxWidth;
  webcamWidth = maxWidth;
  webcamHeight = Math.floor(webcamHeight / divideRate);
}
if (webcamHeight > maxHeight) {
  const divideRate = webcamHeight / maxHeight;
  webcamHeight = maxHeight;
  webcamWidth = Math.floor(webcamWidth / divideRate);
}

if (webcamWidth / webcamHeight > screenRatio) {
  webcamWidth = screenRatio * webcamHeight;
} else {
  webcamHeight = webcamWidth / screenRatio;
}

Webcam.set({
  width: webcamWidth,
  height: webcamHeight,
  jpeg_quality: 100,
  fps: 60,
  flip_horiz: true,
});

Webcam.attach("#camera-preview");

const previewEl = document.getElementById("camera-preview");
const resultEl = document.getElementById("camera-result");
const lastEl = document.getElementById("camera-last");
const captureBtn = document.getElementById("btn-capture");
const downloadBtn = document.getElementById("btn-download");
const recaptureBtn = document.getElementById("btn-recapture");
const viewBtn = document.getElementById("btn-view");

function showLastImage() {
  const lastImageSrc = localStorage.getItem("last_image");
  if (lastImageSrc) {
    lastEl.innerHTML = '<img id="last-image" alt="last" src="' + lastImageSrc + '"/>';
  }
}

showLastImage();

function togglePreview() {
  if (previewEl.classList.contains("hide")) {
    previewEl.classList.remove("hide");
    resultEl.classList.add("hide");
    lastEl.classList.remove("hide");
    captureBtn.classList.remove("hide");
    downloadBtn.classList.add("hide");
    recaptureBtn.classList.add("hide");
    viewBtn.classList.add("hide");
  } else {
    previewEl.classList.add("hide");
    resultEl.classList.remove("hide");
    lastEl.classList.add("hide");
    captureBtn.classList.add("hide");
    downloadBtn.classList.remove("hide");
    recaptureBtn.classList.remove("hide");
    viewBtn.classList.remove("hide");
  }
}

function takeSnapshot() {
  Webcam.snap(function (data_uri) {
    resultEl.innerHTML = '<img id="result-image" alt="result" src="' + data_uri + '"/>';
    togglePreview();
  });
}

function downloadImage() {
  const imgElement = document.getElementById("result-image");
  const base64String = imgElement.src;
  const link = document.createElement("a");

  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");

  const formattedDate = `${yyyy}-${mm}-${dd}`;
  link.download = `${formattedDate}.jpeg`;
  link.href = base64String;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  localStorage.setItem("last_image", base64String);
  showLastImage();
}

function viewImage() {
  const imgSrc = document.getElementById("result-image").src;

  if (imgSrc.startsWith("data:image/")) {
    const base64Data = imgSrc.split(",")[1];
    const contentType = imgSrc.substring(5, imgSrc.indexOf(";"));

    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    const blob = new Blob([byteArray], { type: contentType });
    const blobUrl = URL.createObjectURL(blob);

    window.open(blobUrl, "_blank");
  } else {
    window.open(imgSrc, "_blank");
  }
}
