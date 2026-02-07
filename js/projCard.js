const containers = document.querySelectorAll('.project-card-container');
const projectsTitle = document.querySelector('.projects-title');
let currentSelection = 'none';
let defaultContainerSize; //This variable is filled on DOMContentLoaded with the current size of a card.
const dynamicButton = document.createElement("button");
dynamicButton.innerHTML = "";
dynamicButton.type = "button";
dynamicButton.setAttribute('class', 'projCloseButton');
const dynamicButtonSpan1 = document.createElement("span");
dynamicButton.appendChild(dynamicButtonSpan1);
dynamicButtonSpan1.setAttribute('class', 'proj-close-span1');
const dynamicButtonSpan2 = document.createElement("span");
dynamicButton.appendChild(dynamicButtonSpan2);
dynamicButtonSpan2.setAttribute('class', 'proj-close-span2');
dynamicButton.style.transition = 'width 0s ease-in-out 0.2s, opacity 0.2s';
dynamicButton.style.opacity = '0';
dynamicButton.style.width = '0rem';
let resizeTimeout;

containers.forEach(container => {

    const card = container.querySelector('.project-card');

container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();

    // Calculate mouse position relative to the center of the container
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate rotation angles (value can be adjusted for more/less tilt ||| NOTE: higher values mean less tilt)
    let rotateX = (centerY - y) / 20;
    let rotateY = (x - centerX) / 20;

    //Reduce angles if the card is selected.
    if (container.id === currentSelection) {

        rotateX = rotateX / 10;
        rotateY = rotateY / 10;

        if (window.innerWidth > 2000) { //On larger screens, the angles are reduced more to avoid excessive tilt)

            rotateX = rotateX / 2;
            rotateY = rotateY / 2;

        }

        if (window.innerWidth < 1000) { //On smaller screens, the angles are increased more to make tilt noticable)
            rotateX = rotateX * 1.5;
            rotateY = rotateY * 1.5;
        }

    }

    // Apply rotation and scale to the card
    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;

    const percentX = (x / rect.width) * 100;
    const percentY = (y / rect.height) * 100;

    card.style.setProperty('--mouse-x', `${percentX}%`);
    card.style.setProperty('--mouse-y', `${percentY}%`);
});

//reset the card rotation and scale when the mouse leaves the container

container.addEventListener('mouseleave', () => {
    card.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
});

    container.addEventListener('click', () => {

        let sameCard = false;

        if (container.id === currentSelection) {
            //sameCard = true;
        }

        //Update Selection
        deselectCard(getCardFromID(currentSelection));

        if (!sameCard) { currentSelection = container.id; }

        //Update Position
        positionCards();

        //Create Close Button
        addCloseButton();

    });

});

dynamicButton.addEventListener("click", function () {

    closeCard();

});

// Position all cards to their respective positions on the grid on DOM load
document.addEventListener('DOMContentLoaded', function () { 

    defaultContainerSize = containers[0].getBoundingClientRect();

    positionCards();

});

window.addEventListener("load", (event) => {

    //To avoid everything animating itself moving from the corner, all animations are 0s until the full page has laoded
    projectsTitle.style.transitionDuration = '0.4s';

    containers.forEach(container => {

        //Height and width changes are delayed and shorter than the movement to improve smoothness.
        container.style.transition = 'transform 0.6s, height 0.3s ease-in-out 0.1s, width 0.3s ease-in-out 0.1s';

    });

});

//On scroll, make sure the selected card stays in position
window.addEventListener('scroll', function () {
    containers.forEach(container => {
        if (container.id === currentSelection) {
            positionSelectedCard(container);
        }
    });
});

function positionCards() {

    positionTitle();

    containers.forEach(container => {

        const card = container.querySelector('.project-card');

        //Get the ID of the container to determine its position
        const id = container.id;
        const containerSize = defaultContainerSize;

        container.style.position = 'absolute';

        const newPosition = getCardPositionById(id, containerSize);

        //container.style.left = newPosition.x + 'vw';
        //container.style.top = newPosition.y + 'vh';

        absTranslate(container, newPosition);

        /*container.style.transform = `translate(${newPosition.x}vw, ${newPosition.y}vh)`;*/

        //Procceed only if variant 2
        if (currentSelection === 'none') {
            return;
        }

        //Remove Information fill on all cards
        container.classList.remove('information-fill');

        if (container.id === currentSelection) {

            positionSelectedCard(container);

            //Information fill on selected card

            container.classList.add('information-fill');

            document.body.classList.add('card-selected');

        }

    });

    const pageMain = document.querySelector('main');

    pageMain.style.height = '1140px';

    if (window.innerWidth < 950) {
        pageMain.style.height = '2350px';
        document.body.classList.add('card-selected');
    }

    if (window.innerWidth < 700) {
        pageMain.style.height = '3050px';
        document.body.classList.add('card-selected-mobile');
    }

    if (currentSelection !== 'none') {
        pageMain.style.height = '2350px';

        if (window.innerWidth < 700) {
            pageMain.style.height = '3050px';
        }
    }

}

