// lydian and aeolian
//

var t = require("teoria");

function irand(irange) {
  _r = ((typeof irange === "undefined") ? 2 : irange);
  return Math.floor(_r * Math.random());
}


var root_choice = ['c4', 'c#4', 'd4', 'd#4', 'e4', 'f4', 'f#4', 'g4', 'g#4', 'a4', 'a#4', 'b4' ]
root_idx = irand(root_choice.length);
root_note = t.note(root_choice[root_idx]);

var lyd = root_note.scale('lydian').simple();
var aeo = root_note.scale('aeolian').simple();

var lyd_chord_

var lyd_chord = [ "I", "II", "iii", "iv_d", "V", "vi", "vii" ];
var aeo_chord = [ "i", "ii_d", "III", "iv", "v", "VI", "VII" ];

var chord_progression_choice = [
  [["I"], lyd_chord, lyd_chord, ["II", "V"]],
  [["i"], aeo_chord, aeo_chord, ["III", "VI", "VII"]]
];

var chord_progression = [];
for (var idx=0; idx<chord_progression_choice[0].length; idx++) {
  chord_progression.push( chord_progression_choice[0][idx][ irand(chord_progression_choice[0][idx].length) ] );
}

console.log("# chord prog:", chord_progression);

console.log("# root:", root_choice[root_idx]);
console.log("# lyd:", lyd)
console.log("# aeo:", aeo);

