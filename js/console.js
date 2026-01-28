let consoleVisible = false;
let consoleElement = null;
let textWindow = null;
let textwindowContent = null;
let inputField = null;

const darkModeSwitch = document.getElementById('toggleInput');

const previousCommands = [];
let currentCommandIndex = -1;

// helper function to ensure currentCommandIndex stays within bounds
function normalizeCommandIndex() {
    if (currentCommandIndex < 0) { currentCommandIndex = 0; }
    if (currentCommandIndex > previousCommands.length - 1) { currentCommandIndex = previousCommands.length - 1; }
}

// direction should be 1 for previous command and -1 for next command
function viewPreviousCommand(direction) {
    if (previousCommands.length === 0) { return; }
    currentCommandIndex += direction;
    normalizeCommandIndex();
    inputField.value = previousCommands[previousCommands.length - 1 - currentCommandIndex];
}

// send a message to the console
function logToConsole(message) {
    window.dispatchEvent(new CustomEvent('consoleLog', {
        detail: { data: message }
    }));
}

const helpMessage = `Available commands:
 > help - show this help message
 > clear - clear the console output
 > darkmode - toggles dark mode
 > theme - changes the console\'s theme
 > game - enter the experimental game
 > hi - greet the console
 > reset - reset various elements
 > emulate - dispatch an event
 > execute - run a custom event
 > commandguide - explains usage syntax
`;

const guideMessage = `COMMAND GUIDE:
PREFIX SYMBOLS:
    \'#\' - Hash symbol is used for opening specific command guides (Example: #emulate)
    \'!\' - Exclaimation Mark is used to specify that your command is operating with the DOCUMENT in mind
    \'?\' - Question Mark tells the command that your operating the command with a customly set object in mind
    \' \' - No prefix is used to specify that your command is operating with the WINDOW in mind

USAGE SYMBOLS:
    \'[]\' - Container for available options
    \'|\' - Seperates options in container
    \'<>\' - suggests that there are many options or that the options are unlimited
    \'<>+>\' - suggests that there are an unlimited amount of additional arguments
    `;

const emulateMessage = `Usage:
emulate: emulate <Event>
#emulate: #emulate
!emulate: !emulate <Event>
?emulate: ?emulate <Event> <target>`;

const executeMessage = `Usage:
execute: execute <Event> <Data>+>
#execute: #execute
!execute: !execute <Event> <data>+>
?emulate: ?emulate <Event> <target> <data>+>`;