function positionSelectedCard(container) {

    let newSize = { width: 70, height: 85 };

    let xValue = 62;

    //Change size for smaller screens

    if (window.innerWidth < 1300) {
        newSize = { width: 60, height: 85 };
        xValue = 65;
    }

    if (window.innerWidth < 950) {
        newSize = { width: 80, height: 85 };
        xValue = 50;
    }

    if (window.innerWidth < 700) {
        newSize = { width: 80, height: 70 };
    }

    container.style.width = newSize.width + 'vw';
    container.style.height = newSize.height + 'vh';


    //container.style.left = cornerizeUnits({ x: 62, y: 55 }, newSize).x + 'vw';
    //container.style.top = cornerizeUnits({ x: 62, y: 55 }, newSize).y + 'vh';

    let yDown = pixelsToViewPort(window.scrollY, true);

    //Depending on how the user has scrolled, adjust the Y position slightly to ensure the card always apppears centered/in proper position
    if (pixelsToViewPort(window.scrollY, true) > 5 && !(window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 1)) {
        yDown += 50;
    } else if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 1) {
        yDown += 45;
    } else {
        yDown += 55;
    }

    if (window.innerWidth < 950) { //Below 950px, we switch this page to a single column layout, so the selected card stays at the top
        yDown = 72;
    }

    if (window.innerWidth < 700) {
        yDown = 63;
    }

    absTranslate(container, cornerizeUnits({ x: xValue, y: yDown }, newSize));
}

function positionTitle() {

    let centerColumnX = 50;

    if (currentSelection !== 'none') {
        centerColumnX = 13.5;

        if (window.innerWidth < 1300) {

            centerColumnX = 17.5;
        }

        if (window.innerWidth < 950) {
            centerColumnX = 50;
        }

    }

    const newPosX = centerColumnX - pixelsToViewPort(projectsTitle.clientWidth / 2);

    /*projectsTitle.style.transform = `translate(${newPosX}, 0px)`;*/

    absTranslate(projectsTitle, { x: newPosX, y: projectsTitle.style.top })

}

function addCloseButton() {

    getCardFromID(currentSelection).appendChild(dynamicButton);

    setCloseWidths();

}

// A Seperate Function to Find the position of a card based on its ID (returns in viewport units)
function getCardPositionById(rawID, cardSize) {

    //Number of Columns
    let columns = 3;

    //Size of gaps
    let gapX = 1;
    const gapY = 2;

    //How far down the grid of cards starts
    let YStartingPos = 25;

    //Variable changes for smaller screens/mobile
    if (window.innerWidth < 950) {
        columns = 2;
        gapX = 2;
        YStartingPos = 30;
    }

    if (window.innerWidth < 700) {
        columns = 1;
        gapX = 2;
    }

    //The variable that will be modified and eventually returned; starts empty
    const currentPos = { x: 0, y: 0 };

    //Current Card ID number
    let id = parseInt(rawID.replace('card', ''));

    //Where the center of the column should be located; the X center of the page (in viewport width units) is always 50vw; 13.5vw for side position.
    let centerColumnX = 50;

    //Switch to variant two once a card is selected
    if (currentSelection !== 'none') {
        //If the current ID is above the selected CardID it needs to have one subtracted to fill the empty space left by the selected card
        if (id > parseInt(currentSelection.replace('card', ''))) {
            id--;
        }

        //Change Column and start positions

        columns = 1;
        centerColumnX = 13.5;

        if (window.innerWidth < 1300) {
            centerColumnX = 17.5;
        }

        if (window.innerWidth < 950) {

            centerColumnX = 50;
            YStartingPos = 120;
            columns = 2;

        }

        if (window.innerWidth < 700) {
            columns = 1;
        }

    }

    //Find Row Displacement; Row Displacement is the amount of columns left/right from the center
    const rowDisplacement = Math.floor(columns / 2); //Alternatively you could use modulo: (columns-(columns%2))/2

    //Find the current column of the card and offset it so that the the third column is the center (0)
    const currentColumn = (((id - 1) % columns)-rowDisplacement);

    //Find the distance to move the cards to center it OR if even columns, to properly position it
    let centerOffset = pixelsToViewPort(cardSize.width / 2);

    if (columns % 2 !== 1) {
        centerOffset = -gapX / 2;
    }

    //Find the current column and set the X position based on that
    currentPos.x = (centerColumnX + ((pixelsToViewPort(cardSize.width)+gapX) * currentColumn))-centerOffset; //Note: - 1 half of the cardwith from the position because we are setting the position of the corner, not the center

    //Find the current row of the card (subtraction on the end ensures that starting row is always 0)
    const currentRow = ((id - ((id-1) % columns)) / columns) - (1/columns);

    currentPos.y =  YStartingPos + ((pixelsToViewPort(cardSize.height, true)+gapY)*currentRow);

    return currentPos;
}

