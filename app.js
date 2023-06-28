let currentRoom = null;
let rooms = [];
let inventory = [];
let previous_verb = null;
let previous_component1 = null;
let previous_component2 = null;
let dictionary = ["attack","look","jump","grab"];
let movementDictionary = ["climb","go","walk","run","north","northeast","east","southeast","south","southwest","west","northwest","up","down"];
dictionary = dictionary.concat(movementDictionary);
let basicDictionary = dictionary;


/**
 * Rooms should always describe the area
 */
class Room {
    location;
    description = "";
    components = [];
    dictionary = basicDictionary;
    connectedRooms = [];
    directions = [];    //corresponds to the direction of connected rooms.
    entered = false;
    constructor(location) {
        this.location = location;
    }
}

class CustomRoom extends Room {
    constructor(location) {
        super(location);
    }
}

class Component {
    dictionary = [];
    responses = [];
    name;
    constructor(name) {
        this.name = name;
    }
}

class Entity extends Component {
    health;
    strength;
    defense;
}

class Item extends Component {
    damage;
}

function initializeRooms() {
    starterRoad1 = new Room("Brooke Road");
    starterRoad1.description = "The road to the east looks promising, but there's nothing to the west.";
    nothing = new Room("Nothing");
    nothing.description = "You see nothing beyond this point. You should probably head back.";
    connectRooms(starterRoad1, nothing, "west", "east");
    currentRoom = starterRoad1;
    beginnerFork = new Room("Fork in the Road");
    beginnerFork.description = "A fork in the road has two trails. One heads northeast, and the other goes from east to west.";
    connectRooms(beginnerFork, starterRoad1, "west", "east");
    goblinDoor = new Room("Mysterious Door");
    goblinDoor.description = "A big wooden door that seems to be locked.";
    connectRooms(beginnerFork, goblinDoor, "northeast", "southwest");
    starterRoad2 = new Room("Brooke Road");
    starterRoad2.description = "This road leads from east to west.";
    connectRooms(beginnerFork, starterRoad2, "east", "west");
    wildField1 = new Room("Wild Fields");
    wildField2 = new Room("Wild Fields");
    wildField3 = new Room("Wild Fields");
    wildField3.description = "A trail that leads towards the mountains is northeast from here."
    wildField4 = new Room("Wild Fields");
    wildField5 = new Room("Wild Fields");
    wildField5.description = "This vast meadow goes on for a while. It may be hard to know where you're going from here, so mapping it out might help."
    wildField6 = new Room("Wild Fields");
    wildField7 = new Room("Wild Fields");
    wildField7.description = "The field spreads far in every direction."
    wildField8 = new Room("Wild Fields");
    wildField9 = new Room("Wild Fields");
    wildField10 = new Room("Wild Fields");
    wildField11 = new Room("Wild Fields");
    wildField12 = new Room("Wild Fields");
    grandTree = new Room("Grand Tree");
    grandTree.description = "The grand tree soars to towering heights, its branches reaching outward, while its mighty trunk radiates a mesmerizing glow."
    largeBranch = new Room("Large Branch");
    largeBranch.description = "This branch is plenty sturdy. From here, you can see the entire field from here. Going up might make allow you to see further."
    appleBranch = new Room("Weak Branch");
    appleBranch.description = "As you reach this point on the tree, you spot a shimmering apple. Will you grab it?";
    wildField13 = new Room("Wild Fields");
    wildField14 = new Room("Wild Fields");
    wildField15 = new Room("Wild Fields");
    wildField16 = new Room("Wild Fields");
    wildField17 = new Room("Wild Fields");
    wildField18 = new Room("Wild Fields");
    wildField19 = new Room("Wild Fields");
    wildField20 = new Room("Wild Fields");
    connectRooms(starterRoad2, wildField5, "east", "west");
}

// function get(list, item) {
//     list.some(component => {if(component.name === temp) return component});
// }
// function equals(element, name) {
//     return element.name === name;
// }
//FUNCTIONS I MIGHT USE ^^^

/** 
 * A sentence is structured as follows:
 * verb subject item.
 * A subject can be an item and vice versa. You can throw brick at goblin and throw goblin at brick.
 * Some combinations may not be possible though. You cannot throw wall at goblin (or maybe you can)
 * If the first word is not recognized as a verb, it checks the previous word.
 * If the previous word is not a verb, then the program then checks if the first word is the subject
 * If there is nothing else after the subject, it prompts the user for an action on the subject
 */
function separateCommand(sentence) {
    sentence.toLowerCase();
    const words = sentence.split(" ");
    return words;
}

function parse(words) {
    if (previous_verb != null) {
        words.splice(0, 0,previous_verb);
    }
    checkSyntax(words)
}
function checkSyntax(words) {
    verb = words[0];
    if (checkVerb(verb)) {
        if (movementDictionary.includes(verb)) {
            handleMovement(words);
        }
        else {
            return true;
        }
    }
    return false;
}

