const canvasContainer = document.getElementById("triangles-container");
const canvas = document.getElementById("trianglesbg");
const ctx = canvas.getContext("2d");
const darkModeSwitch1 = document.getElementById('toggleInput');
const orbContainer = document.getElementById("orb-container");

// for small screens
const SMALL_SCREEN_THRESHOLD = 900;
let trianglesDrawn = false; // Flag to track if triangles have been drawn at least once

let triangles = [];
let currentTriangle = null; // To track which triangle is currently hovered

// triangles styling
const SPACING = 2;
const SIZE = 60;
const height = SIZE * Math.sqrt(3) / 2;
const ROWS = 42;
const ROTATION_COOLDOWN = 300; // Minimum time (ms) between rotations for the same triangle
const FADE_SPEED = 0.02; // Smaller = slower fade to black
const DARK_COLOR = { r: 0, g: 0, b: 0 };
const LIGHT_COLOR = { r: 255, g: 255, b: 255 };

// canvas styling
const WIDTH_PERCENTAGE = 120;
const CANVAS_ROTATION = 0;

function getTrueDimensions() {
    const zoomFactor = window.devicePixelRatio;

    // This gives you the width/height as they appear at 100% zoom
    const trueWidth = window.innerWidth * zoomFactor;
    const trueHeight = window.innerHeight * zoomFactor;

    return { width: trueWidth, height: trueHeight };
}

//canvasContainer.style.top = `${getTrueDimensions().height}px`;

// set canvasContainer.style.top to the height of orbContainer plus some extra padding (to ensure it is below the orbContainer)
canvasContainer.style.top = `${orbContainer.offsetHeight + 50}px`;

class Triangle {
    constructor(x, y, isPointUp, opacity = 1) {
        this.x = x;
        this.y = y;
        this.isPointUp = isPointUp;
        this.rotation = 0;
        this.targetRotation = 0;
        this.opacity = opacity;
        this.lastRotateTime = 0;

        // Use {...} to copy the values, not reference the original object
        //    - the triangles were overriding the global DARK_COLOR and LIGHT_COLOR objects without this
        this.darkModeColor = { ...DARK_COLOR };
        this.lightModeColor = { ...LIGHT_COLOR };

        // Start color should also be a copy
        this.currentColor = darkModeSwitch1.checked ? { ...DARK_COLOR } : { ...LIGHT_COLOR };

        // Target color initialization
        this.targetColor = darkModeSwitch1.checked ? { ...DARK_COLOR } : { ...LIGHT_COLOR };
    }

    darkLightHardChange() {
        // Immediately set the triangle's color without fading

        // Used for changing between dark and light mode on small
        //      screen devices where the fade effect is not applied for performance reasons

        // returns true if a hard change was made

        if (window.innerWidth <= SMALL_SCREEN_THRESHOLD) {
            if (darkModeSwitch1.checked) {
                this.currentColor = this.darkModeColor;
            } else {
                this.currentColor = this.lightModeColor;
            }
            // ensure rotation resets
            this.rotation = 0;
            return true; // Indicate that a hard change was made
        }

        return false; // No hard change needed
    }

    update() {
        // 1. Determine which background color to fade toward
        if (darkModeSwitch1.checked) {
            // Dark Mode: Fade toward Black
            this.targetColor = this.darkModeColor;
        } else {
            // Light Mode: Fade toward White
            this.targetColor = this.lightModeColor;
        }

        // 2. Handle Rotation Smoothness
        const rotationLerp = 0.1;
        this.rotation += (this.targetRotation - this.rotation) * rotationLerp;

        // 3. Handle Color Fading
        // do not fade if on a small screen, just snap to correct color
        //    - this is for performace, triangles do not animate on small screens
        if (!this.darkLightHardChange()) {
            // Instead of (0 - current), we use (target - current)
            this.currentColor.r += (this.targetColor.r - this.currentColor.r) * FADE_SPEED;
            this.currentColor.g += (this.targetColor.g - this.currentColor.g) * FADE_SPEED;
            this.currentColor.b += (this.targetColor.b - this.currentColor.b) * FADE_SPEED;
        }
    }

