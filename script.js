const toggle = document.getElementById('toggleInput');

toggle.addEventListener('change', () => {
    // when the toggle is changed, smoothly transition background color
    document.body.style.transition = "background-color 0.5s ease";
    document.body.classList.toggle('dark-mode');
    if (toggle.checked) {
        document.body.style.backgroundColor = "#222"; // Dark mode example
        document.body.style.color = "#fff";

    } else {
        document.body.style.backgroundColor = "#fff"; // Light mode example
        document.body.style.color = "#000";
    }
});