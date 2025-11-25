const video = document.getElementById("camera");
const captureBtn = document.getElementById("captureBtn");
const preview = document.getElementById("preview");

// access camera
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
    })
    .catch(err => {
        console.error("Camera error:", err);
        alert("Please allow camera access.");
    });

// take photo
captureBtn.addEventListener("click", () => {
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    const dataUrl = canvas.toDataURL("image/png");

    // show preview
    preview.innerHTML = `<img src="${dataUrl}">`;

    // send to server
    fetch("/save_photo", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `image=${encodeURIComponent(dataUrl)}`
    })
    .then(res => res.json())
    .then(data => {
        console.log("Saved:", data);
    });
});
