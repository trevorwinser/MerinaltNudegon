import { output_text, audio } from '../app.js';
export function parse_start(words) { 
    if (words.length == 1) {
        previous_verb = "play";
        output_text("What would you like to play?");
    } else if (words.length == 2) {
        if (words[1] == "sound" || words[1] == "music") {
            if (audio != null) {
                output_text("Music has started.");
                audio.play();
            }
        } else if (words[1] == "mirenalt") {
            output_text("You are already playing that game!");
        } else {
            output_text("I only understood you as far as " + words[0] + ".");
        }
    } else if (words.length == 3) {
        if (words[1] == "mirenalt" && words[2] == "nudgeon") {
            output_text("You are already playing that game!");
        } else {
            if (words[1] == "mirenalt") {
                output_text("I only understood you as far as play mirenalt.");
            } else {
                output_text("I only understood you as far as play.");
            }
        }
    } else {
        output_text("I only understood you as far as play.");
    }
}