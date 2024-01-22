var currentRoom = null;
var rooms = [];
var inventory = [];
var previous_verb = null;
var previous_component1 = null;
var previous_component2 = null;
var dictionary = ["fight","attack","hit","swing","slash","stab","punch","dodge","look","grab","pick","drop","inventory","wait","help","info","stop","start","play"];
var movementDictionary = ["go","walk","run","travel","head","move","north","northeast","east","southeast","south","southwest","west","northwest","climb","jump"];
dictionary = dictionary.concat(movementDictionary);
var basicDictionary = dictionary;
var health = 10;
var defense = 1;
var luck = 1;
var dodge = false;
var dodgeCooldown = 0;
var actionsPerformed = [];
var playlist = ["audio/BeginnerArea.mp3","audio/Enemy_Defeated.mp3","audio/Kingdom.mp3","audio/Boss.mp3"];
var playlistIndex = 0;
var audio = null;
let musicPlayed = false;

class Room {
    location;
    description = "";
    components = [];
    dict = dictionary;
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
    customAction(x) {
        x();
    }
    altDescription = "";
    removeAction(action) {
        dictionary.pop(dictionary.indexOf(action));
    }
    addAction(action) {
        dictionary.push(action);
    }
}
class Component {
    name;
    description;
    constructor(name) {
        this.name = name;
    }
}
class Enemy extends Component {
    health = 1;
    defense = 0;
    strength = 0;
    attackTime = 9999999;
    turnsInteracted = 0;
    dialogue;
    constructor(name, health, defense, strength, attackTime) {
        super(name);
        this.health = health;
        this.defense = defense;
        this.strength = strength;
        this.attackTime = attackTime;
    }  
}
class CustomEnemy extends Enemy {
    names = [];
    constructor(names, health, defense, strength, attackTime) {
        super(names[0], health, defense, strength, attackTime);
        this.names = names;
    }
}
class NPC extends Component {
    dialogue = [];
    constructor(name, dialogue) {
        super(name);
        this.dialogue = dialogue;
    }
}
class Item extends Component {
    damage = 0;
    constructor(name, damage) {
        super(name);
        this.damage = damage;
    }
}
class CustomItem extends Item {
    names = [];
    constructor(names, damage) {
        super(names[0], damage);
        this.names = names;
    }
}
class Consumable extends Component {
    health = 0;
    constructor(name, health) {
        super(name);
        this;health = health;
    }
}

