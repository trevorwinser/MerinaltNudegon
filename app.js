import { Room, CustomRoom, Component, Enemy, NPC, Item, CustomItem, Consumable, Weapon } from './classes.js';
import { parse_start } from './actions/start.js';
import { parse_stop } from './actions/stop.js';

var current_room = null;
var rooms = [];
var inventory = [];
var previous_verb = null;
var previous_component1 = null;
export var dictionary = ["fight","attack","hit","swing","slash","stab","punch","dodge","look","grab","pick","drop","inventory","wait","help","info","stop","start","play","eat","drink","consume","block"];
var movement_dictionary = ["go","walk","run","travel","head","move","north","northeast","east","southeast","south","southwest","west","northwest","climb","jump"];
dictionary = dictionary.concat(movement_dictionary);
var health = 10;
var defense = 1;
var block = 0;
var luck = 1;
var dodge = false;
var dodge_cooldown = 0;
var actions_performed = [];
var playlist = ["audio/start.mp3","audio/victory.mp3","audio/kingdom.mp3","audio/boss.mp3"];
var playlist_index = 0;
export var audio = null;
var music_played = false;

function initialize_rooms() {
    const starter_road_1 = new Room("Brooke Road");
    starter_road_1.description = "The road to the east looks promising, but there's nothing to the west.";
    current_room = starter_road_1;

    const sword = new Weapon("Sword", 3, 1);
    sword.description = "A steel sword lays on the ground here."
    add_component(current_room, sword);

    const goblin = new Enemy("Goblin", 10, 0, 4, 3, "hostile");
    goblin.description = "A goblin stands in your way.";
    goblin.escapable = false;
    add_component(current_room,goblin);


    const nothing = new Room("Nothing");
    nothing.description = "You see nothing beyond this point. You should probably head back.";
    connect_rooms(starter_road_1, nothing, "west", "east");

    const fork_in_the_road = new Room("Fork in the Road");
    fork_in_the_road.description = "A fork in the road has two trails. One heads northeast, and the other heads east.";
    connect_rooms(fork_in_the_road, starter_road_1, "west", "east");

    const goblin_door = new Room("Goblin Door");
    goblin_door.description = "A large door stands in your way. There is a strange symbol branded across it with a small opening just below it.";
    connect_rooms(fork_in_the_road, goblin_door, "northeast", "southwest");

    const starter_road_2 = new Room("Brooke Road");
    starter_road_2.description = "To the east, vast plains stretch out, and a tree so tall that it is visible from where you stand.";
    connect_rooms(fork_in_the_road, starter_road_2, "east", "west");

    const wild_field_1 = new Room("Wild Fields");
    const wild_field_2 = new Room("Wild Fields");
    const wild_field_3 = new Room("Wild Fields");
    wild_field_3.description = "A trail that leads towards the mountains is northeast from here.";
    const wild_field_4 = new Room("Wild Fields");
    const wild_field_5 = new Room("Wild Fields");
    wild_field_5.description = "This vast meadow goes on for a while. It may be hard to know where you're going from here, so mapping it out might help.";
    const wild_field_6 = new Room("Wild Fields");
    const wild_field_7 = new Room("Wild Fields");
    wild_field_7.description = "The field spreads far in every direction.";
    const wild_field_8 = new Room("Wild Fields");
    const wild_field_9 = new Room("Wild Fields");
    const wild_field_10 = new Room("Wild Fields");
    const wild_field_11 = new Room("Wild Fields");
    const wild_field_12 = new Room("Wild Fields");

    const grand_tree = new Room("Grand Tree");
    grand_tree.description = "The grand tree soars to towering heights, its branches reaching outward, while its mighty trunk radiates a mesmerizing glow.";
    const large_branch = new Room("Large Branch");
    large_branch.description = "This branch is sturdy. From here, you can see the entire field from here. Going up might allow you to see further.";
    connect_rooms(grand_tree, large_branch, "up", "down");

    // Literal psychopath coding.
    // Find a new way, I BEG OF YOU
    const apple_branch = new CustomRoom("Small Branch", [() => output_text("Oh no! The branch broke as you grabbed the apple. You also were a little hurt by the fall."), remove_room, () => health--], [() => words[0] === "grab" || words[0] === "pick", () => conditions[0], () => conditions[0]]);
    apple_branch.description = "You can see a kingdom southwest from here. It seems this branch will break from too much movement.";
    connect_rooms(large_branch, apple_branch, "up", "down");

    const apple = new Consumable("Apple", 3);
    apple.description = "A shimmering apple can be seen.";
    apple_branch.components.push(apple);

    const wild_field_13 = new Room("Wild Fields");
    const wild_field_14 = new Room("Wild Fields");
    const wild_field_15 = new Room("Wild Fields");
    const wild_field_16 = new Room("Wild Fields");
    const wild_field_17 = new Room("Wild Fields");

    const wild_field_18 = new CustomRoom("Wild Fields");
    const TMK = new Enemy(["Knight","Armor"], 10, 5, 5, 2);
    TMK.description = "A knight with seemingly no one inside stands tall and still here.";
    wild_field_18.components.push(TMK);
    
    const wild_field_19 = new Room("Wild Fields");
    const wild_field_20 = new Room("Wild Fields");
    const wild_field_21 = new Room("Wild Fields");

    const beach_1 = new Room("Beach");
    beach_1.description = "This coast consists of various shells and colorful rocks.";
    const beach_2 = new Room("Beach");
    const beach_3 = new Room("Beach");
    const beach_4 = new Room("Beach");
    const beach_5 = new Room("Beach");
    const beach_6 = new Room("Beach");

    const lowestoft_trail_1 = new Room("Lowestoft Trail");
    lowestoft_trail_1.description = "A trail towards the Lowestoft Kingdom spans southwest from here. To the northeast is a vast field.";
    const lowestoft_trail_2 = new Room("Lowestoft Trail");
    lowestoft_trail_2.description = "The Lowestoft Kingdom can be seen directly south from here.";

    connect_rooms(wild_field_1,wild_field_2,"east","west");
    connect_rooms(wild_field_2,wild_field_3,"east","west");
    connect_rooms(wild_field_3,wild_field_4,"east","west");
    connect_rooms(starter_road_2,wild_field_5,"east","west");
    connect_rooms(wild_field_5,wild_field_6,"east","west");
    connect_rooms(wild_field_6,wild_field_7,"east","west");
    connect_rooms(wild_field_7,wild_field_8,"east","west");
    connect_rooms(wild_field_8,wild_field_9,"east","west");
    connect_rooms(wild_field_9,wild_field_10,"east","west");
    connect_rooms(wild_field_10,beach_1,"east","west");
    connect_rooms(wild_field_11,wild_field_12,"east","west");
    connect_rooms(wild_field_12,grand_tree,"east","west");
    connect_rooms(grand_tree,wild_field_13,"east","west");
    connect_rooms(wild_field_13,wild_field_14,"east","west");
    connect_rooms(wild_field_14,beach_2,"east","west");
    connect_rooms(wild_field_15,wild_field_16,"east","west");
    connect_rooms(wild_field_16,wild_field_17,"east","west");
    connect_rooms(wild_field_17,wild_field_18,"east","west");
    connect_rooms(wild_field_18,beach_3,"east","west");
    connect_rooms(wild_field_19,wild_field_20,"east","west");
    connect_rooms(wild_field_20,wild_field_21,"east","west");
    connect_rooms(wild_field_21,beach_4,"east","west");
    connect_rooms(lowestoft_trail_1,beach_5,"east","west");
    connect_rooms(beach_5,beach_6,"east","west");

    connect_rooms(wild_field_1,wild_field_6,"south","north");
    connect_rooms(wild_field_2,wild_field_7,"south","north");
    connect_rooms(wild_field_3,wild_field_8,"south","north");
    connect_rooms(wild_field_4,wild_field_9,"south","north");
    connect_rooms(wild_field_6,wild_field_11,"south","north");
    connect_rooms(wild_field_7,wild_field_12,"south","north");
    connect_rooms(wild_field_8,grand_tree,"south","north");
    connect_rooms(wild_field_9,wild_field_13,"south","north");
    connect_rooms(wild_field_10,wild_field_14,"south","north");
    connect_rooms(beach_1,beach_2,"south","north");
    connect_rooms(wild_field_11,wild_field_15,"south","north");
    connect_rooms(wild_field_12,wild_field_16,"south","north");
    connect_rooms(grand_tree,wild_field_17,"south","north");
    connect_rooms(wild_field_13,wild_field_18,"south","north");
    connect_rooms(wild_field_14,beach_3,"south","north");
    connect_rooms(wild_field_15,wild_field_19,"south","north");
    connect_rooms(wild_field_16,wild_field_20,"south","north");
    connect_rooms(wild_field_17,wild_field_21,"south","north");
    connect_rooms(wild_field_18,beach_4,"south","north");
    connect_rooms(wild_field_19,lowestoft_trail_1,"south","north");
    connect_rooms(wild_field_20,beach_5,"south","north");
    connect_rooms(wild_field_21,beach_6,"south","north");

    connect_rooms(wild_field_1,wild_field_5,"southwest","northeast");
    connect_rooms(wild_field_2,wild_field_6,"southwest","northeast");
    connect_rooms(wild_field_3,wild_field_7,"southwest","northeast");
    connect_rooms(wild_field_4,wild_field_8,"southwest","northeast");
    connect_rooms(wild_field_7,wild_field_11,"southwest","northeast");
    connect_rooms(wild_field_8,wild_field_12,"southwest","northeast");
    connect_rooms(wild_field_9,grand_tree,"southwest","northeast");
    connect_rooms(wild_field_10,wild_field_13,"southwest","northeast");
    connect_rooms(beach_1,wild_field_14,"southwest","northeast");
    connect_rooms(wild_field_12,wild_field_15,"southwest","northeast");
    connect_rooms(grand_tree,wild_field_16,"southwest","northeast");
    connect_rooms(wild_field_13,wild_field_17,"southwest","northeast");
    connect_rooms(wild_field_14,wild_field_18,"southwest","northeast");
    connect_rooms(beach_2,beach_3,"southwest","northeast");
    connect_rooms(wild_field_16,wild_field_19,"southwest","northeast");
    connect_rooms(wild_field_17,wild_field_20,"southwest","northeast");
    connect_rooms(wild_field_18,wild_field_21,"southwest","northeast");
    connect_rooms(wild_field_20,lowestoft_trail_1,"southwest","northeast");
    connect_rooms(wild_field_21,beach_5,"southwest","northeast");
    connect_rooms(beach_4,beach_6,"southwest","northeast");
    connect_rooms(lowestoft_trail_1,lowestoft_trail_2,"southwest","northeast");

    connect_rooms(wild_field_1,wild_field_7,"southeast","northwest");
    connect_rooms(wild_field_2,wild_field_8,"southeast","northwest");
    connect_rooms(wild_field_3,wild_field_9,"southeast","northwest");
    connect_rooms(wild_field_4,wild_field_10,"southeast","northwest");
    connect_rooms(wild_field_5,wild_field_11,"southeast","northwest");
    connect_rooms(wild_field_6,wild_field_12,"southeast","northwest");
    connect_rooms(wild_field_7,grand_tree,"southeast","northwest");
    connect_rooms(wild_field_8,wild_field_13,"southeast","northwest");
    connect_rooms(wild_field_9,wild_field_14,"southeast","northwest");
    connect_rooms(wild_field_10,beach_2,"southeast","northwest");
    connect_rooms(wild_field_11,wild_field_16,"southeast","northwest");
    connect_rooms(wild_field_12,wild_field_17,"southeast","northwest");
    connect_rooms(grand_tree,wild_field_18,"southeast","northwest");
    connect_rooms(wild_field_13,beach_3,"southeast","northwest");
    connect_rooms(wild_field_15,wild_field_20,"southeast","northwest");
    connect_rooms(wild_field_16,wild_field_21,"southeast","northwest");
    connect_rooms(wild_field_17,beach_4,"southeast","northwest");
    connect_rooms(wild_field_19,beach_5,"southeast","northwest");
    connect_rooms(wild_field_20,beach_6,"southeast","northwest");

    const townGate1 = new Room("Gate Entrance");
    townGate1.description = "The gate entrance, adorned with intricate wrought-iron designs, opens to reveal a captivating view of a bustling town square is visible to the southeast.";

    connect_rooms(lowestoft_trail_2, townGate1, "south", "north");

    const townSquare = new Room("Town Square");
    townSquare.description = "The town square displays a large fountain with a statue of an unknown lady. The townsfolk are bustling with joy.";

    connect_rooms(townGate1, townSquare, "southeast", "northwest");
}

