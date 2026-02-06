// get the canvas element and the rendering context
const canvas = document.getElementById("trianglesbg");
const ctx = canvas.getContext("2d");

// triangle data
let triangles = [];
const SPACING = 10; // space between triangles
const SIZE = 80; // triangle size (adjust for density)
const HEIGHT = SIZE * Math.sqrt(3) / 2; // height of an equilateral triangle
const ROWS = 12;
const CENTROID_OFFSET = HEIGHT / 6;

// Triangle class
class Triangle {
    constructor(x, y, isPointUp) {
        this.x = x;
        this.y = y;
        this.isPointUp = isPointUp;

        this.rotation = 0; // radians

        // random t between 0 and 1
        const t = Math.random();
        this.color = lerpColor({ r: 81, g: 84, b: 252 }, { r: 187, g: 81, b: 252 }, t);
    }

    drawDot(ctx, radius = 4) {
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.fillStyle = "red";
        ctx.fill();
    }

    draw(ctx) {
        ctx.save();

        // centroid in world space
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

        // debug: show true centroid
        //this.drawDot(ctx);

        ctx.restore();
    }

}

// helper function to interpolate between two colors
function lerpColor(color1, color2, t) {
    // color1 and color2 are {r,g,b}, t = 0..1
    const r = Math.round(color1.r + (color2.r - color1.r) * t);
    const g = Math.round(color1.g + (color2.g - color1.g) * t);
    const b = Math.round(color1.b + (color2.b - color1.b) * t);
    return `rgb(${r},${g},${b})`;
}

// function to resize the canvas
function resize() {
    let triangleHeight = (HEIGHT + SPACING);

    canvas.width = window.innerWidth;
    canvas.height = (triangleHeight * ROWS) + (HEIGHT * 2);
}
window.addEventListener("resize", resize);

function generateTriangles() {
    triangles = [];

    const COLS = Math.ceil(canvas.width / (SIZE / 2)) + 1;

    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {

            // create new triangle at the correct position, alternating orientation

            const isPointUp = (row + col) % 2 === 0;

            // Compute the y position so tips/bases align visually
            const baseY = row * (HEIGHT + SPACING); // top of row
            const y = isPointUp ? baseY + HEIGHT * 2 / 3 : baseY + HEIGHT / 3;

            const newTriangle = new Triangle(
                col * (SIZE / 2 + SPACING),
                y + HEIGHT,
                isPointUp
            );

            triangles.push(newTriangle);
        }
    }
}

// set size and draw initial triangles
resize();
generateTriangles();

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    triangles.forEach(tri => tri.draw(ctx));
}
function update() {
    triangles.forEach((tri, i) => {
        tri.rotation += 0.002 + i * 0.000001;
    });
}

function animate() {
    update();
    draw();
    requestAnimationFrame(animate);
}

animate();