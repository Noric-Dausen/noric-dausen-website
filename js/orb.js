const messages = ["Hello World", "Dylan Ugy", "Iristat is Cool", "Massive L", "We are technical and care about aesthetics :)"];
let currentIndex = 0;
const textElement = document.getElementById('orb-text');
const maxTextSize = 35; // Maximum font size in pixels
const minTextSize = 20; // Minimum font size in pixels
const orbContainer = document.getElementById('orb-container');

function updateMessage() {
    // Fade out
    textElement.style.opacity = 0;

    setTimeout(() => {
        // Change text after it's hidden
        currentIndex = (currentIndex + 1) % messages.length;
        textElement.textContent = messages[currentIndex];
        // Fade back in
        textElement.style.opacity = 1;
    }, 1000); // Wait for fade-out to finish
}

// Change message every x milliseconds
const changeTimer = 6000;
setInterval(updateMessage, changeTimer);

function resize() {
    let textSize = orbContainer.clientWidth / 30; // Adjust divisor to control text size relative to container
    textSize = Math.min(textSize, maxTextSize); // Ensure text size does not go above maximum
    textSize = Math.max(textSize, minTextSize); // Ensure text size does not go below minimum
    
    textElement.style.fontSize = Math.min(textSize, maxTextSize) + 'px';
}

window.addEventListener('resize', resize);
resize();