function add_component(room, component) {
    room.components.push(component);
}

//Specific case when attempting to add elements of a list of size 1 to another list.
function return_item(list) {
    return list[0];
}

function separate_command(sentence) {
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
    
    check_syntax(words);
}

function check_syntax(words) {
    let verb = words[0];
    if (check_verb(verb)) {
        if (!actions_performed.includes(verb)) actions_performed.push(verb);
        if (movement_dictionary.includes(verb)) {
            if (room_escapable()) {
                if (handle_movement(words)) {
                    if (current_room instanceof CustomRoom) {
                        current_room.check_action(words);
                    }
                }
            }
        } else {
            if (handle_action(words)) {
                if (current_room instanceof CustomRoom) {
                    current_room.check_action(words);
                }
            }

        }
    }
}

function check_verb(verb) { 
    if (dictionary.includes(verb)) {
        if (current_room.dict.includes(verb)) {
            return true;
        }
        output_text("You cannot do that here.");
        return false;
    }
    if (verb != "") {
        output_text("I do not recognize the verb \"" + verb + "\"");
    }
    return false;
}

function handle_movement(words) {
    switch (words[0]) {
        case 'go':
            return parse_move(words);
        case 'walk':
            return parse_move(words);
        case 'run':
            return parse_move(words);
        case 'travel':
            return parse_move(words);
        case 'head':
            return parse_move(words);
        case 'move':
            return parse_move(words);
        case 'north':
            return parse_move(words);
        case 'northeast':
            return parse_move(words);
        case 'east':
            return parse_move(words);
        case 'southeast':
            return parse_move(words);
        case 'south':
            return parse_move(words);
        case 'southwest':
            return parse_move(words);
        case 'west':
            return parse_move(words);
        case 'northwest':
            return parse_move(words);
        case 'climb':
            return parse_climb(words);
        case 'jump':
            return parse_jump(words);
        default:
            output_text("That's not a valid direction.");    //SHOULD NOT HAPPEN.
    }
    return false;
}

