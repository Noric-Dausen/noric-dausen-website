const messages = [
    { text: "Ni Howdy", weight: 5 },
    { text: "Hello World", weight: 1 },
    { text: "Dylan Ugy", weight: 3 },
    { text: "Iristat is Cool", weight: 5 },
    { text: "Massive L", weight: 3 },
    { text: "We are technical and care about aesthetics :)", weight: 1 },
    { text: "Don't reload on triangles", weight: 3 },
    { text: "We have the best statstics", weight: 5 }
];

const textElement = document.getElementById('orb-text');
const orbContainer = document.getElementById('orb-container');
const maxTextSize = 35;
const minTextSize = 20;

// Helper function to pick a weighted random message
function getWeightedMessage() {
    const totalWeight = messages.reduce((sum, msg) => sum + msg.weight, 0);
    let random = Math.random() * totalWeight;

    for (const msg of messages) {
        if (random < msg.weight) {
            return msg.text;
        }
        random -= msg.weight;
    }
}

function updateMessage() {
    // Fade out
    textElement.style.opacity = 0;

    setTimeout(() => {
        // Pick a random weighted message
        const nextText = getWeightedMessage();

        // Aesthetic check: Don't show the same message twice in a row
        if (nextText === textElement.textContent) {
            updateMessage(); // Re-roll
            return;
        }

        textElement.textContent = nextText;

        // Fade back in
        textElement.style.opacity = 1;
    }, 1000);
}

// Change message every 6 seconds
const changeTimer = 6000;
setInterval(updateMessage, changeTimer);

function resize() {
    if (!orbContainer) return;

    let textSize = orbContainer.clientWidth / 25;
    textSize = Math.min(textSize, maxTextSize);
    textSize = Math.max(textSize, minTextSize);

    textElement.style.fontSize = textSize + 'px';
}

window.addEventListener('resize', resize);
resize();