//Function to convert centerized units (coordinates of the center of an object) to cornerized units (cooridnates of the top-left corner of an object)
function cornerizeUnits(position, objectRect, convertToViewport) {

    rectWidth = objectRect.width;
    rectHeight = objectRect.height;

    //Convert to viewport units if requested
    if (convertToViewport) {
        rectWidth = pixelsToViewPort(objectRect.width);
        rectHeight = pixelsToViewPort(objectRect.height, true);
    }

    //Variable to modify and return
    const currentPos = { x: 0, y: 0 };

    //Convert to Corner
    currentPos.x = position.x - (rectWidth / 2);
    currentPos.y = -((-position.y) + (rectHeight / 2));

    return currentPos;
}

//Function that sets cards back to their regular size
function deselectCard(container) {

    if (container === 'null') {
        return;
    }

    container.style.width = '300px';
    container.style.height = '400px';

    container.classList.remove('information-fill');

    document.body.classList.remove('card-selected');

    currentSelection = 'none';
}

function getCardFromID(rawID) {

    let returnContainer = 'null';

    containers.forEach(container => {
        if (container.id === rawID) {
            returnContainer = container;
        }
    });

    return returnContainer;
}

//Function to quickly convert from pixels to vw and vh
function pixelsToViewPort(value, height) {
    if (!height) {
        return (value/window.innerWidth)*100;
    }
    return (value / window.innerHeight) * 100;
}

//function that moves an object from its old position to a new one via the translate() cs function
function absTranslate(object, newPosition) {

    const oldPosition = { x: object.style.left, y: object.style.top };

    let difference = { x: 0, y: 0 };

    difference.x = newPosition.x - oldPosition.x;
    difference.y = newPosition.y - oldPosition.y;

    object.style.transform = `translate(${difference.x}vw, ${difference.y}vh)`;
}

async function setCloseWidths() {
    await delay(1);

    dynamicButton.style.transition = 'width 0.1s ease-in-out 0.2s, opacity 0.2s';
    dynamicButton.style.opacity = '1';
    dynamicButton.style.width = '3rem';

}

async function closeCard() {

    await delay(3); //Delay for any amount to ensure that the deselection is not immediately undone by the card underneath.
    //If only 2 seconds delayed, then the animation properties are sometimes set to wrong amount

    dynamicButton.style.transition = 'width 0s ease-in-out 0.2s, opacity 0.2s';
    dynamicButton.style.opacity = '0';
    dynamicButton.style.width = '0rem';

    const oldSelection = currentSelection; //Remember old selection so that even after selection is changed the close button can be removed from the correct card

    deselectCard(getCardFromID(currentSelection));

    positionCards();

    await delay(400);

    getCardFromID(oldSelection).removeChild(dynamicButton);

}

// Function to create a delay
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function log(message) {

    const logOperation = new CustomEvent('consoleLog', {
        detail: { data: message }
    })

    window.dispatchEvent(logOperation);
}

//Auto Resize Function

window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {

        positionCards();

        //On resize, add card-selected so the background changes

        if (window.innerWidth < 700) {
            document.body.classList.add('card-selected-mobile');
        } else {
            document.body.classList.remove('card-selected-mobile');
        }

        if (currentSelection !== 'none') {
            document.body.classList.add('card-selected');
        } else {
            document.body.classList.remove('card-selected');
        }

        if (window.innerWidth < 950) {
            document.body.classList.add('card-selected');
        } else {
            document.body.classList.remove('card-selected');
        }

    }, 100); //Amount of time inbetween resize and when the function is executed; this is to avoid the function being called multiple times during a resize, which can cause performance issues

});

//Console Listeners (allows easier debugging)
document.addEventListener('execution', (e) => {
    alert('Execution Succeeded: ' + e.detail.data);
});

window.addEventListener('alert', (e) => {
    alert('Execution Succeeded: ' + e.detail.data);

    window.dispatchEvent('alert2');
});

document.addEventListener('getSelection', (e) => {
    alert('Current Selection: ' + currentSelection);
});

document.addEventListener('pxToViewport', (e) => {

    let msg = e.detail.data[0] + "px is equivalent to ";

    if (e.detail.data[1] === 'true') {
        msg += pixelsToViewPort(e.detail.data[0], true) + 'vh';
    } else {
        msg += pixelsToViewPort(e.detail.data[0]) + 'vw';
    }

    alert(msg);

});

document.addEventListener('deselect', (e) => {

    deselectCard(getCardFromID(e.detail.data[0]));

});