function parse_move(words) {
    if (words.length == 1) {
        if (words[0] == "go" || words[0] == "walk" || words[0] == "run" || words[0] == "travel" || words[0] == "head" || words[0] == "move") {
            output_text("Which direction do you want to go?");
            previous_verb = "go";
        } else {
            return handle_direction(words[0]);
        }
    } else if (words.length == 2) {
        if (words[0] == "go" || words[0] == "walk" || words[0] == "run" || words[0] == "travel" || words[0] == "head" || words[0] == "move") {
            return handle_direction(words[1]);
        } else {
            output_text("I only understood you as far as " + words[0] + ".");
        }
    }
    return false;
}

function parse_climb(words) {
    if (words.length == 1) {
        return handle_direction("up");  //Defaults climb to go up
    } else {
        if (words[1] == 'up' || words[1] == 'down') {
            if (words.length > 2) {
                output_text("I only understood you as far as climb " + words[1] + ".");
            }
            else {
                return handle_direction(words[1]);
            }
        } else {
            output_text("I only understood you as far as climb.");
        }
    } 
    return false;
}

function parse_jump(words) {
    if (words.length == 1) {
        if (handle_direction("down")) {
            output_text("Wheeeeee!");
            return true;
        }
    } else if (words.length == 2) {
        if (words[1] == "down") {
            if (handle_direction("down")) {
                output_text("Wheeeeee!");
                return true;
            }
        } else {
            output_text("I only understood you as far as jump.");
        }
    } else {
        output_text("I only understood you as far as jump.");
    }
    return false;
}

