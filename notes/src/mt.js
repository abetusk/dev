var key = {
  "major" : [0,2,4,5,7,9,11],
  "minor" : [0,2,3,5,7,8,10]
}

function list_chords(note_key) {
  var k = 0;
  var chord = { "major" : [0,4,7], "minor" : [0,3,7], "diminished" : [0,3,6] };
  var note_map = ["c", "c#", "d", "d#", "e", "f", "f#", "g", "g#", "a", "a#", "b" ];

  var key_map = {};

  for (k=0; k<note_key.length; k++) { key_map[note_key[k]] = 1; }

  for (var note_root = 0; note_root<12; note_root++) {
    for (var chord_name in chord) {
      for (k=0; k<chord[chord_name].length; k++) {
        var x = (note_root + chord[chord_name][k]) % 12;
        if (key_map[x] != 1) { break; }
      }
      if (k==chord[chord_name].length) {
        console.log( note_map[note_root], chord_name );
      }
    }

  }

}

function chord2a(chord_name) {
  var note_name = ["c", "c#", "d", "d#", "e", "f", "f#", "g", "g#", "a", "a#", "b" ];
  var note_name1 = ["c", "db", "d", "eb", "e", "f", "gb", "g", "ab", "a", "bb", "b" ];
  var note_map = {};
  var root_note = "", chord_type = "major";

  for (k=0; k<note_name.length; k++) {
    note_map[note_name[k]] = k;
    note_map[note_name1[k]] = k;
  }

  if (chord_name.length==0) { return; }
  if      (chord_name.length == 1) { root_note = chord_name; }
  else if (chord_name.length == 2) { root_note = chord_name.slice(0,2); }
  else if (chord_name.length == 3) {
    root_note = chord_name.slice(0,2);
    if (chord_name[2] == "m") { chord_type = "minor"; }
    else if (chord_name[2] == "d") { chord_type = "diminished"; }
  }
  else { return; }

  root_num = note_map[root_note];
  if (chord_type == "major")  {
    return [root_num, root_num + 4, root_num + 7];
  }
  else if (chord_type == "minor") {
    return [root_num, root_num + 3, root_num + 7];
  }
  else if (chord_type == "diminished") {
    return [root_num, root_num + 3, root_num + 6];
  }

  return;
}

prob_ch = [ "ebm", "db", "gb", "b", "eb", "ab", "bb", "abm" ];

for (x in prob_ch) {

  console.log("#", prob_ch[x]);
  console.log(chord2a(prob_ch[x]));
}



/*
console.log("\nmajor key:");
list_chords(key.major);

console.log("\n---");
console.log("minorkey:");
list_chords(key.minor);
*/


