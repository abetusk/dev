# midi-json-parser

**This module is parsing midi files into a human-readable JSON object.**

[![tests](https://img.shields.io/travis/chrisguttandin/midi-json-parser/master.svg?style=flat-square)](https://travis-ci.org/chrisguttandin/midi-json-parser)
[![dependencies](https://img.shields.io/david/chrisguttandin/midi-json-parser.svg?style=flat-square)](https://www.npmjs.com/package/midi-json-parser)
[![version](https://img.shields.io/npm/v/midi-json-parser.svg?style=flat-square)](https://www.npmjs.com/package/midi-json-parser)

This module parses a binary MIDI file and turns it into a JSON representation. This JSON
representation can then be used to pass it on to the
[midi-player](https://github.com/chrisguttandin/midi-player). It can of course also be modified
to be encoded as binary MIDI file at some point again by using the
[json-midi-encoder](https://github.com/chrisguttandin/json-midi-encoder).

## Usage

This module is available on [npm](https://www.npmjs.com/package/midi-json-parser) and can be
installed by running the following command:

```shell
npm install midi-json-parser
```

Once the module is installed you can use its one and only function as shown in the example below:

```js
import { parseArrayBuffer } from 'midi-json-parser';

// Let's assume there is an ArrayBuffer called arrayBuffer which contains the binary content of a
// MIDI file.

parseArrayBuffer(arrayBuffer)
    .then((json) => {
        // json is the JSON representation of the MIDI file.
    });
```

In case you are comfortable with TypeScript, this is the interface which describes the JSON
representation:

```typescript
interface IMidiFile {

    division: number;

    format: number;

    tracks: TMidiEvent[][];

}
```

The type
[`TMidiEvent`](https://github.com/chrisguttandin/midi-json-parser-worker/blob/master/src/types/midi-event.ts)
is a union of all possible MIDI events. Here is the complete list of all MIDI events this module can handle:

- [`IMidiChannelPrefixEvent`](https://github.com/chrisguttandin/midi-json-parser-worker/blob/master/src/interfaces/midi-channel-prefix-event.ts)
- [`IMidiChannelPressureEvent`](https://github.com/chrisguttandin/midi-json-parser-worker/blob/master/src/interfaces/midi-channel-pressure-event.ts)
- [`IMidiControlChangeEvent`](https://github.com/chrisguttandin/midi-json-parser-worker/blob/master/src/interfaces/midi-control-change-event.ts)
- [`IMidiCopyrightNoticeEvent`](https://github.com/chrisguttandin/midi-json-parser-worker/blob/master/src/interfaces/midi-copyright-notice-event.ts)
- [`IMidiDeviceNameEvent`](https://github.com/chrisguttandin/midi-json-parser-worker/blob/master/src/interfaces/midi-device-name-event.ts)
- [`IMidiEndOfTrackEvent`](https://github.com/chrisguttandin/midi-json-parser-worker/blob/master/src/interfaces/midi-end-of-track-event.ts)
- [`IMidiInstrumentNameEvent`](https://github.com/chrisguttandin/midi-json-parser-worker/blob/master/src/interfaces/midi-instrument-name-event.ts)
- [`IMidiKeyPressureEvent`](https://github.com/chrisguttandin/midi-json-parser-worker/blob/master/src/interfaces/midi-key-pressure-event.ts)
- [`IMidiKeySignatureEvent`](https://github.com/chrisguttandin/midi-json-parser-worker/blob/master/src/interfaces/midi-key-signature-event.ts)
- [`IMidiLyricEvent`](https://github.com/chrisguttandin/midi-json-parser-worker/blob/master/src/interfaces/midi-lyric-event.ts)
- [`IMidiMarkerEvent`](https://github.com/chrisguttandin/midi-json-parser-worker/blob/master/src/interfaces/midi-marker-event.ts)
- [`IMidiMidiPortEvent`](https://github.com/chrisguttandin/midi-json-parser-worker/blob/master/src/interfaces/midi-midi-port-event.ts)
- [`IMidiNoteOffEvent`](https://github.com/chrisguttandin/midi-json-parser-worker/blob/master/src/interfaces/midi-note-off-event.ts)
- [`IMidiNoteOnEvent`](https://github.com/chrisguttandin/midi-json-parser-worker/blob/master/src/interfaces/midi-note-on-event.ts)
- [`IMidiPitchBendEvent`](https://github.com/chrisguttandin/midi-json-parser-worker/blob/master/src/interfaces/midi-pitch-bend-event.ts)
- [`IMidiProgramChangeEvent`](https://github.com/chrisguttandin/midi-json-parser-worker/blob/master/src/interfaces/midi-program-change-event.ts)
- [`IMidiProgramNameEvent`](https://github.com/chrisguttandin/midi-json-parser-worker/blob/master/src/interfaces/midi-program-name-event.ts)
- [`IMidiSequencerSpecificEvent`](https://github.com/chrisguttandin/midi-json-parser-worker/blob/master/src/interfaces/midi-sequencer-specific-event.ts)
- [`IMidiSetTempoEvent`](https://github.com/chrisguttandin/midi-json-parser-worker/blob/master/src/interfaces/midi-set-tempo-event.ts)
- [`IMidiSmpteOffsetEvent`](https://github.com/chrisguttandin/midi-json-parser-worker/blob/master/src/interfaces/midi-smpte-offset-event.ts)
- [`IMidiSysexEvent`](https://github.com/chrisguttandin/midi-json-parser-worker/blob/master/src/interfaces/midi-sysex-event.ts)
- [`IMidiTextEvent`](https://github.com/chrisguttandin/midi-json-parser-worker/blob/master/src/interfaces/midi-text-event.ts)
- [`IMidiTimeSignatureEvent`](https://github.com/chrisguttandin/midi-json-parser-worker/blob/master/src/interfaces/midi-time-signature-event.ts)
- [`IMidiTrackNameEvent`](https://github.com/chrisguttandin/midi-json-parser-worker/blob/master/src/interfaces/midi-track-name-event.ts)
- [`IMidiUnknownTextEvent`](https://github.com/chrisguttandin/midi-json-parser-worker/blob/master/src/interfaces/midi-unknown-text-event.ts)

## Acknowledgement

Developing this module wouldn't have been possible without all the great resources out there. The
following list tries to mention a few of them:

- A detailed specification of the MIDI file format as HTML: [Standard MIDI-File Format Spec. 1.1, updated](http://www.music.mcgill.ca/~ich/classes/mumt306/StandardMIDIfileformat.html) and PDF: [Standard MIDI-File Format Spec. 1.1, updated](http://www.cs.cmu.edu/~music/cmsip/readings/Standard-MIDI-file-format-updated.pdf)

- A brief description of the MIDI file format: [Outline of the Standard MIDI File Structure](http://www.ccarh.org/courses/253/handout/smf/)

- A blog post about the timing information in MIDI files: [Timing in MIDI files](http://sites.uci.edu/camp2014/2014/05/19/timing-in-midi-files/)

- An explanation of the concept called running status: [Running Status](http://www.blitter.com/~russtopia/MIDI/~jglatt/tech/midispec/run.htm)

- Actually a documentation for a Python library, but it also contains extensive information on MIDI messages itself: [Mido - MIDI Objects for Python](http://mido.readthedocs.org/en/latest/index.html)

- Very detailed information on meta messages, but also on many other non MIDI related audio topics as well: [RecordingBlogs.com Wiki](http://www.recordingblogs.com/sa/tabid/88/Default.aspx?topic=MIDI+meta+messages)

- A JavaScript MIDI parser and synthesiser: [jasmid - A Javascript MIDI file reader and synthesiser](https://github.com/gasman/jasmid) and its excluded parser: [midi-file-parser](https://github.com/NHQ/midi-file-parser)

- A complete MIDI app which also contains a parser: [MIDI.js](https://github.com/mudcube/MIDI.js)

- A very similar parser but for Node.js only [MIDI Converter](https://github.com/mobyvb/midi-converter)

- A parser for converting MIDI into a JavaScript object which can also turn it back into a binary MIDI file again: [MIDIFile](https://github.com/nfroidure/MIDIFile)
