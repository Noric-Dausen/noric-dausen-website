const currentTheme = localStorage.getItem('theme') || 'light'; // Default to light theme if not set

document.addEventListener('DOMContentLoaded', () => {
    // Apply the saved theme on page load

    if (currentTheme === 'dark') {
        document.body.classList.add('dark-mode');
        document.getElementById('toggleInput').setAttribute('checked', 'checked'); // Set the toggle to the correct position
    } else {
        document.body.classList.remove('dark-mode');
        document.getElementById('toggleInput').removeAttribute('checked'); // Ensure the toggle is in the correct position
    }
});