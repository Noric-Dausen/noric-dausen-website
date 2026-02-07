const messages = ["Hello World", "Dylan Ugy", "Iristat is Cool", "Massive L", "We are technical and care about aesthetics :)"];
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

const canvases = document.querySelectorAll('.line-canvas');
const ctxs = Array.from(canvases).map(canvas => canvas.getContext('2d'));

// Settings for each of the 5 lines
const lineConfigs = [
    { speed: 0.02, amplitude: 20, frequency: 0.01, color: 'rgba(79, 172, 254, 0.5)', offset: 0 },
    { speed: 0.03, amplitude: 35, frequency: 0.015, color: 'rgba(0, 242, 254, 0.3)', offset: 100 },
    { speed: 0.015, amplitude: 50, frequency: 0.008, color: 'rgba(255, 255, 255, 0.2)', offset: -50 },
    { speed: 0.025, amplitude: 15, frequency: 0.02, color: 'rgba(79, 172, 254, 0.4)', offset: 50 },
    { speed: 0.01, amplitude: 40, frequency: 0.005, color: 'rgba(0, 242, 254, 0.2)', offset: -100 }
];

function resize() {
    canvases.forEach(canvas => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

window.addEventListener('resize', resize);
resize();