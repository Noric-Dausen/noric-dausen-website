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
        if (command.length === 0) { return; }

        const args = command.split(' ');

        // clear input field after getting the command
        inputField.value = '';

        if (args.length === 0) { return; }

        if (textwindowContent.textContent !== '') { textwindowContent.textContent += `\n`; }

        textwindowContent.textContent += `> ${command}\n`;

        if (args.length === 1) {
            switch (args[0].toLowerCase()) {

                case 'help':
                    textwindowContent.textContent += 'Available commands: \nhelp - Show this help message\nclear - Clear the console output\ndarkmode - toggles dark mode\ntheme - changes the console\'s theme\ngame - enter the experimental game';
                    return;

                case 'clear':
                    textwindowContent.textContent = '';
                    return;

                case 'darkmode':
                    if (darkModeSwitch === null) {
                        textwindowContent.textContent += 'Dark mode switch not found.';
                        return;
                    }
                    darkModeSwitch.checked = !darkModeSwitch.checked;
                    darkModeSwitch.dispatchEvent(new Event('change'));
                    textwindowContent.textContent += `Dark mode toggled to ${darkModeSwitch.checked ? 'ON' : 'OFF'}`;
                    return;

                case 'theme':
                    textwindowContent.textContent += 'Usage: theme [light|dark|matrix|abyss]';
                    return;

                case 'game':
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

        } else {

            if (args[0].toLowerCase() === 'theme') {
                if (args.length < 2) {
                    textwindowContent.textContent += '\nUsage: theme [light|dark|matrix|abyss]';
                }

                const theme = command.split(' ')[1].toLowerCase();

                switch (theme) {
                    case 'light':
                        consoleElement.setAttribute('class', 'console');
                        break;
                    case 'dark':
                        consoleElement.setAttribute('class', 'console console-dark');
                        break;
                    case 'matrix':
                        consoleElement.setAttribute('class', 'console console-matrix');
                        break;
                    case 'abyss':
                        consoleElement.setAttribute('class', 'console console-abyss');
                        break;
                    default:
                        textWindowContent.textContent += 'Invalid theme. Available themes: light, dark, matrix, abyss.';
                }

                textwindowContent.textContent += `Theme set to ${theme}`;
                return;
            }

        }

        textwindowContent.textContent += `Unknown command: ${command}. Type 'help' for a list of commands.`;

    }

    
});