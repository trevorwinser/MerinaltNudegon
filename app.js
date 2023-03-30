let currentRoom = null;
let rooms = [];
let inventory = [];
let prevword = null;
let dictionary = ["go","north","east","south","west"];

/** 
 * 
*/
class Room {
    location;
    description;
    entities = [];
    actions = [];
    constructor(location) {
        this.location = location;
        this.actions.pop("go");
    }
}
class Entity {

}

function initializeRooms() {
    start = new Room("Beginner road");
    start.description = "There's a trail from east to west, but the trail to the west seems lead to nothing.";
    rooms.push(start);
    currentRoom = start;
    // nothing = new Room("Nothing","There's nothing past this point. Must be a bug.");
    // beginnerfork = new Room("A fork in the road connects to a road that leads north, and ");
    // rooms.push(beginnerfork);
    // connectRooms(start, nothing, "W", "E");
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
    const word = words[0];
    words.splice(0, 1);
    subject = words.join(" ");

    //Might come back to.
    // if (words.length == 0) {                                            //There is only one word
    //     console.log("1 word")
    //     if (dictionary.includes(word)) {                                //The word is an action
    //         console.log("word is action");
    //         if (prevword != null) {
    //             if (currentRoom.entities.includes(prevword)) {          //The previous word is an entity in the room
    //                 parse(word.concat(" ", prevword));
    //             } else if (currentRoom.actions.includes(word)) {        //The previous word is not an entity, so check if it is an acceptable action
    //                 if (!handleAction(word, null)) {                    //Checks if action needs a subject
    //                 prevword = word;
    //                 promptSubject(word);
    //                 }
    //             } else {
    //                 outputText("You cannot do that here.")
    //             }
    //         } else if (!handleAction(word, null)) {                    //Checks if action needs a subject
    //             prevword = word;
    //             promptSubject(word);
    //         }
    //     } else if (currentRoom.objects.includes(word)) {                //The word is an object
    //         if (prevword != null) {
    //             if (currentRoom.actions.includes(prevword)) {           //The previous word is an action
    //                 if (!handleAction(prevword, word)) {                //The action is not acceptable on the subject
    //                     prevword = word;
    //                     promptAction(word);
    //                 }
    //             }
    //         } else {                                                    //Prompt an action
    //             outputText(`What do you want to do with ${word}`);
    //         }
    //     } else if (currentRoom.objects.includes(subject) && currentRoom.actions.includes(word)) {
    //         prevword = null;
    //         handleAction(word, subject);
    //     } else {
    //         outputText("I'm sorry. I don't understand.");
    //     }
    // }
}


/**
 * The handleAction function takes in an action and subject. 
 * If the subject is null, the function deviates to actions that are possible without a subject. 
 * Otherwise, the function operates assuming there is a valid subject to act on. 
 * Current implementation does not know whether actions are possible on specific objects.
 */
function handleAction(action, subject) {
    return false;
    switch (action) {
        case 'go':
            outputText("Where do you want to go?");
            break;
        case currentRoom.possileDirections.includes(action):

            break;
    }
}

//IMPORTANT: To use ${variable} you must use `` not '' or ""
function promptAction(subject) {
    str = `What do you want to do with ${subject}?`;
    outputText(str);
}
function promptSubject(action) {
    switch (action) {
        case 'go':
            outputText("You need to specify a compass direction.")
    }
}
//Implement later
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
    outputText("Sample text");
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