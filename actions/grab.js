import { setPreviousVerb, output_text, find_component, current_room, inventory, return_item, update_enemies } from '../app.js';
import { Item } from '../classes.js';

export function parse_grab(words) {
    words = words.filter((word, i) => !(word === "up" && words[i - 1] === "pick"));

    if (words.length < 2) {
        setPreviousVerb(words[0]);
        output_text("What do you want to pick up?");
        return false;
    }

    const itemName = words[1];
    const item = find_component(current_room.components, itemName);

    if (!item) {
        output_text(`I don't see a ${itemName} here.`);
        return false;
    }

    if (!(item instanceof Item)) {
        output_text("You cannot pick that up.");
        return false;
    }

    output_text(`You picked up the ${itemName}.`);
    inventory.push(return_item(current_room.components.splice(current_room.components.indexOf(item), 1)[0]));
    update_enemies();
    return true;
}
