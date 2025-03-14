const video = document.getElementById('video');
const captureBtn = document.getElementById('capture');
const reviewBtn = document.getElementById('review');
const errorMsg = document.getElementById('error');
const filterButtons = document.querySelectorAll('.filter-btn');
const mirrorBtn = document.getElementById('mirror-btn');
const countdownDisplay = document.getElementById('countdown');
let photos = [];
let currentFilters = [];
let isMirrored = false;

if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => video.srcObject = stream)
        .catch(err => {
            console.error("Error accessing camera:", err);
            errorMsg.textContent = "Failed to access camera. Please check your permissions or try a different browser.";
        });
} else {
    errorMsg.textContent = "Camera access is not supported in this browser.";
}

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        const filter = button.getAttribute('data-filter');
        if (currentFilters.includes(filter)) {
            currentFilters = currentFilters.filter(f => f !== filter);
        } else {
            currentFilters.push(filter);
        }
        applyFilters();
    });
});

mirrorBtn.addEventListener('click', () => {
    isMirrored = !isMirrored;
    applyFilters();
});

function applyFilters() {
    video.style.filter = currentFilters.join(' ');
    video.style.transform = isMirrored ? 'scaleX(-1)' : 'none';
}

captureBtn.addEventListener('click', () => {
    let count = 3;
    countdownDisplay.style.display = 'block';
    countdownDisplay.textContent = count;
    
    const countdownInterval = setInterval(() => {
        count--;
        if (count === 0) {
            countdownDisplay.textContent = 'Say Cheese!';
        } else {
            countdownDisplay.textContent = count;
        }
    }, 1000);
    
    setTimeout(() => {
        clearInterval(countdownInterval);
        countdownDisplay.style.display = 'none';
        takePhoto();
    }, 4000);
});

function takePhoto() {
    if (photos.length < 3) {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth || 400;
        canvas.height = video.videoHeight || 300;
        const ctx = canvas.getContext('2d');
        ctx.filter = currentFilters.join(' ');
        if (isMirrored) {
            ctx.scale(-1, 1);
            ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
        } else {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        }
        
        const img = new Image();
        img.src = canvas.toDataURL('image/png');
        photos.push(img.src);
        
        if (photos.length === 3) {
            reviewBtn.disabled = false;
        }
    }
}

reviewBtn.addEventListener('click', () => {
    sessionStorage.setItem('photos', JSON.stringify(photos));
    window.location.href = 'review.html';
});