function handle_direction(direction) {
    if(!current_room.directions.some(dir => {
        if (dir == direction) {
            let index = current_room.directions.indexOf(direction);
            change_room(index); return true;
        }
        })) {
            output_text("You cannot go that direction.");
            return false;
        }
}

function change_room(index) {
    current_room = current_room.connected_rooms[index];
    output_text(" ");
    output_text(current_room.location);
    if (!current_room.entered) {
        output_text(current_room.description);
        current_room.entered = true;
    }
    for (let component of current_room.components) {
        output_text(component.description);
    }
    top_right_element.textContent = current_room.location;
}

function room_escapable() {
    for (let component of current_room.components) {
        if (component instanceof Enemy) {
            if (!component.escapable) {
                output_text("You cannot run away!");
                return false;
            }
        }
    }
    return true;
}

function update_enemies() {
    for (let enemy of current_room.components) {
        if (enemy instanceof Enemy) {
            enemy.turns_interacted++;
            // console.log("Attack Time:" + enemy.attack_time);
            // console.log("Turns Interacted: " + enemy.turns_interacted);
            if (enemy.attack_time - enemy.turns_interacted == 1) {
                output_text("The " + get_name(enemy) + " is preparing its attack.");
            }
            if (enemy.turns_interacted >= enemy.attack_time && enemy.attack_time != -1) {   //-1 represents an enemy that does not attack. Too lazy to do a different way for now.
                attack_player(enemy);
                enemy.turns_interacted = 0;
                
            }
        }
    }
    dodge_cooldown--;
    dodge = false;  //Disables dodge after attack process finishes to ensure dodge lasts for only one turn
}

