document.addEventListener("DOMContentLoaded", function () {
    sliderSetup();
});

const notchAmount = 10;

const circles = [];

let thumbPosition = 3;

const thumbRadius = 15;

let notchPositions = [];

let mouseDown = false;

const sliderPosGraphicalGravityIndex = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.75, 1, 2, 3]

function sliderDraw() {

    const canvas = document.getElementById('ndSliders');
    const ctx = canvas.getContext('2d');

    //Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //Track

    ctx.beginPath();
    ctx.strokeStyle = '#555';
    ctx.lineWidth = 7;
    ctx.moveTo(20, 30);
    ctx.lineTo(430, 30);
    ctx.stroke();

    //Circles

    let centerX = canvas.width / 2;
    let centerY = canvas.height / 2; 
    const radius = 8; 
    const startAngle = 0; 
    const endAngle = 2 * Math.PI; //2pi for full circle
    const counterclockwise = false; 

    const gap = ((canvas.width - 40) / (notchAmount-1));

    ctx.beginPath(); // Start a new path

    for (let i = 0; i < notchAmount; i++) {

        centerX = (gap * (i)) + 20;

        ctx.arc(centerX, centerY, radius, startAngle, endAngle, counterclockwise);

        notchPositions[i] = { x: centerX, y: centerY, notch: i };

    }

    ctx.lineWidth = 3; // line width
    ctx.strokeStyle = '#555'; //  outline color
    ctx.stroke();

    ctx.fillStyle = '#555'; // fill color
    ctx.fill();


    // Thumb (main circle)

    ctx.beginPath(); // Start a new path

    centerX = (gap * (thumbPosition - 1)) + 20;

    ctx.arc(centerX, centerY, thumbRadius, startAngle, endAngle, counterclockwise);

    ctx.lineWidth = 4; // line width
    ctx.strokeStyle = '#fff'; //  outline color
    ctx.stroke();

    ctx.fillStyle = '#1d5bb8'; // fill color
    ctx.fill();

    requestAnimationFrame(sliderDraw); // Loop the animation

}

function sliderSetup() {

    const canvas = document.getElementById('ndSliders');

    //Variable setup
    //canvas.width = '100%';
    //canvas.height = '100%';

    canvas.width = 450;
    canvas.height = 60;

    sliderDraw();

    canvas.addEventListener('mousedown', function (event) {

        thumbPosition = findClosestNotch(getMousePosition(canvas, event)) + 1;

        const operation = new CustomEvent('drUpdateGraphicalGravity', {
            detail: { data: sliderPosGraphicalGravityIndex[thumbPosition - 1] }
        })

        document.dispatchEvent(operation);

        mouseDown = true;

    });

    canvas.addEventListener('mousemove', function (event) {

        if (mouseDown) {
            thumbPosition = findClosestNotch(getMousePosition(canvas, event)) + 1;

            const operation = new CustomEvent('drUpdateGraphicalGravity', {
                detail: { data: sliderPosGraphicalGravityIndex[thumbPosition - 1] }
            })

            document.dispatchEvent(operation);
        }

    });

    canvas.addEventListener('mouseup', function (event) {

        mouseDown = false;

    });

}

function findClosestNotch(position) {

    let closestNotch = { notch: notchAmount + 1, distance: document.getElementById('ndSliders').width + 1 } // set closest notch to be a none existant and further away notch than any real notch

    notchPositions.forEach(notchPos => {

        if ((Math.sqrt( ((notchPos.x - position.x) ** 2) + ((notchPos.y - position.y) ** 2) )) < closestNotch.distance) { // Use distance formula to check if closer
            closestNotch.notch = notchPos.notch;
            closestNotch.distance = (Math.sqrt(((notchPos.x - position.x) ** 2) + ((notchPos.y - position.y) ** 2))); //If so, update closest notch to match
        }
        
    });

    return closestNotch.notch;

}

function getMousePosition(canvas, event) {
    const rect = canvas.getBoundingClientRect();
    const xPos = event.clientX - rect.left;
    const yPos = event.clientY - rect.top;
    return { x: xPos, y: yPos };
}