function initializeRooms() {
    const starterRoad1 = new Room("Brooke Road");
    starterRoad1.description = "The road to the east looks promising, but there's nothing to the west.";
    currentRoom = starterRoad1;

    const sword = new Item("Sword", 3);
    sword.description = "A steel sword lays on the ground here."
    addComponent(currentRoom, sword);

    const nothing = new Room("Nothing");
    nothing.description = "You see nothing beyond this point. You should probably head back.";
    connectRooms(starterRoad1, nothing, "west", "east");

    const beginnerFork = new Room("Fork in the Road");
    beginnerFork.description = "A fork in the road has two trails. One heads northeast, and the other heads east.";
    connectRooms(beginnerFork, starterRoad1, "west", "east");

    const goblin = new Enemy("Goblin", 10, 0, 2, 3);
    goblin.description = "A goblin stands in your way."
    addComponent(beginnerFork,goblin);

    //Not a custom room, because once the user types "open door" with a key, the room is obsolete.
    const goblinDoor = new Room("Mysterious Door");
    goblinDoor.description = "A big wooden door that seems to be locked.";
    connectRooms(beginnerFork, goblinDoor, "northeast", "southwest");

    const starterRoad2 = new Room("Brooke Road");
    starterRoad2.description = "This road leads from east to west.";
    connectRooms(beginnerFork, starterRoad2, "east", "west");

    const wildField1 = new Room("Wild Fields");
    const wildField2 = new Room("Wild Fields");
    const wildField3 = new Room("Wild Fields");
    wildField3.description = "A trail that leads towards the mountains is northeast from here."
    const wildField4 = new Room("Wild Fields");
    const wildField5 = new Room("Wild Fields");
    wildField5.description = "This vast meadow goes on for a while. It may be hard to know where you're going from here, so mapping it out might help.";
    const wildField6 = new Room("Wild Fields");
    const wildField7 = new Room("Wild Fields");
    wildField7.description = "The field spreads far in every direction."
    const wildField8 = new Room("Wild Fields");
    const wildField9 = new Room("Wild Fields");
    const wildField10 = new Room("Wild Fields");
    const wildField11 = new Room("Wild Fields");
    const wildField12 = new Room("Wild Fields");

    const grandTree = new Room("Grand Tree");
    grandTree.description = "The grand tree soars to towering heights, its branches reaching outward, while its mighty trunk radiates a mesmerizing glow.";
    const largeBranch = new Room("Large Branch");
    largeBranch.description = "This branch is sturdy. From here, you can see the entire field from here. Going up might allow you to see further.";
    connectRooms(grandTree, largeBranch, "up", "down");
    const appleBranch = new CustomRoom("Weak Branch");
    appleBranch.description = "You can see a kingdom southwest from here.";
    connectRooms(largeBranch, appleBranch, "up", "down");
    const apple = new Consumable("Apple", 3);
    apple.description = "A shimmering apple can be seen.";
    appleBranch.components.push(apple);

    const wildField13 = new Room("Wild Fields");
    const wildField14 = new Room("Wild Fields");
    const wildField15 = new Room("Wild Fields");
    const wildField16 = new Room("Wild Fields");
    const wildField17 = new Room("Wild Fields");

    const wildField18 = new CustomRoom("Wild Fields");
    const TMK = new CustomEnemy(["Knight","Armor"], 10, 5, 5, 2);
    TMK.description = "A knight with seemingly no one inside stands tall and still here."
    wildField18.components.push(TMK);
    
    const wildField19 = new Room("Wild Fields");
    const wildField20 = new Room("Wild Fields");

    const beach1 = new Room("Beach");
    beach1.description = "This coast consists of various shells and colorful rocks.";
    const beach2 = new Room("Beach");
    const beach3 = new Room("Beach");
    const beach4 = new Room("Beach");
    const beach5 = new Room("Beach");
    const beach6 = new Room("Beach");

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

    //A seaside kingdom troubled by the lands
    const lowestoftTrail1 = new Room("Lowestoft Trail");
    lowestoftTrail1.description = "The Lowestoft Kingdom spans southwest from here. To the northeast is a vast field.";
    const lowestoftTrail2 = new Room("Lowestoft Trail");

    connectRooms(wildField19, lowestoftTrail1,"southwest","northeast");
    connectRooms(lowestoftTrail1, lowestoftTrail2,"southwest","northeast");
}


function addComponent(room, component) {
    room.components.push(component);
}

function returnItem(list) {
    return list[0];
}

function separateCommand(sentence) {
    sentence = sentence.toLowerCase();
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
        words.splice(0, 0, previous_verb);
        previous_verb = null;
    }
    
    checkSyntax(words);
}

function checkSyntax(words) {
    let verb = words[0];
    if (checkVerb(verb)) {
        if (!actionsPerformed.includes(verb)) actionsPerformed.push(verb);
        if (movementDictionary.includes(verb)) {
            if (!enemiesInRoom()) {
                handleMovement(words);
            }
        } else {
            handleAction(words);
        }
    }
}