//Don't forget to update_enemies after each successful command (if necessary).
function handle_action(words) {
    let verb = words[0];
    switch (verb) {
        case 'fight':
            parse_attack(words);
        break;
        case 'attack':
            parse_attack(words);
        break;
        case 'hit':
            parse_attack(words);
        break;
        case 'slash':
            parse_attack(words);
        break;
        case 'stab':
            parse_attack(words);
        break;
        case 'swing':
            parse_swing(words);
        break;
        case 'punch':
            parse_punch(words);
        break;
        case 'dodge':
            parse_dodge(words);
        break;
        case 'look':
            parse_look(words);
        break;
        case 'grab':
            return parse_grab(words);
        case 'pick':
            return parse_grab(words);
        case 'drop':
            return parse_drop(words);
        case 'wait':
            return parse_wait(words);
        case 'inventory':
            parse_inventory(words);
        break;
        case 'help':
            parse_help(words);
        break;
        case 'info':
            parse_info(words);
        break;
        case 'stop':
            parse_stop(words);
        break;
        case 'start':
            parse_start(words);
        break;
        case 'play':
            parse_start(words);
        break;
        case 'eat':
            return parse_consume(words);
        case 'consume':
            return parse_consume(words);
        case 'drink':
            return parse_consume(words);
        case 'block':
            parse_block(words);
        break;
    }
    return false;
}

function parse_grab(words) {
    if (words[0] == "pick" && words[1] == "up") {
        words.splice(1, 1);
        return parse_grab(words);
    } else if (words[0] == "pick" && words[2] == "up") {
        words.splice(2,2);
        return parse_grab(words);
    } else {
        let correct_component = find_component(current_room.components,words[1]);
        if (correct_component != null) {
            if (words.length > 2) {
                output_text("I only understood you as far as " + words[0] + " " + words[1]);
            } else {
                if (correct_component instanceof Item) {
                    output_text("You picked up the " + words[1] + ".");
                    inventory.push(return_item(current_room.components.splice(current_room.components.indexOf(correct_component),1)));
                    update_enemies();
                    return true;
                } else {
                    output_text("You cannot pick that up.");
                }
            }
        } else {
            if (words.length > 1) {
                output_text("I only understood you as far as " + words[0] + ".");
            } else {
                previous_verb = words[0];
                output_text("What do you want to pick up?");
            }
        }
    }
    return false;
}

function parse_drop(words) {
    let correct_component = search_inventory(words[1]);  // TODO: this does nothing rn, there is no search_inventory function
    if (correct_component != null) {
        if (words.length > 2) {
            output_text("I only understood you as far as drop " + correct_component.name.toLowerCase() + ".")
        } else {                 //Successful command
            output_text("You dropped the " + correct_component.name.toLowerCase() + ".");
            current_room.components.push(return_item(inventory.splice(inventory.indexOf(correct_component),1))); 
            update_enemies();
            return true;
        }
    } else {
        if (words.length == 2) {
            output_text("You do not possess " + words[1] + ".");
        } else if (words.length > 2) {
            output_text("I only understood you as far as drop.");
        } else {
            previous_verb = "drop";
            output_text("What do you want to drop?");
        }
    }
    return false;
}
 
