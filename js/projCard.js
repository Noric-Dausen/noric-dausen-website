const containers = document.querySelectorAll('.project-card-container');

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
    const rotateX = (centerY - y) / 20;
    const rotateY = (x - centerX) / 20;

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

        container.style.width = '65vw';
        container.style.height = '75vh';
    });

});

document.getElementById('projCloseButton').addEventListener('click', () => {

});

// Position all cards to their respective positions on the grid on DOM load
document.addEventListener('DOMContentLoaded', function () { 
    
    containers.forEach(container => {

        const card = container.querySelector('.project-card');

        //Get the ID of the container to determine its position
        const id = container.id;
        const containerSize = container.getBoundingClientRect();

        container.style.position = 'absolute';
        container.style.left = getCardPositionById(id, containerSize).x + 'vw';
        container.style.top = getCardPositionById(id, containerSize).y + 'vh';

    });

});

// A Seperate Function to Find the position of a card based on its ID
function getCardPositionById(rawID, cardSize) {

    //Number of Columns
    const columns = 5;

    //Size of gaps
    const gapX = 1;
    const gapY = 1;

    //How far down the grid of cards starts
    const YStartingPos = 25;

    //The variable that will be modified and eventually returned; starts empty
    const currentPos = { x: 0, y: 0 };

    //Current Card ID number
    const id = parseInt(rawID.replace('card', ''));

    //Find Row Displacement; Row Displacement is the amount of columns left/right from the center
    const rowDisplacement = Math.floor(columns / 2); //Alternatively you could use modulo: (columns-(columns%2))/2

    //Find the current column of the card and offset it so that the the third column is the center (0)
    const currentColumn = (((id - 1) % columns)-rowDisplacement);

    //The X center of the page (in viewport width units) is always 50vw
    const centerColumnX = 50;

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

//Function to quickly convert from pixels to vw and vh
function pixelsToViewPort(value, height) {
    if (!height) {
        return (value/window.innerWidth)*100;
    }
    return (value / window.innerHeight) * 100;
}

document.addEventListener('execute', function (e) {

    alert('Execution Succeeded: ' + e.detail.message);

});
