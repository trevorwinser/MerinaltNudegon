import { detect_component, find_component, output_text, update_enemies, current_room, inventory } from '../app.js';
import { Enemy, Weapon } from '../classes.js';

function detect_weapon(word) {
    if (["fist", "fists", "feet", "foot", "body", "self", "player"].includes(word)) {
        return new Weapon("Body", 1);
    }
    return detect_component(inventory, word) ? find_component(inventory, word) : null;
}

function detect_target(words) {
    for (let word of words) {
        if (detect_component(current_room.components, word)) {
            let target = find_component(current_room.components, word);
            if (target instanceof Enemy) {
                return target;
            }
        }
    }
    return null;
}

function process_attack(target, weapon) {
    if (!weapon) {
        output_text("You do not have that!");
        return;
    }
    attack_enemy(target, weapon);
    update_enemies();
}

function parse_combat(words) {
    if (words.length < 2) {
        output_text("What do you want to do?");
        return;
    }
    
    let verb = words[0];
    let target = detect_target(words.slice(1));
    let weapon = null;

    if (!target) {
        output_text("There is nothing to attack here.");
        return;
    }

    switch (verb) {
        case "punch":
            weapon = detect_weapon("fist");
            break;
        case "swing":
            for (let word of words.slice(1)) {
                weapon = detect_weapon(word);
                if (weapon) break;
            }
            if (!weapon) {
                output_text("You must swing a weapon!");
                return;
            }
            break;
        case "attack":
        default:
            for (let word of words.slice(1)) {
                if (word !== target.name.toLowerCase()) {
                    weapon = detect_weapon(word);
                    if (weapon) break;
                }
            }
            if (!weapon) weapon = detect_weapon("fist");
            break;
    }
    
    process_attack(target, weapon);
}

export function parse_attack(words) {
    parse_combat(["attack", ...words]);
}

export function parse_swing(words) {
    parse_combat(["swing", ...words]);
}

export function parse_punch(words) {
    parse_combat(["punch", ...words]);
}

function attack_enemy(enemy, weapon) {
    if (weapon.damage > enemy.defense) {
        enemy.health -= (weapon.damage - enemy.defense);
        if (enemy.health <= 0) {
            output_text(`You killed the ${enemy.name.toLowerCase()}.`);
            current_room.components = current_room.components.filter(c => c !== enemy);
        } else {
            output_text("The attack landed!");
        }
    } else {
        output_text("The attack was ineffective.");
    }
}
