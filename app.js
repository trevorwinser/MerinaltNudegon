let currentRoom = null;
let rooms = [];
let inventory = [];
let previous_verb = null;
let previous_component1 = null;
let previous_component2 = null;
let dictionary = ["attack","look","jump","grab","pick","drop", "inventory"];
let movementDictionary = ["climb","go","walk","run","travel","head","move","north","northeast","east","southeast","south","southwest","west","northwest","up","down"];
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
    altDescription = "";

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
    attackTime;
    turnsInteracted;
    dialogue;
    constructor(name,health, strength, attackTime) {
        super(name);
        this.health = health;
        this.strength = strength;
        this.attackTime = attackTime;
    }
    
}
class Item extends Component {
    damage = 0;
    actionList = [];
    responseList = [];
    constructor(name, damage) {
        super(name);
        this.damage = damage;
    }
    addAction(action, response) {
        this.actionList.push(action);
        this.responseList.push(response);
    }
}

function initializeRooms() {
    starterRoad1 = new Room("Brooke Road");
    starterRoad1.description = "The road to the east looks promising, but there's nothing to the west.";
    currentRoom = starterRoad1;

    sword = new Item("Sword", 3);
    currentRoom.components.push(sword);

    nothing = new Room("Nothing");
    nothing.description = "You see nothing beyond this point. You should probably head back.";
    connectRooms(starterRoad1, nothing, "west", "east");

    beginnerFork = new Room("Fork in the Road");
    beginnerFork.description = "A fork in the road has two trails. One heads northeast, and the other goes from east to west.";
    connectRooms(beginnerFork, starterRoad1, "west", "east");

    //Not a custom room, because once the user types "open door" with a key, the room is obsolete.
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
    wildField5.description = "This vast meadow goes on for a while. It may be hard to know where you're going from here, so mapping it out might help.";
    wildField6 = new Room("Wild Fields");
    wildField7 = new Room("Wild Fields");
    wildField7.description = "The field spreads far in every direction."
    wildField8 = new Room("Wild Fields");
    wildField9 = new Room("Wild Fields");
    wildField10 = new Room("Wild Fields");
    wildField11 = new Room("Wild Fields");
    wildField12 = new Room("Wild Fields");

    grandTree = new Room("Grand Tree");
    grandTree.description = "The grand tree soars to towering heights, its branches reaching outward, while its mighty trunk radiates a mesmerizing glow.";
    largeBranch = new Room("Large Branch");
    largeBranch.description = "This branch is plenty sturdy. From here, you can see the entire field from here. Going up might make allow you to see further.";
    connectRooms(grandTree, largeBranch, "up", "down");
    appleBranch = new Room("Weak Branch");
    appleBranch.description = "As you reach this point on the tree, you spot a shimmering apple. Will you grab it?";
    connectRooms(largeBranch, appleBranch, "up", "down");

    wildField13 = new Room("Wild Fields");
    wildField14 = new Room("Wild Fields");
    wildField15 = new Room("Wild Fields");
    wildField16 = new Room("Wild Fields");
    wildField17 = new Room("Wild Fields");

    wildField18 = new CustomRoom("Wild Fields");
    wildField18.description = "A metal knight stands tall and still here. It would be best not to fight him."
    wildField18.altDescription = "The remains of a strong warrior lie here.";
    wildField19 = new Room("Wild Fields");
    wildField20 = new Room("Wild Fields");

    beach1 = new Room("Beach");
    beach1.description = "This coast consists of various shells and colorful rocks.";
    beach2 = new Room("Beach");
    beach3 = new Room("Beach");
    beach4 = new Room("Beach");
    beach5 = new Room("Beach");
    beach6 = new Room("Beach");

    connectRooms(starterRoad2, wildField5, "east", "west");
    connectRooms(wildField1, wildField2, "east", "west");
    connectRooms(wildField2, wildField3, "east", "west");
    connectRooms(wildField3, wildField4, "east", "west");
    connectRooms(wildField5, wildField6, "east", "west");
    connectRooms(wildField6, wildField7, "east", "west");
    connectRooms(wildField7, wildField8, "east", "west");
    connectRooms(wildField8, wildField9, "east", "west");
    connectRooms(wildField9, wildField10, "east", "west");
    connectRooms(wildField10, beach1, "east", "west");
    connectRooms(wildField11, wildField12, "east", "west");
    connectRooms(wildField12, grandTree, "east", "west");
    connectRooms(grandTree, wildField13, "east", "west");
    connectRooms(wildField13, wildField14, "east", "west");
    connectRooms(wildField14, beach2, "east", "west");
    connectRooms(wildField15, wildField16, "east", "west");
    connectRooms(wildField16, wildField17, "east", "west");
    connectRooms(wildField17, wildField18, "east", "west");
    connectRooms(wildField18, beach3, "east", "west");
    connectRooms(wildField19, wildField20, "east", "west");
    connectRooms(wildField20, beach4, "east", "west");
    connectRooms(beach5, beach6, "east", "west");

    connectRooms(wildField1, wildField6, "south", "north");
    connectRooms(wildField2, wildField7, "south", "north");
    connectRooms(wildField3, wildField8, "south", "north");
    connectRooms(wildField4, wildField9, "south", "north");
    connectRooms(wildField6, wildField11, "south", "north");
    connectRooms(wildField7, wildField12, "south", "north");
    connectRooms(wildField8, grandTree, "south", "north");
    connectRooms(wildField9, wildField13, "south", "north");
    connectRooms(wildField10, wildField14, "south", "north");
    connectRooms(beach1, beach2, "south", "north");
    connectRooms(wildField11, wildField15, "south", "north");
    connectRooms(wildField12, wildField16, "south", "north");
    connectRooms(grandTree, wildField17, "south", "north");
    connectRooms(wildField13, wildField18, "south", "north");
    connectRooms(wildField14, beach3, "south", "north");
    connectRooms(wildField16, wildField19, "south", "north");
    connectRooms(wildField17, wildField20, "south", "north");
    connectRooms(wildField18, beach4, "south", "north");
    connectRooms(wildField19, beach5, "south", "north");
    connectRooms(wildField20, beach6, "south", "north");

    
    connectRooms(wildField5, wildField1, "northeast", "southwest");
    connectRooms(wildField6, wildField2, "northeast", "southwest");
    connectRooms(wildField7, wildField3, "northeast", "southwest");
    connectRooms(wildField8, wildField4, "northeast", "southwest");
    connectRooms(wildField11, wildField7, "northeast", "southwest");
    connectRooms(wildField12, wildField8, "northeast", "southwest");
    connectRooms(grandTree, wildField9, "northeast", "southwest");
    connectRooms(wildField13, wildField10, "northeast", "southwest");
    connectRooms(wildField14, beach1, "northeast", "southwest");
    connectRooms(beach3, beach2, "northeast", "southwest");
    connectRooms(beach4, beach3, "northeast", "southwest");
    connectRooms(beach5, wildField20, "northeast", "southwest");
    connectRooms(beach6, beach4, "northeast", "southwest");

    connectRooms(wildField1, wildField7, "southeast", "northwest");
    connectRooms(wildField2, wildField8, "southeast", "northwest");
    connectRooms(wildField3, wildField9, "southeast", "northwest");
    connectRooms(wildField4, wildField10, "southeast", "northwest");
    connectRooms(wildField5, wildField11, "southeast", "northwest");
    connectRooms(wildField6, wildField12, "southeast", "northwest");
    connectRooms(wildField7, grandTree, "southeast", "northwest");
    connectRooms(wildField8, wildField13, "southeast", "northwest");
    connectRooms(wildField9, wildField14, "southeast", "northwest");
    connectRooms(wildField10, beach2, "southeast", "northwest");
    connectRooms(wildField11, wildField16, "southeast", "northwest");
    connectRooms(wildField12, wildField17, "southeast", "northwest");
    connectRooms(grandTree, wildField18, "southeast", "northwest");
    connectRooms(wildField13, beach3, "southeast", "northwest");
    connectRooms(wildField15, wildField19, "southeast", "northwest");
    connectRooms(wildField16, wildField20, "southeast", "northwest");
    connectRooms(wildField17, beach4, "southeast", "northwest");
    connectRooms(wildField19, beach6, "southeast", "northwest");

    test();
}

