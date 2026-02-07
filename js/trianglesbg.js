const canvas = document.getElementById("trianglesbg");
const ctx = canvas.getContext("2d");

let triangles = [];
const SPACING = 10;
const SIZE = 120;
const HEIGHT = SIZE * Math.sqrt(3) / 2;
const ROWS = 8;

class Triangle {
    constructor(x, y, isPointUp) {
        this.x = x;
        this.y = y;
        this.isPointUp = isPointUp;
        this.rotation = 0;
        this.targetRotation = 0; // Fixed: Initialize this!

        const t = Math.random();
        this.color = lerpColor({ r: 81, g: 84, b: 252 }, { r: 187, g: 81, b: 252 }, t);
    }

    update() {
        const lerpFactor = 0.1;
        // Smoothly interpolate current rotation to target
        this.rotation += (this.targetRotation - this.rotation) * lerpFactor;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        ctx.beginPath();
        if (this.isPointUp) {
            ctx.moveTo(0, -2 * HEIGHT / 3);
            ctx.lineTo(-SIZE / 2, HEIGHT / 3);
            ctx.lineTo(SIZE / 2, HEIGHT / 3);
        } else {
            ctx.moveTo(0, 2 * HEIGHT / 3);
            ctx.lineTo(-SIZE / 2, -HEIGHT / 3);
            ctx.lineTo(SIZE / 2, -HEIGHT / 3);
        }
        ctx.closePath();

        ctx.fillStyle = this.color;
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
    canvas.width = window.innerWidth;
    canvas.height = ((HEIGHT + SPACING) * ROWS) + (HEIGHT * 2);
    generateTriangles(); // Re-generate on resize to fill screen
}

window.addEventListener("resize", resize);

/*const HOVER_RADIUS = 80; // Adjust this: larger = more sensitive
// (Distance Based) HOVER DETECTION
window.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    triangles.forEach(tri => {
        // Calculate distance between mouse and triangle center
        const dx = mouseX - tri.x;
        const dy = mouseY - tri.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // If mouse is within the radius, rotate it
        if (distance < HOVER_RADIUS) {
            tri.targetRotation = Math.PI / 1.5; // 120 degrees
        } else {
            tri.targetRotation = 0;
        }
    });
});*/

// (Hitbox Based) HOVER DETECTION
window.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    triangles.forEach(tri => {
        // To check if mouse is inside a ROTATED shape:
        // 1. Save context, apply the same transformations used in draw()
        ctx.save();
        ctx.translate(tri.x, tri.y);
        ctx.rotate(tri.rotation);

        // 2. Define the path (locally)
        ctx.beginPath();
        if (tri.isPointUp) {
            ctx.moveTo(0, -2 * HEIGHT / 3);
            ctx.lineTo(-SIZE / 2, HEIGHT / 3);
            ctx.lineTo(SIZE / 2, HEIGHT / 3);
        } else {
            ctx.moveTo(0, 2 * HEIGHT / 3);
            ctx.lineTo(-SIZE / 2, -HEIGHT / 3);
            ctx.lineTo(SIZE / 2, -HEIGHT / 3);
        }

        // 3. Check if mouse point is inside this specific path
        if (ctx.isPointInPath(mouseX, mouseY)) {
            tri.targetRotation = Math.PI / 1.5; // 120 degrees
        } else {
            tri.targetRotation = 0;
        }
        ctx.restore();
    });
});

function generateTriangles() {
    triangles = [];
    const COLS = Math.ceil(canvas.width / (SIZE / 2)) + 1;
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            const isPointUp = (row + col) % 2 === 0;
            const baseY = row * (HEIGHT + SPACING);
            const y = isPointUp ? baseY + HEIGHT * 2 / 3 : baseY + HEIGHT / 3;
            triangles.push(new Triangle(col * (SIZE / 2 + SPACING), y + HEIGHT, isPointUp));
        }
    }
}

resize();

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    triangles.forEach(tri => {
        tri.update();
        tri.draw(ctx);
    });
    requestAnimationFrame(animate);
}

animate();