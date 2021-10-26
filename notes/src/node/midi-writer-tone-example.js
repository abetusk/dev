


var Midi = require('@tonejs/midi')

// create a new midi file
//var midi = new Midi();
var midi = Midi;

// add a track
const track = midi.addTrack()
track.addNote({
  midi : 60,
  time : 0,
  duration: 0.2
})
.addNote({
  name : 'C5',
  time : 0.3,
  duration: 0.1
})
.addCC({
  number : 64,
  value : 127,
  time : 0.2
})
 
// write the output
fs.writeFileSync("output.mid", new Buffer(midi.toArray()))