function parse_look(words) {
    if (words.length > 1) {
        if (words[1] == "around") {
            words.splice(1,1);
            parse_look(words);
        } else {
            output_text("I only understood you as far as look.");
        }
    } else {
        output_text(current_room.location);
        output_text(current_room.description);
        for (let component of current_room.components) {
            output_text(component.description);
        }
    }
}

function parse_dodge(words) {
    if (words.length > 1) {
        output_text("I only understood you as far as dodge.");
    } else {
        if (dodge_cooldown > 0) {
            output_text("You cannot dodge right now.");
        } else {
            let dodge_check = Math.ceil(Math.random() * 10)
            let dodge_value = Math.ceil(Math.random() * 5 + luck);   //Luck affects how likely you are to dodge
            if (dodge_value > dodge_check) {
                dodge = true;
            } else {
                output_text("You failed to dodge!")
            }
            dodge_cooldown = 3;
            update_enemies();
        }
    }
}

function parse_wait(words) {
    if (words.length > 1) {
        output_text("I only understood you as far as wait.");
    } else {
        let result = Math.ceil(Math.random() * 100);
        if (result > 90)
            output_text("Time passes. You ponder your existence and the existence of the universe. You are not sure what to do with yourself.");
        else if (result > 50)
            output_text("You wait. Silently.");
        else
            output_text("Time passes.");
        update_enemies();
    }
}

function parse_inventory(words) {
    if (words.length > 1) {
        output_text("I only understood you as far as wait.");
    } else {
        if (inventory.length == 0) {
            output_text("Your inventory is currently empty.");
        } else {
            for (let i = 0; i < inventory.length; i++) {
                output_text(inventory[i].name);
            }
        }
    }
}

function parse_attack(words) {
    if (words.length > 1) {
        let target = null;
        let weapon = null;
        if (detect_component(current_room.components,words[1])) {
            target = find_component(current_room.components, words[1]);
            if (target instanceof Enemy) {
                if (words.length < 3) {
                    output_text("What do you want to attack the " + get_name(target) + " with?");
                    previous_verb = "attack";
                    previous_component1 = target.name;
                } else if (words.length == 3) {
                    if (words[2] == "with" || words[2] == "using") {
                        words.splice(2,1);
                        parse_attack(words);
                    } else {
                        if (detect_component(inventory, words[2])) {
                            weapon = find_component(inventory, words[2]);
                            if (weapon instanceof Weapon) {
                                attack_enemy(target, weapon);
                                update_enemies();  
                            } else {
                                output_text("You cannot attack with that!");
                            }
                        } else if (words[2] == "fist" || words[2] == "fists" || words[2] == "feet" || words[2] == "foot" || words[2] == "body" || words[2] == "self" || words[2] == "player") {
                            let dummy = new Weapon("Body",1);
                            attack_enemy(target,dummy);
                            update_enemies();
                            
                        } else {
                            output_text("You do not have that!");
                        }
                    }
                } else if (words.length > 3) {
                    if (words[2] == "with" || words[2] == "using") {
                        words.splice(2,1);
                        parse_attack(words);
                    } else {
                        output_text("What are you even saying?");
                    }
                }
            } else {
                output_text("You cannot attack that.");
            }
        } else {
            output_text("There is no " + words[1] + " here.");
        }
    } else {
        output_text("What do you want to attack?");
        previous_verb = "attack";
    }
    
}

function parse_swing(words) {
    if (words.length > 1) {
        let target = null;
        let weapon = null;
        if (detect_component(inventory, words[1]) || words[1] == "fist" || words[1] == "fists") {
            if (words[1] == "fist" || words[1] == "fists") {
                weapon = new Weapon("Body",1);
            } else {
                weapon = find_component(inventory, words[1]);
            }
            if (words.length < 3) {
                previous_verb = "swing";
                previous_component1 = weapon.name;
                output_text("What do you want to swing the " + get_name(weapon) + " at?");
            } else if (words.length == 3) {
                if (detect_component(current_room.components,words[2])) {
                    target = find_component(current_room.components, words[2]);
                    if (target instanceof Enemy || target instanceof CustomEnemy) {
                        attack_enemy(target, weapon);
                        update_enemies();
                    } else {
                        output_text("You cannot attack that.");
                    }
                } else {
                    output_text("There is no " + words[2] + " here.");
                } 
            } else if (words.length > 3) {
                if (words[2] == "at") {
                    words.splice(2,1);
                    parse_swing(words);
                } else {
                    output_text("What are you even saying?");
                }
            }
        } else{
            output_text("You do not have that!");
        }
    } else {
        output_text("What do you want to swing?");
        previous_verb = "swing";
    }
}