function test() {
    goblin = new Entity("Goblin", 10, 5, 3);

    currentRoom.components.push(goblin);
    goblin2 = new Entity("Goblin2", 10, 5, 3);

    currentRoom.components.push(goblin2);
}

function returnItem(list) {
    return list[0];
}

function separateCommand(sentence) {
    sentence.toLowerCase();
    const words = sentence.split(" ");
    return words;
}

function parse(words) {
    if (words[0] == 'a') words.splice(0,1);
    if (previous_component1 != null) {
        words.splice(0, 0, previous_component1.toLowerCase());
        previous_component1 = null;
    }
    if (previous_verb != null) {
        words.splice(0, 0,previous_verb);
        previous_verb = null;
    }
    
    checkSyntax(words);
}

function checkSyntax(words) {
    verb = words[0];
    if (checkVerb(verb)) {
        if (movementDictionary.includes(verb)) {
            handleMovement(words);
        } else {
            handleAction(words);
        }
    }
}

function checkVerb(verb) { 
    if (dictionary.includes(verb)) {
        if (currentRoom.dictionary.includes(verb)) {
            return true;
        }
        outputText("You cannot do that here.");
        return false;
    }
    if (verb != "") {
        outputText("I do not recognize the verb \"" + verb + "\"");
    }
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
        case 'travel':
            if (words.length > 1) {
                words = words.slice(1);
                handleMovement(words);
            } else {
                outputText("Which direction do you want to go?");
                previous_verb = "go";
            }
        break;
        case 'head':
            if (words.length > 1) {
                words = words.slice(1);
                handleMovement(words);
            } else {
                outputText("Which direction do you want to go?");
                previous_verb = "go";
            }
        break;
        case 'move':
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
        handleDirection("up");  //Defaults climb to go up
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
        } else {
            outputText("I only understood you as far as climb");
        }
    }
    
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

