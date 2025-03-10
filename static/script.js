const video = document.getElementById("video");
const startBtn = document.getElementById("startBtn");
const countdown = document.getElementById("countdown");
const proceedBtn = document.getElementById("proceedBtn");
const counterText = document.getElementById("counterText");

let capturedPhotos = [];
const totalPhotos = 3;

navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => video.srcObject = stream)
    .catch(() => alert("Camera access denied."));

startBtn.addEventListener("click", async () => {
    startBtn.style.display = "none";

    for (let i = 0; i < totalPhotos; i++) {
        // Countdown before each capture
        await runCountdown(3);
        capturePhoto();
        updateCaptureCounter(i + 1); // Update counter after capture
    }

    countdown.innerText = "";
    proceedBtn.style.display = "inline-block";
});

// Dynamic countdown function
async function runCountdown(seconds) {
    for (let i = seconds; i > 0; i--) {
        countdown.innerText = i;
        await new Promise(res => setTimeout(res, 1000));
    }
    countdown.innerText = "📸 Smile!";
    await new Promise(res => setTimeout(res, 1000)); // Hold message for a second
    countdown.innerText = "";
}

// Capture photo and store
function capturePhoto() {
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    capturedPhotos.push(canvas.toDataURL("image/png"));
}

// Update 1/3, 2/3, etc.
function updateCaptureCounter(currentCount) {
    counterText.innerText = `${currentCount}/${totalPhotos} Captured`;
}

// Proceed to next step
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