function checkVerb(verb) { 
    if (dictionary.includes(verb)) {
        if (currentRoom.dict.includes(verb)) {
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
            parseMove(words);
        break;
        case 'walk':
            parseMove(words);
        break;
        case 'run':
            parseMove(words);
        break;
        case 'travel':
            parseMove(words);
        break;
        case 'head':
            parseMove(words);
        break;
        case 'move':
            parseMove(words);
        break;
        case 'north':
            parseMove(words);
        break;
        case 'northeast':
            parseMove(words);
        break;
        case 'east':
            parseMove(words);
        break;
        case 'southeast':
            parseMove(words);
        break;
        case 'south':
            parseMove(words);
        break;
        case 'southwest':
            parseMove(words);
        break;
        case 'west':
            parseMove(words);
        break;
        case 'northwest':
            parseMove(words);
        break;
        case 'climb':
            parseClimb(words);
        break;
        case 'jump':
            parseJump(words);
        break;
        default:
            outputText("That's not a valid direction.");    //SHOULD NOT HAPPEN.
    }
}

function parseMove(words) {
    if (words.length == 1) {
        if (words[0] == "go" || words[0] == "walk" || words[0] == "run" || words[0] == "travel" || words[0] == "head") {
            outputText("Which direction do you want to go?");
            previous_verb = "go";
        } else {
            handleDirection(words[0]);
        }
    } else if (words.length == 2) {
        if (words[0] == "go" || words[0] == "walk" || words[0] == "run" || words[0] == "travel" || words[0] == "head") {
            handleDirection(words[1]);
        } else {
            outputText("I only understood you as far as " + words[0] + ".");
        }
    }
}

function parseClimb(words) {
    if (words.length == 1) {
        handleDirection("up");  //Defaults climb to go up
    } else {
        if (words[1] == 'up' || words[1] == 'down') {
            if (words.length > 2) {
                outputText("I only understood you as far as climb " + words[1] + ".");
            }
            else {
                handleDirection(words[1]);
            }
        } else {
            outputText("I only understood you as far as climb.");
        }
    } 
}

function handleDirection(direction) {
    if(!currentRoom.directions.some(dir => {
        if (dir == direction) {
            let index = currentRoom.directions.indexOf(direction);
            changeRoom(index); return true;
        }
        })) {
            outputText("You cannot go that direction.");
            return false;
        }

}

function changeRoom(index) {
    currentRoom = currentRoom.connectedRooms[index];
    outputText(currentRoom.location);
    if (!currentRoom.entered) {
        outputText(currentRoom.description);
        currentRoom.entered = true;
    }
    for (let component of currentRoom.components) {
        outputText(component.description);
    }
    topRightElement.textContent = currentRoom.location;
}

function enemiesInRoom() {
    for (let component of currentRoom.components) {
        if (component instanceof Enemy || component instanceof CustomEnemy) {
            outputText("You cannot do that right now!");
            return true;
        }
    }
    return false;
}

function updateEnemies() {
    for (let enemy of currentRoom.components) {
        if (enemy instanceof Enemy || enemy instanceof CustomEnemy) {
            enemy.turnsInteracted++;
            // console.log("Attack Time:" + enemy.attackTime);
            // console.log("Turns Interacted: " + enemy.turnsInteracted);
            if (enemy.attackTime - enemy.turnsInteracted == 1) {
                outputText("The " + enemy.name.toLowerCase() + " is preparing its attack.");
            }
            if (enemy.turnsInteracted >= enemy.attackTime && enemy.attackTime != -1) {   //-1 represents an enemy that does not attack. Too lazy to do a different way for now.
                attackPlayer(enemy);
                enemy.turnsInteracted = 0;
                
            }
        }
    }
    dodgeCooldown--;
    dodge = false;  //Disables dodge after attack process finishes to ensure dodge lasts for only one turn
}

//Don't forget to updateEnemies after each successful command (if necessary).
function handleAction(words) {
    let verb = words[0];
    switch (verb) {
        case 'fight':
            parseAttack(words);
        break;
        case 'attack':
            parseAttack(words);
        break;
        case 'hit':
            parseAttack(words);
        break;
        case 'slash':
            parseAttack(words);
        break;
        case 'stab':
            parseAttack(words);
        break;
        case 'swing':
            parseSwing(words);
        break;
        case 'punch':
            parsePunch(words);
        break;
        case 'dodge':
            parseDodge(words);
        break;
        case 'look':
            parseLook(words);
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
        case 'wait':
            parseWait(words);
        break;
        case 'inventory':
            parseInventory(words);
        break;
        case 'help':
            parseHelp(words);
        break;
        case 'info':
            parseInfo(words);
        break;
        case 'stop':
            parseStop(words);
        break;
        case 'start':
            parseStart(words);
        break;
        case 'play':
            parseStart(words);
        break;
    }
}

function parseGrab(words) {
    if (words[0] == "pick" && words[1] == "up") {
        words.splice(1, 1);
        parseGrab(words);
    } else if (words[0] == "pick" && words[2] == "up") {
        words.splice(2,2);
        parseGrab(words);
    } else {
        let grab = false;
        let correctComponent = null;
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
                if (correctComponent instanceof Item || correctComponent instanceof Consumable) {
                    outputText("You picked up the " + words[1] + ".");
                    inventory.push(returnItem(currentRoom.components.splice(currentRoom.components.indexOf(correctComponent),1)));
                    updateEnemies();
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
    let drop = false;
    let correctComponent = null;
    inventory.forEach(component => {
        if (component.name.toLowerCase() == words[1]) {
            correctComponent = component;
            drop = true;
        }
    });
    if (drop) {
        if (words.length > 2) {
            outputText("I only understood you as far as drop " + correctComponent.name.toLowerCase() + ".")
        } else {                 //Successful command
            outputText("You dropped the " + correctComponent.name.toLowerCase() + ".");
            currentRoom.components.push(returnItem(inventory.splice(inventory.indexOf(correctComponent),1))); 
            updateEnemies();
        }
    } else {
        if (words.length == 2) {
            outputText("You do not possess " + words[1] + ".");
        } else if (words.length > 2) {
            outputText("I only understood you as far as drop.");
        } else {
            previous_verb = "drop";
            outputText("What do you want to drop?");
        }
    }
}
 
function parseLook(words) {
    if (words.length > 1) {
        if (words[1] == "around") {
            words.splice(1,1);
            parseLook(words);
        } else {
            outputText("I only understood you as far as look.");
        }
    } else {
        outputText(currentRoom.location);
        outputText(currentRoom.description);
        for (let component of currentRoom.components) {
            outputText(component.description);
        }
    }
}

function parseJump(words) {
    if (words.length == 1) {
        if (handleDirection("down")) {
            outputText("Wheeeeee!");
        }
    } else if (words.length == 2) {
        if (words[1] == "down") {
            if (handleDirection("down")) {
                outputText("Wheeeeee!");
            }
        } else {
            outputText("I only understood you as far as jump.");
        }
    } else {
        outputText("I only understood you as far as jump.");
    }
}

function parseDodge(words) {
    if (words.length > 1) {
        outputText("I only understood you as far as dodge.");
    } else {
        if (dodgeCooldown > 0) {
            outputText("You cannot dodge right now.");
        } else {
            let dodgeCheck = Math.ceil(Math.random() * 10)
            let dodgeValue = Math.ceil(Math.random() * 5 + luck);   //Luck affects how likely you are to dodge
            if (dodgeValue > dodgeCheck) {
                dodge = true;
            } else {
                outputText("You failed to dodge!")
            }
            dodgeCooldown = 3;
            updateEnemies();
        }
    }
}

function parseWait(words) {
    if (words.length > 1) {
        outputText("I only understood you as far as wait.");
    } else {
        let result = Math.ceil(Math.random() * 100);
        console.log(result);
        if (result > 90)
            outputText("Time passes. You ponder your existence and the existence of the universe. You are not sure what to do with yourself.");
        else if (result > 50)
            outputText("You wait. Silently.");
        else
            outputText("Time passes.");
        updateEnemies();
    }
}

function parseInventory(words) {
    if (words.length > 1) {
        outputText("I only understood you as far as wait.");
    } else {
        if (inventory.length == 0) {
            outputText("Your inventory is currently empty.");
        } else {
            for (let i = 0; i < inventory.length; i++) {
                outputText(inventory[i].name);
            }
        }
    }
}

function parseAttack(words) {
    if (words.length > 1) {
        let target = null;
        let weapon = null;
        if (detectComponent(currentRoom.components,words[1])) {
            target = findComponent(currentRoom.components, words[1]);
            if (target instanceof Enemy || target instanceof CustomEnemy) {
                if (words.length < 3) {
                    outputText("What do you want to attack the " + target.name.toLowerCase() + " with?");
                    previous_verb = "attack";
                    previous_component1 = target.name;
                } else if (words.length == 3) {
                    if (words[2] == "with" || words[2] == "using") {
                        words.splice(2,1);
                        parseAttack(words);
                    } else {
                        if (detectComponent(inventory, words[2])) {
                            weapon = findComponent(inventory, words[2]);
                            if (weapon instanceof Item) {
                                attackEnemy(target, weapon);
                                updateEnemies();
                                
                            } else {
                                outputText("You cannot attack with that!");
                            }
                        } else if (words[2] == "fist" || words[2] == "fists" || words[2] == "feet" || words[2] == "foot" || words[2] == "body" || words[2] == "self" || words[2] == "player") {
                            let dummy = new Item("Body",1);
                            attackEnemy(target,dummy);
                            updateEnemies();
                            
                        } else {
                            outputText("You do not have that!");
                        }
                    }
                } else if (words.length > 3) {
                    if (words[2] == "with" || words[2] == "using") {
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

function parseSwing(words) {
    if (words.length > 1) {
        let target = null;
        let weapon = null;
        if (detectComponent(inventory, words[1]) || words[1] == "fist" || words[1] == "fists") {
            if (words[1] == "fist" || words[1] == "fists") {
                weapon = new Item("Body",1);
            } else {
                weapon = findComponent(inventory, words[1]);
            }
            if (words.length < 3) {
                previous_verb = "swing";
                previous_component1 = weapon.name;
                outputText("What do you want to swing the " + weapon.name.toLowerCase() + " at?");
            } else if (words.length == 3) {
                if (detectComponent(currentRoom.components,words[2])) {
                    target = findComponent(currentRoom.components, words[2]);
                    if (target instanceof Enemy || target instanceof CustomEnemy) {
                        attackEnemy(target, weapon);
                        updateEnemy();
                    } else {
                        outputText("You cannot attack that.");
                    }
                } else {
                    outputText("There is no " + words[2] + " here.");
                } 
            } else if (words.length > 3) {
                if (words[2] == "at") {
                    words.splice(2,1);
                    parseSwing(words);
                } else {
                    outputText("What are you even saying?");
                }
            }
        } else{
            outputText("You do not have that!");
        }
    } else {
        outputText("What do you want to swing?");
        previous_verb = "swing";
    }
}

function parsePunch(words) {
    if (words.length == 1) {
        outputText("What do you want to punch?");
        previous_verb = "punch";
    } else if (words.length == 2) {
        words.push("fist");
        parseAttack(words);
    } else {
        outputText("What are you even saying?");
    }
}

function parseHelp(words) {
    if (words.length > 1) {
        outputText("I only understood you as far as help.");
    } else {
        if (!(actionsPerformed.includes("grab") || actionsPerformed.includes("pick") )) {
            outputText("Try picking something up.")
        } else if (!(actionsPerformed.includes("north") || actionsPerformed.includes("northeast") || actionsPerformed.includes("east") || actionsPerformed.includes("southeast") || actionsPerformed.includes("south") || actionsPerformed.includes("southwest") || actionsPerformed.includes("west") || actionsPerformed.includes("northwest"))) {
            outputText("If you are still having trouble traversing, try using cardinal and ordinal directions.");
        } else if (!(actionsPerformed.includes("attack") || actionsPerformed.includes("stab") || actionsPerformed.includes("hit") || actionsPerformed.includes("swing") || actionsPerformed.includes("slash") || actionsPerformed.includes("fight"))) {
            outputText("You should try attacking something.");
        } else if (!actionsPerformed.includes("dodge")) {
            outputText("Have you tried dodging? Man it is awesome. It does take some luck, but it is totally worth trying.");
        } else {
            outputText("You should try exploring a bit more.");
        }
    }
}

function parseInfo(words) {
    if (words.length > 1) {
        outputText("I only understood you as far as info.");
    } else {
        outputText("Mirenalt Nudgeon is a terminal dungeon where the player must learn by playing and win by learning. A wonderful and confusing land awaits you in the world of Merinalt.");
    }
}

function parseStop(words) {
    if (words.length == 1) {
        previous_verb = "stop";
        outputText("What would you like to stop?");
    } else if (words.length == 2) {
        if (words[1] == 'sound' || words[1] == 'music') {
            if (audio != null) {
                outputText("Music has stopped.");
                audio.pause();
            }
        } else if (words[1] == 'time') {
            outputText("Time has successfully stopped until your next action.");
        } else {
            outputText("I only understood you as far as stop.");
        }
    } else {
        if (words[1] == 'sound' || words[1] == 'music') {
            outputText("I only understood you as far as stop " +words[1]+ ".");
        } else if (words[1] == 'time') {
            outputText("I only understood you as far as stop time.");
        } else {
            outputText("I only understood you as far as stop.");
        }
    }
}

function parseStart(words) { 
    if (words.length == 1) {
        previous_verb = "play";
        outputText("What would you like to play?");
    } else if (words.length == 2) {
        if (words[1] == "sound" || words[1] == "music") {
            if (audio != null) {
                outputText("Music has started.");
                audio.play();
            }
        } else if (words[1] == "mirenalt") {
            outputText("You are already playing that game!");
        } else {
            outputText("I only understood you as far as " + words[0] + ".");
        }
    } else if (words.length == 3) {
        if (words[1] == "mirenalt" && words[2] == "nudgeon") {
            outputText("You are already playing that game!");
        } else {
            if (words[1] == "mirenalt") {
                outputText("I only understood you as far as play mirenalt.");
            } else {
                outputText("I only understood you as far as play.");
            }
        }
    } else {
        outputText("I only understood you as far as play.");
    }
}

function attackEnemy(enemy, weapon) {
    if (weapon.damage > enemy.defense) {
        enemy.health = enemy.health + (enemy.defense - weapon.damage);
        if (enemy.health < 0) {
            outputText("You killed the " + enemy.name.toLowerCase() + ".");
            currentRoom.components.pop(enemy);
        } else {
            outputText("The attack landed!");
        }
    } else {
        outputText("The attack was ineffective.");
    }
}

function attackPlayer(enemy) {
    if (!dodge) {
        if (enemy.strength > defense) { 
            health = health + (defense - enemy.strength);
            outputText("The " + enemy.name.toLowerCase() + " attacked you!");
            if (health <= 0) {
                outputText("You died. Game over.");
                var input = document.getElementById("terminal-input");
                if (input) {
                    input.remove();
                } else {
                    console.log("Element not found.");
                }
            }
        }
    } else {
        outputText("You successfully dodged the attack!");
    }
}

function findComponent(list, name) {
    let foundComponent = null;
    list.forEach(component => {
        if (component instanceof CustomEnemy) {
            for (let componentName of component.names) {
                if (componentName.toLowerCase() == name) {
                    foundComponent = component;
                    break;
                }
            }
        } else if (component.name.toLowerCase() == name) {
        foundComponent = component;
    }});
    return foundComponent;
}

function detectComponent(list, name) {
    let found = false;
    list.forEach(component => {
        if (component instanceof CustomEnemy) {
            for (let componentName of component.names) {
                console.log(componentName.toLowerCase() == name);
                if (componentName.toLowerCase() == name) {
                    found = true;
                    break;
                }
            }
        } else if (component.name.toLowerCase() == name) {
        found = true;
    }});
    return found;
}

/**
* x -> First room |
* y -> Second room |
* xdir -> Direction to y relative to x |
* ydir -> Direction to x relative to y
*/
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

function handleMusic() {
    musicPlayed = true;
    var song = new Audio(playlist[playlistIndex]);
    song.volume = 0.1;
    audio = song;
    playMusic(song);
    playlistIndex++;
    if (playlistIndex > playlist.length-1) playlistIndex = 0;
}

function playMusic(song) {
    if (musicPlayed) {
        song.play();
        song.addEventListener('ended', handleMusic);
        document.removeEventListener('click', handleMusic);
    }
}

window.onload = (event) => {
    initializeRooms();
    outputText(currentRoom.location);
    outputText(currentRoom.description);
    for (let component of currentRoom.components) {
        outputText(component.description);
    }
    currentRoom.entered = true;
    document.addEventListener('click', handleMusic);
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
            outputText("I am sorry, but that command is too long.")
        } else {
            parse(separateCommand(command)); 
        }
    }
}