function parse_punch(words) {
    if (words.length == 1) {
        output_text("What do you want to punch?");
        previous_verb = "punch";
    } else if (words.length == 2) {
        words.push("fist");
        parse_attack(words);
    } else {
        output_text("What are you even saying?");
    }
}

function parse_help(words) {
    if (words.length > 1) {
        output_text("I only understood you as far as help.");
    } else {
        if (!(actions_performed.includes("grab") || actions_performed.includes("pick") )) {
            output_text("Try picking something up.")
        } else if (!(actions_performed.includes("attack") || actions_performed.includes("stab") || actions_performed.includes("hit") || actions_performed.includes("swing") || actions_performed.includes("slash") || actions_performed.includes("fight"))) {
            output_text("You should try attacking something.");
        } else if (!actions_performed.includes("dodge")) {
            output_text("Have you tried dodging? Man it is awesome. It does take some luck, but it is totally worth trying.");
        } else if (!(actions_performed.includes("north") || actions_performed.includes("northeast") || actions_performed.includes("east") || actions_performed.includes("southeast") || actions_performed.includes("south") || actions_performed.includes("southwest") || actions_performed.includes("west") || actions_performed.includes("northwest") || actions_performed.includes("west") || actions_performed.includes("go") || actions_performed.includes("walk") || actions_performed.includes("run") || actions_performed.includes("travel") || actions_performed.includes("head") || actions_performed.includes("move"))) {
            output_text("If you are still having trouble traversing, try using cardinal and ordinal directions.");
        } else {
            output_text("You should try exploring a bit more.");
        }
    }
}

function parse_info(words) {
    if (words.length > 1) {
        output_text("I only understood you as far as info.");
    } else {
        output_text("Mirenalt Nudgeon is a terminal dungeon where the player must learn by playing and win by learning. A wonderful and confusing land awaits you in the world of Merinalt.");
    }
}

function parse_consume(words) {
    if (words.length == 1) {
        output_text("What do you want to consume?");
        previous_verb = "consume";
    } else {
        let food = find_component(inventory, words[1]);
        if (food != null) {
            if (food instanceof Consumable) {
                if (food.type == "eat") {
                    if (words[0] == "drink") {
                        output_text("You cannot drink that.");
                    } else {
                        if (words.length > 2) {
                            output_text("I only understood you as far as " + words[0] + " " + words[1] + ".");
                        } else {
                            update_enemies();
                            return consume(food);
                        }
                    }
                } else {
                    if (words[0] == "eat") {
                        output_text("You cannot eat that.");
                    } else {
                        if (words.length > 2) {
                            output_text("I only understood you as far as " + words[0] + " " + words[1] + ".");
                        } else {
                            update_enemies();
                            return consume(food);
                        }
                    }
                }
            } else {
                output_text("You cannot consume that!");
            }
        } else {
            output_text("You do not have that!");
        }
    }
    return false;
}

function parse_block(words) {
    if (has_enemies()) {
        if (words.length == 1) {
            output_text("What do you want to block with?");
            previous_verb = "block";
        } else if (words.length == 2) {
            let item = find_component(inventory, words[1]);
            if (item != null) {
                if (item instanceof Weapon) {
                    block = item.block;
                    update_enemies();
                    return true;
                } else {
                    output_text("You cannot block with that.");
                }
            } else {
                output_text("You do not have that!");
            }
        } else {
            if (words[1] == "with") {
                words.splice(1,1);
                parse_block(words);
            } else {
                output_text("I only understood you as far as block.");
            }
        }
    } else {
        output_text("There are no enemies to block!");
    }
}

function get_name(component) {
    return (typeof component.names === 'string') ? component.name.toLowerCase() : component.names[0].toLowerCase();
}

function has_enemies() {
    return current_room.components.some((component) => component instanceof Enemy);
}

function consume(item) {
    health += item.health;
    inventory.splice(inventory.indexOf(item),1);
    output_text("You successfully consumed the " + item.name.toLowerCase() + ".");
    if (item.health > 0) {
        output_text("It had a positive effect on your health!");
    } else if (item.health < 0) {
        output_text("It had a negative effect on your health!");
    }
    return true;
}

