let consoleVisible = false;
let consoleElement = null;
let textWindow = null;
let textwindowContent = null;
let inputField = null;

const darkModeSwitch = document.getElementById('toggleInput');

window.addEventListener('keydown', (event) => {

    //Opening and closing the console with Shift + `
    if (event.code === 'Backquote' && event.shiftKey) {

        if (consoleElement === null) {
            // Create the console element if it doesn't exist
            consoleElement = document.createElement('div');
            consoleElement.setAttribute('class', 'console');
            consoleElement.textContent = 'Developer Console';
            textWindow = document.createElement('div');
            textWindow.setAttribute('class', 'console-text-window');
            textwindowContent = document.createElement('pre');
            textwindowContent.textContent = 'This is a placeholder for the developer console output.';
            inputField = document.createElement('input');
            inputField.setAttribute('class', 'console-input-field');

            //Add the elements of the console to it
            consoleElement.appendChild(textWindow);
            consoleElement.appendChild(inputField);
            textWindow.appendChild(textwindowContent);
        }

        if (!consoleVisible) {
            document.body.appendChild(consoleElement);
        } else {
            document.body.removeChild(consoleElement);
        }

        consoleVisible = !consoleVisible;

    }

    // Enter key to submit commands
    if (event.code === 'Enter' && consoleVisible) {

        if (inputField === null) { return; } 
        if (inputField.value === '') { return; }

        const command = inputField.value.trim();

        inputField.value = '';

        if (textwindowContent.textContent !== '') { textwindowContent.textContent += `\n`; }

        textwindowContent.textContent += `> ${command}\n`;

        if (command.length === 0) { return; }

        if (command.toLowerCase() === 'help') {
            textwindowContent.textContent += 'Available commands: \nhelp - Show this help message\nclear - Clear the console output\ndarkmode - toggles dark mode\ntheme - changes the console\'s theme\ngame - enter the experimental game\nreset - reset various elements\nemulate - dispatch an event\nexecute - run a custom event';
            return;
        }

        if (command.toLowerCase() === 'clear') {
            textwindowContent.textContent = '';
            return;
        }

        if (command.toLowerCase() === 'darkmode') {
            if (darkModeSwitch === null) {
                textwindowContent.textContent += 'Dark mode switch not found.';
                return;
            }
            darkModeSwitch.checked = !darkModeSwitch.checked;
            darkModeSwitch.dispatchEvent(new Event('change'));
            textwindowContent.textContent += `Dark mode toggled to ${darkModeSwitch.checked ? 'ON' : 'OFF'}`;
            return;
        }

        if (command.split(' ')[0].toLowerCase() === 'theme') {
            if (command.split(' ').length < 2) {
                textwindowContent.textContent += 'Usage: theme [light|dark|matrix|abyss]';
            }

            const theme = command.split(' ')[1].toLowerCase();

            if (theme === 'light') {
                consoleElement.setAttribute('class', 'console');
            }

            if (theme === 'dark') {
                consoleElement.setAttribute('class', 'console console-dark');
            }

            if (theme === 'matrix') {
                consoleElement.setAttribute('class', 'console console-matrix');
            }

            if (theme === 'abyss') {
                consoleElement.setAttribute('class', 'console console-abyss');
            }            

            textwindowContent.textContent += `Theme set to ${theme}`;
            return;
        }

        if (command.toLowerCase() === 'game') {
            textwindowContent.textContent += 'Redirecting to game page.';
            setTimeout(function () {
                textwindowContent.textContent += '.';
            }, 1000);
            setTimeout(function () {
                textwindowContent.textContent += '.';
            }, 2000);
            setTimeout(function () {
                window.location.href = 'testing.html';
            }, 3000);
            return;
        }

        if (command.split(' ')[0].toLowerCase() === 'reset') {
            if (command.split(' ').length < 2) {
                textwindowContent.textContent += 'Usage: reset [DOMContent/cards|page]';
            }

            const target = command.split(' ')[1].toLowerCase();

            if (target === 'cards' || target === 'domcontent') {
                document.dispatchEvent(new Event('DOMContentLoaded'));
            }

            if (target === 'page') {
                window.location.reload();
            }

            textwindowContent.textContent += `Attempting to reset: ${target}`;
            return;
        }

        if (command.toLowerCase() === 'emulate') {

            const eventData = { message: "Transmission successful!" };

            document.dispatchEvent(new Event(''));

            textwindowContent.textContent += `Theme set to ${theme}`;
            return;
        }

        if (command.toLowerCase() === 'execute') {


            return;
        }

        textwindowContent.textContent += `Unknown command: ${command}. Type 'help' for a list of commands.`;

    }

    
});