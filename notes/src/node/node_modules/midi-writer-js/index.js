const MidiWriter = require('.');
const track = new MidiWriter.Track();

track.addTrackName('Colours ');
track.setTimeSignature(1, 1);

track.addEvent(
    new MidiWriter.NoteEvent({
        velocity: 100,
        duration: 'T400', // 'T15', // 'T1584'
        pitch: ['F4', 'A4'],
        startTick: 0,
    })
);
/*
track.addEvent(
    new MidiWriter.NoteEvent({
        velocity: 100,
        duration: '4', // 'T15', // 'T1584'
        pitch: ['F4', 'A4'],
        startTick: 400
    })
);
*/

console.log(track.buildData());

new MidiWriter.Writer(track)
    .saveMIDI('temp');