function handleAction(words) {
    verb = words[0];
    switch (verb) {
        case 'attack':
            parseAttack(words);
        break;
        case 'hit':
            parseAttack(words);
        break;
        case 'stab':
            parseAttack(words);
        break;
        case 'look':
            parseLook(words);
        break;
        case 'jump':
            parseJump(words);
        break;
        case 'grab':
            parseGrab(words);
        break;
        case 'pick':
            parseGrab(words);
        break;
        case 'drop':
            parseDrop(words);
        break;
    }
}

function parseGrab(words) {
    if (words[0] == "pick" && words[1] == "up") {
        words.splice(1, 1);
        parseGrab(words);
    } else {
        grab = false;
        correctComponent = null;
        currentRoom.components.forEach(component => {
            if (component.name.toLowerCase() == words[1]) {
                correctComponent = component;
                grab = true;
            }
        });
        
        if (grab) {
            if (words.length > 2) {
                outputText("I only understood you as far as " + words[0] + " " + words[1]);
            } else {
                if (correctComponent instanceof Item) {
                    outputText("You picked up the " + words[1] + ".");
                    inventory.push(returnItem(currentRoom.components.splice(currentRoom.components.indexOf(correctComponent),1)));
                } else {
                    outputText("You cannot pick that up.");
                }
            }
        } else {
            if (words[1] != undefined) {
                outputText("There is no " + words[1] + " here.");
            } else {
                previous_verb = "pick";
                outputText("What do you want to pick up?");
            }
        }
    }
}

function parseDrop(words) {
    drop = false;
    correctComponent = null;
    inventory.forEach(component => {
        if (component.name.toLowerCase() == words[1]) {
            correctComponent = component;
            drop = true;
        }
    });
    if (drop) {
        if (words.length > 2) {
            outputText("I only understood you as far as drop " + correctComponent.name.toLowerCase() + ".")
        } else {
            outputText("You dropped the " + correctComponent.name.toLowerCase() + ".");
            currentRoom.components.push(returnItem(inventory.splice(inventory.indexOf(correctComponent),1))); 
        }
    } else {
        if (words.length == 2) {
            outputText("You do not possess " + words[1] + "")
        } else {
            previous_verb = "drop";
            outputText("What do you want to drop?");
        }
    }
    
}
 
function parseLook(words) {
    if (words.length > 1) {
        if (words[1] == "around") {
            if (words.length > 2) {
                outputText("I only understood you as far as look around.");
            } else {
                outputText(currentRoom.description);   
            }
        } else {
            outputText("I only understood you as far as look.");
        }
    } else {
        outputText(currentRoom.description);
    }
}

function parseJump(words) {
    if (words.length > 1) {
        outputText("I only understood you as far as jump");
    } else {
        outputText("Wheeeeee!");
    }
}

function parseAttack(words) {
    if (words.length > 1) {
        target = null;
        weapon = null;
        if (detectComponent(currentRoom.components,words[1])) {
            target = findComponent(currentRoom.components, words[1]);
            if (target instanceof Entity) {
                if (words.length < 3) {
                    outputText("What do you want to attack the " + target.name.toLowerCase() + " with?");
                    previous_verb = "attack";
                    previous_component1 = target.name;
                } else if (words.length == 3) {
                    if (words[2] == "with") {
                        words.splice(2,1);
                        parseAttack(words);
                    } else {
                        if (detectComponent(inventory, words[2])) {
                            weapon = findComponent(inventory, words[2]);
                            attack(target, weapon);
                        } else {
                            outputText("You do not have that!");
                        }
                    }
                } else if (words.length > 3) {
                    if (words[2] == "with") {
                        words.splice(2,1);
                        parseAttack(words);
                    } else {
                        outputText("What are you even saying?");
                    }
                }
            } else {
                outputText("You cannot attack that.");
            }
        } else {
            outputText("There is no " + words[1] + " here.");
        }
    } else {
        outputText("What do you want to attack?");
        previous_verb = "attack";
    }
    
}

function attack(entity, weapon) {
    entity.health = entity.health - weapon.damage;
    if (entity.health < 0) {
        outputText("You killed the" + entity.name + ".");
    } else {
        outputText("The attack landed!")
    }
}
function findComponent(list, name) {
    foundComponent = null;
    list.forEach(component => {
        if (component.name.toLowerCase() == name) {
        foundComponent = component;
    }});
    return foundComponent;
}
function detectComponent(list, name) {
    found = false;
    list.forEach(component => {
        if (component.name.toLowerCase() == name) {
        found = true;
    }});
    return found;
}

function promptDirection() {
    outputText("Which direction do you want to go?");
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