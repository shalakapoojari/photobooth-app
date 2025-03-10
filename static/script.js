const video = document.getElementById("video");
const startBtn = document.getElementById("startBtn");
const countdown = document.getElementById("countdown");
const proceedBtn = document.getElementById("proceedBtn");

let capturedPhotos = [];

navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => video.srcObject = stream)
    .catch(() => alert("Camera access denied."));

startBtn.addEventListener("click", async () => {
    startBtn.style.display = "none";
    for (let i = 3; i > 0; i--) {
        countdown.innerText = i;
        await new Promise(res => setTimeout(res, 1000));
    }
    for (let i = 0; i < 3; i++) {
        await new Promise(res => setTimeout(res, 3000));
        capturePhoto();
    }
    countdown.innerText = "";
    proceedBtn.style.display = "block";
});

function capturePhoto() {
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    capturedPhotos.push(canvas.toDataURL("image/png"));
}

function proceed() {
    fetch("/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photos: capturedPhotos })
    })
    .then(res => res.json())
    .then(data => window.location.href = data.redirect)
    .catch(() => alert("Error processing photos."));
}
