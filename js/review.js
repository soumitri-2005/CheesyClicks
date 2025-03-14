// Load photos from session storage
const photos = JSON.parse(sessionStorage.getItem('photos')) || [];
document.getElementById('photo1').src = photos[0] || '';
document.getElementById('photo2').src = photos[1] || '';
document.getElementById('photo3').src = photos[2] || '';

// Add event listeners to color buttons
document.querySelectorAll('.color-btn').forEach(button => {
    button.addEventListener('click', () => {
        const color = button.style.backgroundColor;
        document.getElementById('photo-strip').style.background = color;
    });
});

// Retake button handler
document.getElementById('retake-btn').addEventListener('click', () => {
    window.location.href = 'index.html';
});

// Download button handler
document.getElementById('download-btn').addEventListener('click', () => {
    const strip = document.getElementById('photo-strip');
    html2canvas(strip).then(canvas => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'photo-strip.png';
        link.click();
    });
});