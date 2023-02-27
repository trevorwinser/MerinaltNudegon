let currentRoom = null;
let rooms = [];
let inventory = [];
function initializeRooms() {
    start = new Room(0,"Beginner road","There's a trail from east to west, but the trail to the west seems lead to nothing.");
    rooms.push(start);
    currentRoom = start;
    nothing = new Room();
    nothing.description = "There's nothing past this point."
}
function actionHandler(sentence) {
    sentence.toLowerCase();
    const words = sentence.split(" ");
    action = words[0];
    words.splice(0, 1);
    subject = words.join(" ");
    console.log(subject);
    switch(action) {
        case 'search':
            search(subject);
            break;
        case 'attack':
            attack(subject);
            break;
        case 'take':
            grab(subject);
            break;
        case 'grab':
            grab(subject);
            break;
        case 'pick up':
            grab(subject);
            break;
        case 'enter':
            enter(subject);
            break;
        case 'look':
            look(subject);
            break;
        case 'go':
            go(subject);
            break;
        case 'north':
            checkNorth();
            break;
        case 'northeast':
            checkNorthEast();
            break;
        case 'east':
            checkEast();
            break;
        case 'southeast':
            checkSouthEast();
            break;
        case 'south':
            checkSouth();
            break;
        case 'southwest':
            checkSouthWest();
            break;
        case 'west':
            checkWest();
            break;
        case 'northwest':
            checkNorthWest();
            break;
        case 'up':
            checkUp();
            break;
        case 'down':
            checkDown();
            break;
        default:
            outputText("That's not a verb I recognise.");
    }
}

function attack(subject) {
    if (currentRoom.interactables.includes(subject)) {
        inventory.push(subject);
        currentRoom.interactables.pop(subject)
    } else {
        outputText("Swinging at the air will do you no good.");
    }
}
function grab(subject) {
    if (currentRoom.interactables.includes(subject)) {
        inventory.push(subject);
        currentRoom.interactables.pop(subject)
    } else {
        code = Math.floor(Math.random()*3);
        switch(code) {
            case 0:
                outputText("You try as hard as you can, but the object you are trying to grab does not exist.");
                break;
            case 1:
                outputText("Don't be rediculous, you can't see any such thing.")
                break;
            case 2:
                outputText("A valiant effort, but a fruitless one nonetheless.")
                break;
        }
    }
}
function enter() {}
function go(direction) {
    switch(direction) {
        case 'north':
            checkNorth();
            break;
        case 'northeast':
            checkNorthEast();
            break;
        case 'east':
            checkEast();
            break;
        case 'southeast':
            checkSouthEast();
            break;
        case 'south':
            checkSouth();
            break;
        case 'southwest':
            checkSouthWest();
            break;
        case 'west':
            checkWest();
            break;
        case 'northwest':
            checkNorthWest();
            break;
        case 'up':
            checkUp();
            break;
        case 'down':
            checkDown();
            break;
        case '':
            outputText("Which way do you want to go?")
            break;
        default:
            outputText("I don't know the word \"" + direction + "\"");
    }
}
function look(subject) {
    const words = subject.split(" ");
    if (words[0] === "at") words.splice(0, 1);
    subject = words.join(" ");

}

class Room {
    index;
    interactables = [];
    connectedRooms = [];
    discovered = false;
    description;
    constructor(index) {
        this.index = index;
    }
}



// class Interactable {
// }
// class Item extends Interactable {
//     value;
//     constructor(value) {
//         this.value = value;
//     }
// }
// class Enemy extends Interactable {
//     health;
//     attack;
//     defense;
// }
// class Armor extends Item {
// }
// class Weapon extends Item {
// }

//May potentially bring back
// function typeWriter(txt, i, p) {
//     if (i < txt.length) {
//         p.innerHTML += txt.charAt(i);
//         i++;
//         setTimeout(this.typeWriter, 50, txt, i, p);
//     } else {
//         currentParagraphFinished = true;
//         console.log(currentParagraphFinished);
//     }
// }
// let currentParagraphFinished = true;

function outputText(txt) {
    if (txt.length > 215) {}
    const p = document.createElement("p");
    p.innerHTML = txt;
    terminalOutput.appendChild(p);
    window.scrollTo(0, document.body.scrollHeight);
}

window.onload = (event) => {
    initializeRooms();
    outputText("Sample text");
};

const terminalOutput = document.getElementById("terminal-output");
const terminalCommand = document.getElementById("terminal-command");

terminalCommand.addEventListener("keydown", e => checkEnter(e.keyCode));



function checkEnter(k) {
    if (k==13) {
        const command = terminalCommand.value;
        // Add the command to the output
        const p = document.createElement("p");
        p.innerHTML = command;
        terminalCommand.value = "";
        terminalOutput.appendChild(p);
        actionHandler(command); 
    }
}