function attack_enemy(enemy, weapon) {
    if (weapon.damage > enemy.defense) {
        enemy.health = enemy.health + (enemy.defense - weapon.damage);
        if (enemy.health < 0) {
            output_text("You killed the " + enemy.name.toLowerCase() + ".");
            current_room.components.pop(enemy);
        } else {
            output_text("The attack landed!");
        }
    } else {
        output_text("The attack was ineffective.");
    }
}

function attack_player(enemy) {
    if (!dodge) {
        output_text("The " + enemy.name.toLowerCase() + " attacked you!");
        if (block > 0) {
            if (enemy.strength > (block + defense)) {
                health -= enemy.strength;
                output_text("The block was ineffective.");
            } else {
                output_text("The block was successful.");
            }
            block = 0;
        } else {
            if (enemy.strength > defense) {
                health = health + (defense - enemy.strength);
            } else {
                output_text("It had no effect.");
            }
        }
        if (health <= 0) {
            output_text("You died. Game over.");
            var input = document.getElementById("terminal-input");
            if (input) {
                input.remove();
            } else {
                console.log("Element not found.");
            }
        }
    } else {
        output_text("You successfully dodged the attack!");
    }
}

function find_component(components, name) {
    for (let component of components) {
        if (typeof component.names === 'string') {
            if (component.names.toLowerCase() == name) {
                return component;
            }
        } else {
            for (let component_name of component.names) {
                if (component_name.toLowerCase() == name) {
                    return component;
                }
            }
        }
    }
    return null;
}

function detect_component(components, name) {
    for (let component of components) {
        if (typeof component.names === 'string') {
            if (component.names.toLowerCase() == name) return true;
        } else {
            for (let component_name of component.names) {
                if (component_name.toLowerCase() == name) {
                    return true;
                }
            }
        }
    }
    return false;
}

/**
* x -> First room |
* y -> Second room |
* xdir -> Direction to y relative to x |
* ydir -> Direction to x relative to y
*/
function connect_rooms(x, y, xdir, ydir) {
    x.connected_rooms.push(y);
    x.directions.push(xdir)
    y.connected_rooms.push(x);
    y.directions.push(ydir)
}

function remove_room(door_room) {
    const room1 = door_room.connected_rooms[0];
    const room2 = door_room.connected_rooms[1];
    if (room2 !== undefined) {
        room1.connected_rooms[room1.connected_rooms.indexOf(door_room)] = room2;
        room2.connected_rooms[room2.connected_rooms.indexOf(door_room)] = room1;
        change_room(1);
    } else {
        room1.connected_rooms.splice(room1.connected_rooms.indexOf(door_room),1);
        room1.directions.splice(room1.connected_rooms.indexOf(door_room),1);
        change_room(0);
    }
}

export function output_text(txt) {
    const p = document.createElement("p");
    p.innerHTML = txt;
    terminal_output.appendChild(p);
    window.scrollTo(0, document.body.scrollHeight);
    terminal_command.value = "";
}

function handle_music() {
    music_played = true;
    var song = new Audio(playlist[playlist_index]);
    song.volume = 0.1;
    audio = song;
    play_music(song);
    playlist_index++;
    if (playlist_index > playlist.length-1) playlist_index = 0;
}

function play_music(song) {
    if (music_played) {
        song.play();
        song.addEventListener('ended', handle_music);
        document.removeEventListener('click', handle_music);
    }
}

window.onload = (event) => {
    initialize_rooms();
    output_text(current_room.location);
    output_text(current_room.description);
    for (let component of current_room.components) {
        output_text(component.description);
    }
    current_room.entered = true;
    document.addEventListener('click', handle_music);
}

const terminal_output = document.getElementById("terminal-output");
const terminal_command = document.getElementById("terminal-command");
const top_right_element = document.getElementById("location");

top_right_element.textContent = "Brooke Road";

terminal_command.addEventListener("keydown", e => checkEnter(e));

function checkEnter(k) {
    if (k.keyCode==13) {
        const command = terminal_command.value;
        output_text(command);
        terminal_command.value = "";
        if (command.length > 164) {
            output_text("I am sorry, but that command is too long.")
        } else {
            parse(separate_command(command)); 
        }
    }
}