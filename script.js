const toggle = document.getElementById('toggleInput');

toggle.addEventListener('change', () => {
    // when the toggle is changed, smoothly transition background color
    document.body.style.transition = "background-color 0.5s ease";
    document.body.classList.toggle('dark-mode');
    navLinks.classList.toggle('dark-mode');
    if (toggle.checked) {
        document.body.style.backgroundColor = "#222"; // Dark mode example
        document.body.style.color = "#fff";
        navLinks.style.backgroundColor = "#2a2a2a"; // Adjust nav background for dark mode
    } else {
        document.body.style.backgroundColor = "#fff"; // Light mode example
        document.body.style.color = "#000";
        navLinks.style.backgroundColor = "#f4f4f4"; // Adjust nav background for light mode
    }
});

const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links-mobile');
const hamline1 = document.getElementById('hline-short');
const hamline2 = document.getElementById('hline-long');

hamburger.addEventListener('click', () => {
    // This adds 'active' if it's not there, and removes it if it is
    navLinks.classList.toggle('active');
    hamline1.classList.toggle('active');
    hamline2.classList.toggle('active');
});