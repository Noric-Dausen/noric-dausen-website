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
    const rotateX = (centerY - y) / 10;
    const rotateY = (x - centerX) / 10;

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

});