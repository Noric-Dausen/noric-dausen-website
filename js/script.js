const toggle = document.getElementById('toggleInput');

toggle.addEventListener('change', () => {
    // when the toggle is changed, smoothly transition background color
    document.body.style.transition = "background-color 0.5s ease";
    document.body.classList.toggle('dark-mode');

    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }

});

const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links-mobile');
const hamline1 = document.getElementById('hline-short');
const hamline2 = document.getElementById('hline-long');

hamburgerRecentlyClicked = false;

hamburger.addEventListener('click', () => {
    // This adds 'active' if it's not there, and removes it if it is

    // Prevents rapid clicking from causing issues with the hamburger menu animation
    if (!hamburgerRecentlyClicked) {
        navLinks.classList.toggle('active');
        hamline1.classList.toggle('active');
        hamline2.classList.toggle('active');
    }

    hamburgerRecentlyClicked = true;
    resetHamburgerTimer();
});

// Function to create a delay
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//Function to reset the hamburgerRecentlyClicked flag after a delay
async function resetHamburgerTimer() {

    await delay(350); // The delay (milliseconds) before the user can open/close the hamburger menu again
    hamburgerRecentlyClicked = false;
}

toggle.addEventListener('test', (e) => {
    alert('Test Succeeded: ' + e.detail.data);
});

// Create the observer
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        // If the element is visible
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
            // Optional: stop observing once shown if you only want it to happen once
            // observer.unobserve(entry.target); 
        } else {
            // Optional: remove 'show' if you want it to hide again when scrolling up
            // entry.target.classList.remove('show');
        }
    });
}, {
    threshold: 0.4 // Trigger when 40% of the element is visible
});

// Select all sections and start observing them
const hiddenElements = document.querySelectorAll('.section');
hiddenElements.forEach((el) => observer.observe(el));