/**
 * Checks for valid action in dictionary, and room. If either is invalid, return false. Otherwise, return true.
 */
function checkVerb(verb) { 
    if (dictionary.includes(verb)) {
        if (currentRoom.dictionary.includes(verb)) {
            return true;
        }
        outputText("You cannot do that here.");
        return false;
    }
    outputText("That's not a verb I recognize");
    return false;
}

function handleMovement(words) {
    switch (words[0]) {
        case 'go':
            if (words.length > 1) {
                words = words.slice(1);
                handleMovement(words);
            } else {
                outputText("Which direction do you want to go?");
                previous_verb = "go";
            }
        break;
        case 'walk':
            if (words.length > 1) {
                words = words.slice(1);
                handleMovement(words);
            } else {
                outputText("Which direction do you want to go?");
                previous_verb = "go";
            }
        break;
        case 'run':
            if (words.length > 1) {
                words = words.slice(1);
                handleMovement(words);
            } else {
                outputText("Which direction do you want to go?");
                previous_verb = "go";
            }
        break;
        case 'north':
            if (words.length > 1) {
                outputText("I only understod you as far as north");
            } else {
                handleDirection("north");
            }
        break;
        case 'northeast':
            if (words.length > 1) {
                outputText("I only understod you as far as northeast");
            } else {
                handleDirection("northeast");
            }
        break;
        case 'east':
            if (words.length > 1) {
                outputText("I only understod you as far as east");
            } else {
                handleDirection("east");
            }
        break;
        case 'southeast':
            if (words.length > 1) {
                outputText("I only understod you as far as southeast");
            } else {
                handleDirection("southeast");
            }
        break;
        case 'south':
            if (words.length > 1) {
                outputText("I only understod you as far as south");
            } else {
                handleDirection("south");
            }
        break;
        case 'southwest':
            if (words.length > 1) {
                outputText("I only understod you as far as southwest");
            } else {
                handleDirection("southwest");
            }
        break;
        case 'west':
            if (words.length > 1) {
                outputText("I only understod you as far as west");
            } else {
                handleDirection("west");
            }
        break;
        case 'northwest':
            if (words.length > 1) {
                outputText("I only understod you as far as northwest");
            } else {
                handleDirection("northwest");
            }
        break;
        case 'climb':
            handleClimb(words);
        break;
        case 'up':
            outputText("How do you think you're going to do that?");
        break;
        case 'down':
            outputText("How do you think you're going to do that?");
        break;
        default:
            outputText("That's not a valid direction.");    //SHOULD NOT HAPPEN.
    }
    return false;   //This makes it so handleVerb does not happen
}

function handleClimb(words) {
    if (words.length == 1) {
        handleDirection("up");
    } else {
        direction = words[1];
        if (direction == 'up' || direction == 'down') {
            if (words.length > 2) {
                message = `I only understood you as far as climb ${direction}`;
                outputText(message);
            }
            else {
                handleDirection(direction);
            }
        }
    }
    
}

/**
 *  Assumes sentence works and performs action without checking for validity.
 */
function handleVerb(words) {
}

function handleDirection(direction) {
    if(!currentRoom.directions.some(dir => {
        if(dir == direction) {
            index = currentRoom.directions.indexOf(direction);
            changeRoom(index); return true;
        }
    }))
        outputText("You can't go that direction");
}

function changeRoom(index) {
    currentRoom = currentRoom.connectedRooms[index];
    outputText(currentRoom.location);
    if (!currentRoom.entered) {
        outputText(currentRoom.description);
        currentRoom.entered = true;
    }
    topRightElement.textContent = currentRoom.location;
}

function look() {
    outputText(currentRoom.description);
}

function jump() {
    outputText("Wheeeeee!");
}

//In order to connect rooms that require climbing, up and down must be valid directions. However, they must only work when paired with climb
/**
 * Attacking something requires a few things:
 * 1. The thing you are attacking must have health
 * 2. The thing you are attacking with must be in your inventory
 * The calculation for damage is as follows: if (damage > defense) health = health - (defense - damage)
 */

function attack(component1, component2) {

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
    outputText(currentRoom.location);
    outputText(currentRoom.description);
    currentRoom.entered = true;
}



const terminalOutput = document.getElementById("terminal-output");
const terminalCommand = document.getElementById("terminal-command");
const topRightElement = document.getElementById("location");

topRightElement.textContent = "Brooke Road";

terminalCommand.addEventListener("keydown", e => checkEnter(e));

function checkEnter(k) {
    if (k.keyCode==13) {
        const command = terminalCommand.value;
        outputText(command);
        terminalCommand.value = "";
        if (command.length > 164) {
            outputText("I'm sorry, but that command is too long.")
        } else {
            parse(separateCommand(command)); 
        }
    }
}