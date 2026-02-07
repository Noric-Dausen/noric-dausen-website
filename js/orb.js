const messages = ["Hello World", "Dylan Ugy", "Iristat is Cool", "Massive L"];
let currentIndex = 0;
const textElement = document.getElementById('orb-text');

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