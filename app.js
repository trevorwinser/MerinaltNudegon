let currentRoom = null;
let rooms = [];
let inventory = ["sword"];
let previous_verb = null;
let previous_component1 = null;
let previous_component2 = null;
let dictionary = ["go","walk","run","north","northeast","east","southeast","south","southwest","west","northwest","attack","look"];

class Room {
    location;
    description = "";
    components = [];
    actions = [];
    connectedRooms = [];
    directions = [];    //corresponds to the direction of connected rooms.
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
    start = new Room("Brooke Road");
    start.description = "The road to the east looks promising, but there's nothing to the west ";
    sword = new Component("sword");
    start.components.push(sword);
    goblin = new Component("goblin");
    start.components.push(goblin);
    nothing = new Room("Nothing");
    nothing.description = "You see nothing beyond this point. You should probably head back.";
    connectRooms(start, nothing, "west", "east");
    rooms.push(start);
    currentRoom = start;
    beginnerFork = new Room("Fork in the Road");
    beginnerFork.description = "A fork in the road has two trails. One heads northeast, and the other goes from east to west";
    rooms.push(beginnerFork);
    connectRooms(beginnerFork, start, "west", "east");
    goblinDoor = new Room("Mysterious Door");
    goblinDoor.description = "A big wooden door that seems to be locked.";
    connectRooms(beginnerFork, goblinDoor, "northeast", "southwest");
    continuedRoad = new Room("Brooke Road");
    continuedRoad.description = "";
    connectRooms(beginnerFork, continuedRoad, "east", "west");
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
        let temp = words[i];
        if (currentRoom.components.some(component => component.name === temp) || inventory.includes(temp) || dictionary.includes(temp)) {
            component1 = temp;
            i++;
            break;
        }
    }
  
    for (; i < words.length; i++) {
        let temp = words[i]
        if (currentRoom.components.some(component => component.name === temp) || inventory.includes(temp)) {
            component2 = temp;
            break;
        }
    }
    console.log(verb);
    console.log(component1);
    console.log(component2);
    if (verb != null && component1 != null && component2 != null) {
        handleVerbSubject1Subject2(verb, component1, component2);
    } else if (verb != null && component1 != null) {
        handleVerbSubject(verb, component1);
    } else if (verb != null) {
        handleVerb(verb);
    } else if (previous_verb != null) {
        if (component1 != null && component2 != null) {
            handleAction1(previous_verb, component1, component2);
        } else if (component1 != null) {
            handleAction2(previous_verb, component1);
        } else {                                            //There is never a case where handleAction3(previous_verb) should happen.
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
function handleVerb(verb) {
    switch(verb) {
        case "go":
            promptDirection();
        break;
        case "walk":
            promptDirection();
        break;
        case "run":
            promptDirection();
        break;
        case "north":
            handleDirection("north");
        break;
        case "northeast":
            handleDirection("northeast");
        break;
        case "east":
            handleDirection("east");
        break;
        case "southeast":
            handleDirection("southeast");
        break;
        case "south":
            handleDirection("south");
        break;
        case "southwest":
            handleDirection("southwest");
        break;
        case "west":
            handleDirection("west");
        break;
        case "northwest":
            handleDirection("northwest");
        break;
        case "look":
            look();
        break
        default:
            promptSubject(verb);
        break;
    }
}
/**
 * This variation of handleAction accepts a verb and one component
 * Only actions that require one component will be handled, otherwise
 * an error is reported to the user.
 */
function handleVerbSubject(verb, component1) {
    switch(verb) {
        case "go":
            handleDirection(component1);
        break;
        case "walk":
            
        break;
        case "run":

        break;
    }
}
/**
 * This variation of handleAction accepts a verb and two components.
 * Only actions that require two components will be handled, otherwise 
 * an error is reported to the user.
 */
function handleVerbSubject1Subject2(verb, component1, component2) {
    switch(verb) {

    }
}

function handleDirection(direction) {
    if(!currentRoom.directions.some(dir => {if(dir == direction) {index = currentRoom.directions.indexOf(direction);go(index); return true;}}))
        outputText("You can't go that direction");
}

function go(index) {
    currentRoom = currentRoom.connectedRooms[index];
    outputText(currentRoom.location);
    outputText(currentRoom.description);
    topRightElement.textContent = currentRoom.location;
}

function look() {
    outputText(currentRoom.description);
}

function attack(verb, component1, component2) {
    outputText(`You ${verb} ${component1} with ${component2}`);
}

function promptDirection() {
    outputText("Which direction do you want to go?");
}
function promptSubject(verb) {
}

function connectRooms(x, y, xdir, ydir) {
    x.connectedRooms.push(y);
    x.directions.push(xdir)
    y.connectedRooms.push(x);
    y.directions.push(ydir)
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
    outputText(currentRoom.description);
};



const terminalOutput = document.getElementById("terminal-output");
const terminalCommand = document.getElementById("terminal-command");
const topRightElement = document.getElementById("location");

topRightElement.textContent = "North Road";

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