window.addEventListener('keydown', (event) => {

    //Opening and closing the console with Shift + `
    if (event.code === 'Backquote' && event.shiftKey) {

        event.preventDefault();

        if (consoleElement === null) {
            // Create the console element if it doesn't exist
            consoleElement = document.createElement('div');
            consoleElement.setAttribute('class', 'console');
            consoleElement.textContent = 'Developer Console';
            textWindow = document.createElement('div');
            textWindow.setAttribute('class', 'console-text-window');
            textwindowContent = document.createElement('pre');
            textwindowContent.textContent = 'This is a placeholder for the developer console output.\n';
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

        // Focus the input field
        if (consoleVisible) {
            inputField.focus();
        }
    }

    
    // return if the console is not visible
    if (!consoleVisible) { return; }

    // return if the input field does not exist
    if (inputField === null) {
        logToConsole(`> ERROR: Input Field Not Found\n`);
        return;
    } 

    // return if the input field is not focused
    if (document.activeElement !== inputField) { return; }

    if (event.code === 'ArrowUp') {
        // retrieve and set the last entered command (further in the past)
        event.preventDefault();
        viewPreviousCommand(1);
    }

    if (event.code === 'ArrowDown') {
        // retrieve and set the last entered command (closer to the present)
        event.preventDefault();
        viewPreviousCommand(-1);
    }

    // Enter key to submit commands
    if (event.code === 'Enter') {

        // reset command index for retrieving previous commands
        currentCommandIndex = -1;

        if (inputField.value === '') { return; }

        const command = inputField.value.trim();
        if (command.length === 0) { return; }

        const args = command.split(' ');

        // clear input field after getting the command
        inputField.value = '';

        previousCommands.push(command);

        if (args.length === 0) { return; }

        if (textwindowContent.textContent !== '') { logToConsole(`\n`); }

        logToConsole(`> ${command}\n`);

        if (args.length === 1) {
            switch (args[0].toLowerCase()) {

                case 'help':
                    logToConsole(helpMessage);
                    return;

                case 'clear':
                    textwindowContent.textContent = '';
                    return;

                case 'darkmode':
                    if (darkModeSwitch === null) {
                        logToConsole('Dark mode switch not found.');
                        return;
                    }
                    darkModeSwitch.checked = !darkModeSwitch.checked;
                    darkModeSwitch.dispatchEvent(new Event('change'));
                    logToConsole(`Dark mode toggled to ${darkModeSwitch.checked ? 'ON' : 'OFF'}`);
                    return;

                case 'theme':
                    logToConsole('Usage: theme [light|dark|matrix|abyss]');
                    return;

                case 'game':
                    logToConsole('Redirecting to game page.');
                    setTimeout(function () {
                        logToConsole('.');
                    }, 1000);
                    setTimeout(function () {
                        logToConsole('.');
                    }, 2000);
                    setTimeout(function () {
                        window.location.href = 'testing.html';
                    }, 3000);
                    return;

                case 'hi':
                    logToConsole('hey cutie :)');
                    return;

                case 'reset':
                    logToConsole('Usage: reset [DOMContent|page]');
                    return;

                case 'emulate':
                    logToConsole('Usage: emulate <Event>');
                    return;

                case '#emulate':
                    logToConsole(emulateMessage);
                    return;

                case 'execute':
                    logToConsole('Usage: execute <Event> <data>+>');
                    return;

                case '#execute':
                    logToConsole(executeMessage);
                    return;

                case 'commandguide':
                    logToConsole(guideMessage);
                    return;
            }

        } else {

            //determine type of operation 
            let type = '';
            let typedCommand = '';

            switch (args[0][0]) {
                case '#':
                    type = '#';
                    typedCommand = args[0].toLowerCase().slice(1);
                    break;
                case '!':
                    type = '!';
                    typedCommand = args[0].toLowerCase().slice(1);
                    break;
                case '?':
                    type = '?';
                    typedCommand = args[0].toLowerCase().slice(1);
                    break;
                default:
                    typedCommand = args[0].toLowerCase();
                    break;
            }

            //Default Commands (no type applied)
            if (args[0].toLowerCase() === 'theme') {
                if (args.length < 2) {
                    logToConsole('\nUsage: theme [light|dark|matrix|abyss]');
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
                        logToConsole('Invalid theme. Available themes: light, dark, matrix, abyss.');
                }

                logToConsole(`Theme set to ${theme}`);
                return;
            }

            if (args[0].toLowerCase() === 'reset') {
                if (args.length < 2) {
                    logToConsole('\nUsage: reset [DOMContent|page]');
                }

                const target = command.split(' ')[1].toLowerCase();

                switch (target) {
                    case 'domcontent':
                        document.dispatchEvent(new Event('DOMContentLoaded'));
                        break;
                    case 'page':
                        window.location.reload();
                        break;
                    default: 
                        logToConsole('Invalid reset target. Available targets: page, DOMContent.');
                }

                logToConsole(`Reseting ${target}`);
                return;
            }

            if (typedCommand === 'emulate') {
                if (args.length < 3 && type === '?') {
                    logToConsole('\nUsage: emulate <Event>');
                    return;
                }

                if (args.length > 2 && type !== '?') {
                    logToConsole('\nUsage: emulate <Event>');
                    return;
                }


                switch (type) {
                    case '?':

                        let target = document.getElementById(args[2]);

                        target.dispatchEvent(new Event(args[1]));
                        logToConsole(`Emulating ${args[1]} event for ${args[2]}`);
                        break;
                    case '!':
                        document.dispatchEvent(new Event(args[1]));
                        logToConsole(`Emulating ${args[1]} event for DOCUMENT`);
                        break;
                    default:
                        window.dispatchEvent(new Event(args[1]));
                        logToConsole(`Emulating ${args[1]} event for WINDOW`);

                }

                return;
            }

            if (typedCommand === 'execute') {

                if (type === '?' && args.length < 3) {
                    logToConsole('\nUsage: execute <Event> <data>+>');
                    return;
                }

                //Num allows ? to reuse the same code as ! and ' '
                let num = 2;

                if (type === '?') {
                    num = 3;
                }

                const variableList = [];

                const amountOfVariables = args.length - num;

                for (let i = 0; i < amountOfVariables; i++) {
                    let newVariable = args[i + num];

                    variableList.push(newVariable);
                }

                const operation = new CustomEvent(args[1], {
                    detail: { data: variableList }
                })

                switch (type) {
                    case '?':

                        let target = document.getElementById(args[2]);

                        target.dispatchEvent(operation);
                        logToConsole(`Executing ${args[1]} event for ${args[2]}`);
                        break;
                    case '!':
                        document.dispatchEvent(operation);
                        logToConsole(`Executing ${args[1]} event for DOCUMENT`);
                        break;
                    default:
                        window.dispatchEvent(operation);
                        logToConsole(`Executing ${args[1]} event for WINDOW`);

                }

                return;

            }

        }

        logToConsole(`Unknown command: ${command}. Type 'help' for a list of commands.`);

    }

    
});

window.addEventListener('consoleLog', (event) => {
    if (consoleElement === null) { return; }

    let message = event.detail.data;

    if (!message.endsWith('\n')) {
        message += '\n';
    }

    textwindowContent.textContent += message;
    textWindow.scrollTop = textWindow.scrollHeight;
});
