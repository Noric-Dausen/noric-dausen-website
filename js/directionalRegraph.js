document.addEventListener("DOMContentLoaded", function () {
    setup();
});

// Variables for line positions and movement
//Verticals
let yPos = [0, -1300]; // Initial positions of the lines (pixels); there are two lines, so one is going while the other is waiting to start, this creates a continuous effect. The second line starts at -lineHeight so it will start right after the first one finishes
let xPos = [5, 10, 15, 20, 25,
           30, 35, 40, 45, 50,
           55, 60, 65, 70, 75,
           80, 85, 90, 95]; // X position of the lines (NOTE: these are in percentage of the canvas width, not pixels)
let offset = [50, 0, 200, 175, 150,
              125, 275, 100, 150, 300,
              50, 100, 150, 200, 250,
              300, 350, 400, 450]; // Offset for the line movement (pixels) NOTE: there must be the same amount of offsets as xPos, and they will be applied in order to the lines, so the first line will have the first offset, the second line will have the second offset, etc. Mismatch will lead to errors
const lineHeight = 1300; // Height of the line segment
let lineSpeed = 3; // Speed of the line movement

//Horizontals
let xPosH = [0, -window.innerWidth];
let yPosH = [200, 300, 400, 500, 600,
            700, 800, 900, 1000, 1100];
let offsetH = [100, 200, 50, 300, 150,
               200, 0, 100, 350, 200];
let lineSpeedH = 4;

let lineSpeeds = [lineSpeed, lineSpeedH];

function draw() {

    const canvas = document.getElementById('dr');
    const ctx = canvas.getContext('2d');

    //Clear the canvas

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);

    //#region Gradient

    gradient.addColorStop(0, '#e6e6e6');   // Transparent at top
    gradient.addColorStop(0.2, '#fafafa'); // Full color at 20%
    gradient.addColorStop(0.8, '#fafafa'); // Stay full until 80%
    gradient.addColorStop(1, '#e6e6e6');   // Transparent at bottom

    ctx.fillStyle = gradient; // Pick a color
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //#endregion

    //#region Line Segment (Vertical)

    //Line drawing function

    function drawLineSegment(y, x) {

        //Set up trail gradient
        const trail = ctx.createLinearGradient(0, y - lineHeight, 0, y);
        trail.addColorStop(0, 'rgba(230, 230, 230, 0.4)'); // Transparent at the top of the line
        trail.addColorStop(0.2, 'rgba(230, 230, 230, 0.6)');
        trail.addColorStop(0.5, 'rgba(230, 230, 230, 1)'); // Opaque at 50% of the line
        trail.addColorStop(1, 'rgba(230, 230, 230, 1)'); // Opaque at the bottom of the line

        //draw line segment
        ctx.beginPath();
        ctx.strokeStyle = trail;
        ctx.lineWidth = 2;
        ctx.moveTo(x, y - lineHeight);
        ctx.lineTo(x, y);
        ctx.stroke();

    }

    //For each yPos

    let u = 0; // Counter to track current line

    for (let i = 0; i < xPos.length * yPos.length; i++) {

        drawLineSegment(yPos[i % 2] - offset[u], percentageToPixel(xPos[u])); // Draw the line at the current position

        yPos[i % 2] += lineSpeed / xPos.length; // Move the line down (because we run this once per xPos per frame we divide by the amount of xPoses to counteract the speed change))

        if (yPos[i % 2] - lineHeight > canvas.height) {
            yPos[i % 2] = 0; // Reset to the top once it goes off the bottom
        }


        if (i % 2 === 1) {
            u++;
        }

    }

    //#endregion

    //#region Line Segment (Horizontal)

    function drawHorizontalLineSegment(y, x) {

        //Set up trail gradient
        const trailH = ctx.createLinearGradient(x - canvas.width, 0, x, 0);
        trailH.addColorStop(0, 'rgba(230, 230, 230, 0.2)'); // Transparent at the top of the line
        trailH.addColorStop(0.3, 'rgba(230, 230, 230, 0.6)');
        trailH.addColorStop(0.65, 'rgba(230, 230, 230, 1)'); // Opaque at 50% of the line
        trailH.addColorStop(1, 'rgba(230, 230, 230, 1)'); // Opaque at the bottom of the line

        //draw line segment
        ctx.beginPath();
        ctx.strokeStyle = trailH;
        ctx.lineWidth = 2;
        ctx.moveTo(x - canvas.width, y);
        ctx.lineTo(x, y);
        ctx.stroke();

    }

    u = 0; // Reset counter for horizontal lines

    for (let i = 0; i < yPosH.length * xPosH.length; i++) {

        //drawHorizontalLineSegment(yPosH[i % 2] - offsetH[i % 2], xPosH[i % 2]); // Draw the line at the current position

        drawHorizontalLineSegment(yPosH[u], xPosH[i % 2] - offsetH[u]);

        xPosH[i % 2] += lineSpeedH / yPosH.length; // Move the line to the right

        if (xPosH[i % 2] - canvas.width > canvas.width) {
            xPosH[i % 2 ] = 0; 
        }

        if (i % 2 === 1) {
            u++;
        }

    }

    //#endregion

    //Deaccelerate the lines (allows graph grid to appear quickly but not appear to be moving fast later on)

    if (lineSpeed > lineSpeeds[0]) {
        lineSpeed -= 0.02; // Decrease the speed of the vertical lines
    }

    if (lineSpeedH > lineSpeeds[1]) {
        lineSpeedH -= 0.02; // Decrease the speed of the horizontal lines
    }

    requestAnimationFrame(draw); // Loop the animation

}

function setup() {

    const canvas = document.getElementById('dr');

    //Variable setup
    canvas.width = window.innerWidth;
    canvas.height = 1300; // Set your desired height here

    //Accelerate the lines at the start of the animation (makes it show up quickly)

    lineSpeed *= 3;
    lineSpeedH *= 3;

    draw();

}

function percentageToPixel(percentage) {
    const canvas = document.getElementById('dr');

    return (percentage / 100) * canvas.width;
}