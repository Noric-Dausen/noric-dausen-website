const screen = document.querySelector('.content');

let isPoweredOn = false;

let crtAnimationFrame;

let stage = 0;

//Power On System

function togglePower() {

    isPoweredOn = !isPoweredOn;

    stage = 0;

    //Prep the home screen selection for when we get there
    changeHomeSelection('up');

    if (isPoweredOn) {

        screen.style.opacity = '1';

        // We remove the animation and re-add it to "re-play" the effect
        screen.style.animation = 'none';

        // Trigger a reflow to reset the animation
        screen.offsetHeight;

        screen.style.animation = 'power-on 0.5s ease-out forwards, flicker 0.15s infinite';

        if (crtAnimationFrame) {
            cancelAnimationFrame(crtAnimationFrame);
        }

        beginAnimation();

    } else {

        screen.style.animation = 'none';

        screen.style.opacity = '0';

        if (crtAnimationFrame) {
            cancelAnimationFrame(crtAnimationFrame);
        }

        step = 0;
        skipAnimation = false;

    }
}

//Key Detection

window.addEventListener('keydown', (event) => {

    if (event.key === 'c' && event.ctrlKey) {

        togglePower();

    }

    if (event.key === 'm' && event.ctrlKey) {

        skipAnimation = true;

    }

    if (stage === 1) {
        if (event.key === 'ArrowUp') {
            changeHomeSelection('up');
            event.preventDefault();
        }

        if (event.key === 'ArrowDown') {
            changeHomeSelection('down');
            event.preventDefault();
        }

        if (event.key === 'Enter') {
            selectHomeOption();
            event.preventDefault();
        }

    }

});

const h1 = document.getElementById('crtHeader');
const text = document.getElementById('crtText');
const crtLogo = document.getElementById('crtImg');
const stage1 = document.getElementById('stage1');

let step = 0;

let skipAnimation = false;

//Startup

function beginAnimation() {

    switch (step) {
        case 0:
            crtText.style.display = 'block';
            crtLogo.style.display = 'block';
            crtHeader.style.display = 'block';
            stage1.style.display = 'none';
            crtText.textContent = '';
            h1.textContent = 'Initializing N.D.O.S.';
            break;
        case 30:
            crtText.textContent += "> LOADING NDOS VERSION 1984.2...\n";
            break;
        case 60:
            crtText.textContent += '> PERFORMING HARDWARE CHECK...\n';
            break;
        case 78:
            crtText.textContent += '> ND MOTHERBOARD...';
            break;
        case 102:
            crtText.textContent += 'OKAY\n';
            break;
        case 114:
            crtText.textContent += '> POWER SUPPLY...';
            break;
        case 132:
            crtText.textContent += 'OKAY\n';
            break;
        case 138:
            crtText.textContent += '> NDPU...';
            break;
        case 162:
            crtText.textContent += 'OKAY\n';
            break;
        case 174:
            crtText.textContent += '> STORAGE...';
            break;
        case 192:
            crtText.textContent += 'CORRUPTED\n';
            break;
        case 198:
            crtText.textContent += '> NDRAM...';
            break;
        case 222:
            crtText.textContent += 'OKAY\n';
            break;
        case 240:
            crtText.textContent += '> HARDWARE CHECK COMPLETE...\n';
            break;
        case 270:
            crtText.textContent += '> LOADING MODULES...\n';
            break;
        case 300:
            crtText.textContent += '> READING STORAGE...';
            break;
        case 312:
            crtText.textContent += 'ERROR\n';
            break;
        case 330:
            crtText.textContent += '> DELETING DATA...\n';
            break;
        case 360:
            crtText.textContent += '> STORAGE RESET COMPLETE...\n';
            break;
        case 390:
            crtText.textContent += '> FINISHING INITALIZATION...\n';
            break;
        case 420:
            crtText.textContent += '\nWELCOME TO NORIC DAUSEN OPERATING SYSTEM...\nNORIC DAUSEN RESERVES ALL RIGHTS. COPYRIGHT 1984.';
            break;
        case 500:
            crtHeader.style.display = 'none';
            crtText.style.display = 'none';
            crtLogo.style.opacity = '0.8';
            crtLogo.style.transition = 'none';
            break;
        case 650:
            crtHeader.style.display = 'none';
            crtText.style.display = 'none';
            crtLogo.style.opacity = '0';
            crtLogo.style.transition = 'opacity 1s ease-out';
            break;
        case 800:
            crtLogo.style.display = 'none';
            stage1.style.display = 'block';
            stage = 1;
            break;

    }

    if (skipAnimation) {
        step = 1000;
        crtHeader.style.display = 'none';
        crtText.style.display = 'none';
        crtLogo.style.display = 'none';
        stage1.style.display = 'block';
        stage = 1;
    }

    step++;

    if (step < 850) {
        crtAnimationId = requestAnimationFrame(beginAnimation);
    } else if (crtAnimationFrame) {
         
         cancelAnimationFrame(crtAnimationFrame);
        
    }

}

//Home Screen

const homeOptions = ['s1o1', 's1o2', 's1o3'];

let homePosition = 0;

function changeHomeSelection(direction) {
    switch (direction) {
        case 'up':
            homePosition--;
            break;
        case 'down':
            homePosition++;
            break;
        case 'left':
            break;
        case 'right':
            break;
    }

    if (homePosition < 0) {
        homePosition = 0;
    }

    if (homePosition >= homeOptions.length) {
        homePosition = homeOptions.length - 1;
    }

    homeOptions.forEach((option, index) => {
        const element = document.getElementById(option);

        if (index === homePosition) {
            element.classList.add('selected');
        } else {
            element.classList.remove('selected');

        }
    });

}

function selectHomeOption() {

    switch (homeOptions[homePosition]) {
        case 's1o1':
            alert('You selected option A!');
            break;
        case 's1o2':
            alert('You selected option B!');
            break;
        case 's1o3':
            togglePower();
            break;
    }

}