    rotate() {
        const now = Date.now();
        if (now - this.lastRotateTime > ROTATION_COOLDOWN) {
            this.targetRotation += Math.PI / 1.5;

            // Set a new random bright color
            const t = Math.random();
            // Define your purple/blue range
            const c1 = { r: 81, g: 84, b: 252 };
            const c2 = { r: 187, g: 81, b: 252 };

            // Snap the current color to a bright random one
            this.currentColor.r = Math.round(c1.r + (c2.r - c1.r) * t);
            this.currentColor.g = Math.round(c1.g + (c2.g - c1.g) * t);
            this.currentColor.b = Math.round(c1.b + (c2.b - c1.b) * t);

            this.lastRotateTime = now;
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = this.opacity;

        ctx.beginPath();
        if (this.isPointUp) {
            ctx.moveTo(0, -2 * height / 3);
            ctx.lineTo(-SIZE / 2, height / 3);
            ctx.lineTo(SIZE / 2, height / 3);
        } else {
            ctx.moveTo(0, 2 * height / 3);
            ctx.lineTo(-SIZE / 2, -height / 3);
            ctx.lineTo(SIZE / 2, -height / 3);
        }
        ctx.closePath();

        // Convert the current color object to a string
        ctx.fillStyle = `rgb(${Math.round(this.currentColor.r)}, ${Math.round(this.currentColor.g)}, ${Math.round(this.currentColor.b)})`;
        ctx.fill();
        ctx.restore();
    }
}

function lerpColor(color1, color2, t) {
    const r = Math.round(color1.r + (color2.r - color1.r) * t);
    const g = Math.round(color1.g + (color2.g - color1.g) * t);
    const b = Math.round(color1.b + (color2.b - color1.b) * t);
    return `rgb(${r},${g},${b})`;
}

function resize() {
    let marginLeft = (100 - WIDTH_PERCENTAGE) / 2;
    canvas.width = window.innerWidth * (WIDTH_PERCENTAGE / 100);
    canvas.height = ((height + SPACING) * ROWS) + (height * 2);
    canvasContainer.style.height = canvas.height + "px";
    canvasContainer.style.top = `${orbContainer.offsetHeight + 50}px`; // set distance from top of page

    console.log(`canvas height ${canvas.height}, canvasContainer height ${canvasContainer.style.height}`);

    // canvas styling for rotation and centering
    canvas.style.marginLeft = `${marginLeft}%`;
    canvas.style.transform = `rotate(${CANVAS_ROTATION}deg)`;

    generateTriangles(); // Re-generate on resize to fill screen

    trianglesDrawn = false; // Reset flag to allow re-drawing on next animation frame for small screens
}

window.addEventListener("resize", resize);

// (Hitbox Based) HOVER DETECTION
window.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();

    // 1. Get raw mouse position relative to canvas element
    let mouseX = e.clientX - rect.left;
    let mouseY = e.clientY - rect.top;

    // 2. Adjust for CSS Rotation
    // We need to rotate the mouse point BACK by the same amount the canvas is rotated
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const angleRad = (CANVAS_ROTATION * Math.PI) / 180;

    // Translate point to origin (center of canvas)
    let tx = mouseX - centerX;
    let ty = mouseY - centerY;

    // Apply inverse rotation matrix
    // x' = x cos(theta) + y sin(theta)
    // y' = -x sin(theta) + y cos(theta)
    const rotatedX = tx * Math.cos(-angleRad) - ty * Math.sin(-angleRad) + centerX;
    const rotatedY = tx * Math.sin(-angleRad) + ty * Math.cos(-angleRad) + centerY;

    triangles.forEach(tri => {
        // Use the 'rotated' mouse coordinates for the hit test
        ctx.save();
        ctx.translate(tri.x, tri.y);
        ctx.rotate(tri.rotation);

        ctx.beginPath();
        if (tri.isPointUp) {
            ctx.moveTo(0, -2 * height / 3);
            ctx.lineTo(-SIZE / 2, height / 3);
            ctx.lineTo(SIZE / 2, height / 3);
        } else {
            ctx.moveTo(0, 2 * height / 3);
            ctx.lineTo(-SIZE / 2, -height / 3);
            ctx.lineTo(SIZE / 2, -height / 3);
        }

        // Check collision against the corrected coordinates
        if (ctx.isPointInPath(rotatedX, rotatedY)) {
            if (tri !== currentTriangle) {
                currentTriangle = tri;
                tri.rotate();
            }
        } else if (tri === currentTriangle) {
            // Reset tracker if we move off the triangle
            currentTriangle = null;
        }
        ctx.restore();
    });
});
function generateTriangles() {
    triangles = [];
    const COLS = Math.ceil(canvas.width / (SIZE / 2)) + 1;

    for (let row = 0; row < ROWS; row++) {

        let opacity = 1.0;

        if (row === 0 || row === ROWS - 1) {
            opacity = 0.15;
        } else if (row === 1 || row === ROWS - 2) {
            opacity = 0.40;
        } else if (row === 2 || row === ROWS - 3) {
            opacity = 0.75;
        }

        for (let col = 0; col < COLS; col++) {
            const isPointUp = (row + col) % 2 === 0;
            const baseY = row * (height + SPACING);
            const y = isPointUp ? baseY + height * 2 / 3 : baseY + height / 3;

            // add new triangle to array
            triangles.push(new Triangle(
                col * (SIZE / 2 + SPACING),
                y + height,
                isPointUp,
                opacity
            ));
        }
    }
}

resize();

darkModeSwitch1.addEventListener('change', () => {
    trianglesDrawn = false; // Reset flag to allow re-drawing on next animation frame for small screens
});

function animate() {
    // only draw triangles for smaller screens if they don't already exist
    // this is for saving performace on mobile devices, there is noticible lag without this check
    if (window.innerWidth > SMALL_SCREEN_THRESHOLD || !trianglesDrawn) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        triangles.forEach(tri => {
            tri.update();
            tri.draw(ctx);
            trianglesDrawn = true;
            
        });
    }
    requestAnimationFrame(animate);
}

animate();