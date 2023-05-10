let currentRoom = null;
let rooms = [];
let inventory = ["sword"];
let previous_verb = null;
let previous_component1 = null;
let previous_component2 = null;
let dictionary = ["go","north","east","south","west","attack"];


class Room {
    location;
    description;
    components = [];
    actions = [];
    constructor(location) {
        this.location = location;
    }
}

class Component {
    actions = [];
    responses = [];
    name;
    val1;
    val2;
    val3;
    constructor(name, val1, val2, val3) {
        this.name = name;
        if (val1 == null) val1 = 0;
        else this.val1 = val1;
        if (val2 == null) val2 = 0;
        else this.val2 = val2;
        if (val3 == null) val3 = 0;
        else this.val3 = val3;
    }
}

function equals(element, name) {
    return element.name === name;
}

function initializeRooms() {
    start = new Room("Beginner road");
    start.description = "There's a trail from east to west, but the trail to the west seems lead to nothing.";
    sword = new Component("sword");
    start.components.push(sword);
    goblin = new Component("goblin");
    start.components.push(goblin);
    start.actions.push("attack");
    rooms.push(start);
    currentRoom = start;
    // nothing = new Room("Nothing","There's nothing past this point. Must be a bug.");
    // beginnerfork = new Room("A fork in the road connects to a road that leads north, and ");
    // rooms.push(beginnerfork);
}


/** 
 * A sentence is structured as follows:
 * verb subject item.
 * A subject can be an item and vice versa. You can throw brick at goblin and throw goblin at brick.
 * Some combinations may not be possible though. You cannot throw wall at goblin (or maybe you can)
 * If the first word is not recognized as a verb, it checks the previous word.
 * If the previous word is not a verb, then the program then checks if the first word is the subject
 * If there is nothing else after the subject, it prompts the user for an action on the subject
 */
function parse(sentence) {
    sentence.toLowerCase();
    const words = sentence.split(" ");
    let verb;
    let component1;
    let component2;
    let i = 0;
    for (; i < words.length; i++) {
        if (dictionary.includes(words[i])) {
            verb = words[i];
            i++;
            break;
        }
    }

    for (; i < words.length; i++) {
        if (currentRoom.components.some(component => component.name === words[i]) || inventory.includes(words[i])) {
            console.log(i);
            component1 = words[i];
            i++;
            break;
        }
    }
  
    for (; i < words.length; i++) {
        if (currentRoom.components.some(component => component.name === words[i]) || inventory.includes(words[i])) {
            component2 = words[i];
            break;
        }
    }
    console.log(verb);
    console.log(component1);
    console.log(component2);
    if (verb != null && component1 != null && component2 != null) {
        handleAction(verb, component1, component2);
    } else if (verb != null && component1 != null) {
        handleAction(verb, component1);
    } else if (verb != null) {
        handleAction(verb);
    } else if (previous_verb != null) {
        if (component1 != null && component2 != null) {
            handleAction(previous_verb, component1, component2);
        } else if (component1 != null) {
            handleAction(previous_verb, component1);
        } else {
            outputText("I'm sorry, I don't understand.")
        }
    } else {
        outputText("I'm sorry, I don't understand.")
    }
}

/**
 * This variation of handleAction accepts only a verb.
 * Only actions that require no components will be handled, otherwise
 * an error is reported to the user.
 */
function handleAction(verb) {
    switch(verb) {
        case 'go':
            promptDirection();
        break;
        case 'east':
        break;
    }
}
/**
 * This variation of handleAction accepts a verb and one component
 * Only actions that require one component will be handled, otherwise
 * an error is reported to the user.
 */
function handleAction(verb, component1) {

}
/**
 * This variation of handleAction accepts a verb and two components.
 * Only actions that require two components will be handled, otherwise 
 * an error is reported to the user.
 */
function handleAction(verb, component1, component2) {

}


function attack(verb, component1, component2) {
    outputText(`You ${verb} ${component1} with ${component2}`);
}




//Implement WIP
function connectRooms(x, y, xdir, ydir) {
    x.connectedRooms.push(y);
    x.possibleDirections.push(xdir)
    y.connectedRooms.push(x);
    y.possibleDirections.push(ydir)
}

function outputText(txt) {
    const p = document.createElement("p");
    p.innerHTML = txt;
    terminalOutput.appendChild(p);
    window.scrollTo(0, document.body.scrollHeight);
    terminalCommand.value = "";
}

window.onload = (event) => {
    initializeRooms();
    outputText("There's a trail from east to west, but the trail to the west seems lead to nothing.");
};

const terminalOutput = document.getElementById("terminal-output");
const terminalCommand = document.getElementById("terminal-command");

terminalCommand.addEventListener("keydown", e => checkEnter(e));

function checkEnter(k) {
    if (k.keyCode==13) {
        const command = terminalCommand.value;
        outputText(command);
        terminalCommand.value = "";
        if (command.length > 164) {
            outputText("I'm sorry, but that command is too long.")
        } else {
        parse(command); 
        }
    }
}