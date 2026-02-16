document.addEventListener("DOMContentLoaded", function () {
    sliderSetup();
});

const notchAmount = 5;

const circles = [];

let thumbPosition = 3;

const thumbRadius = 15;

function sliderDraw() {

    const canvas = document.getElementById('ndSliders');
    const ctx = canvas.getContext('2d');

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

}


