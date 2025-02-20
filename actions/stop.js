import { output_text, audio } from '../app.js';
export function parse_stop(words) {
    if (words.length == 1) {
        previous_verb = "stop";
        output_text("What would you like to stop?");
    } else if (words.length == 2) {
        if (words[1] == 'sound' || words[1] == 'music') {
            if (audio != null) {
                output_text("Music has stopped.");
                audio.pause();
            }
        } else if (words[1] == 'time') {
            output_text("Time has successfully stopped until your next action.");
        } else if (words[1] == 'attack') {
            parse_block("block");
        } else {
            output_text("I only understood you as far as stop.");
        } 
    } else {
        if (words[1] == 'sound' || words[1] == 'music') {
            output_text("I only understood you as far as stop " +words[1]+ ".");
        } else if (words[1] == 'time') {
            output_text("I only understood you as far as stop time.");
        } else {
            output_text("I only understood you as far as stop.");
        }
    }
}