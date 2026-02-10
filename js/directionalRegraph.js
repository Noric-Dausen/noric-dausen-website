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

//Variables for the actual graph

const lowerBound = 900; //Lowest point that the graph can start ||| Because positions go down, this a higher number than the upper bound, but it is still the lower bound because it is lower on the graph
const upperBound = 300; // Highest point that the graph can start

const changeBound = 30; // This is how much the graph can change between each data point, this creates a more natural movement

const graphSpeed = 6; // Speed at which the graph moves to the right (higher means more frames between each new data point, which means slower movement)
let graphPosition = 0; // Internal variable that tracks position (Counts up every frame)

let pointsGenerated = 1; // Counter to track how many points have been generated, this is used to know when to start replacing points for the regraph effect

let graphData = []; // This will hold the data points for the graph, it will be an array of objects with x and y properties

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

    //#region Graph Segment

    //Draw the red (downward movement) of the graph

    ctx.beginPath();
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    ctx.moveTo(graphData[0].x, graphData[0].y);

    for (let i = 1; i < graphData.length; i++) {

        if (graphData[i].trend !== 'down') {

            if (i === pointsGenerated) {
                ctx.moveTo(graphData[i].x, graphData[i].y);
            } else if (i + 1 !== pointsGenerated) {
                ctx.lineTo(graphData[i].x, graphData[i].y);
            } else {
                ctx.moveTo(graphData[i].x, graphData[i].y);
            }

        } else {

            ctx.moveTo(graphData[i].x, graphData[i].y);

        } 

    }

    ctx.stroke();

    //Draw the green (upward movement) of the graph

    ctx.beginPath();
    ctx.strokeStyle = 'green';
    ctx.lineWidth = 2;
    ctx.moveTo(graphData[0].x, graphData[0].y);

    for (let i = 1; i < graphData.length; i++) {

        if (graphData[i].trend === 'down') {

            if (i === pointsGenerated) {
                ctx.moveTo(graphData[i].x, graphData[i].y);
            } else if (i + 1 !== pointsGenerated) {
                ctx.lineTo(graphData[i].x, graphData[i].y);
            } else {
                ctx.moveTo(graphData[i].x, graphData[i].y);
            }

        } else {

            ctx.moveTo(graphData[i].x, graphData[i].y);

        }

    }

    ctx.stroke();

    //Create new data point

    if (graphPosition % graphSpeed === 0) { // Only create a new data point every graphSpeed frames, this controls the speed of the graph movement

        
         graphData[pointsGenerated] = createNewDataPoint();

        pointsGenerated++;

        if (pointsGenerated === 101) {
            pointsGenerated = 1;
        }

    }

    graphPosition++;

    // Line

    

    const trail3 = ctx.createLinearGradient(0, canvas.height, 0, 0);
    trail3.addColorStop(0, 'rgba(180, 180, 180, 0)'); // Transparent at the top of the line
    trail3.addColorStop(0.28, 'rgba(180, 180, 180, 1)');
    trail3.addColorStop(0.72, 'rgba(180, 180, 180, 1)'); // Opaque at 50% of the line
    trail3.addColorStop(1, 'rgba(180, 180, 180, 0)'); // Opaque at the bottom of the line

    //draw line segment

    ctx.beginPath();
    ctx.strokeStyle = trail3;
    ctx.lineWidth = 2;
    ctx.moveTo(graphData[pointsGenerated - 1].x - percentageToPixel(1), 0);
    ctx.lineTo(graphData[pointsGenerated - 1].x - percentageToPixel(1), canvas.height);
    ctx.stroke();

    //#endregion


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

    //Graph setup

    graphData[0] = { x:0, y:(Math.random() * (lowerBound - upperBound)) + upperBound }; // This is the formula for getting a random number between the two bound

    draw();

}

function percentageToPixel(percentage) {
    const canvas = document.getElementById('dr');

    return (percentage / 100) * canvas.width;
}

function createNewDataPoint() {

    let lastY = graphData[(pointsGenerated) - 1].y; // Get the y value of the last data point

    let temp = { x: 0, y: 0, trend:'up'};

    temp.x = (pointsGenerated) * percentageToPixel(1); // 100 total data points

    let tempFactor = (Math.random() - 0.5) * 2 // Seperated so we can measure it

    if (tempFactor < 0) { 
        temp.trend = 'down'; // Trend allows us to know if the graph is moving down or up from the last point
    }

    temp.y = (tempFactor * changeBound) + lastY; // Base new Y to be a modification of last Y

    if (temp.y > lowerBound) { temp.y = lowerBound; }

    if (temp.y < upperBound) { temp.y = upperBound; }

    return temp;
}