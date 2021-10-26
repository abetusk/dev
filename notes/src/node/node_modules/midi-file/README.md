# midi-file
```
npm install midi-file
```

The parser is loosely based on [midi-file-parser](https://github.com/NHQ/midi-file-parser) and [jasmid](https://github.com/gasman/jasmid), but totally rewritten to use arrays instead of strings for portability.

### Usage

```js
var fs = require('fs')
var parseMidi = require('midi-file').parseMidi
var writeMidi = require('midi-file').writeMidi

// Read MIDI file into a buffer
var input = fs.readFileSync('star_wars.mid')

// Parse it into an intermediate representation
// This will take any array-like object.  It just needs to support .length, .slice, and the [] indexed element getter.
// Buffers do that, so do native JS arrays, typed arrays, etc.
var parsed = parseMidi(input)

// Turn the intermediate representation back into raw bytes
var output = writeMidi(parsed)

// Note that the output is simply an array of byte values.  writeFileSync wants a buffer, so this will convert accordingly.
// Using native Javascript arrays makes the code portable to the browser or non-node environments
var outputBuffer = new Buffer(output)

// Write to a new MIDI file.  it should match the original
fs.writeFileSync('copy_star_wars.mid', outputBuffer)
```

The intermediate representation has a 'header' and 'tracks', and each track is an array of events.

### Explicit Formatting

Options are provided to `writeMidi` to control various ambiguities in the MIDI file format.

The following will use byte 0x09 for noteOff messages with velocity zero. (Typically such messages use 0x08).
It will also use running status bytes to compress consecutive events when possible.

```js
var output = writeMidi(parsed, { useByte9ForNoteOff: true, running: true })
```

When parsing the file with `readMidi`, each compressed event using running status bytes will have a `running` flag set on it.
Similarly, each `noteOff` event that was encoded using 0x09 will have a `byte9` property set on it.

By default, `writeMidi` will defer to each event to indicate the behavior it should use for encoding such ambiguities, which will produce an exact copy of the original file read with `parseMidi`.  However, these options to `writeMidi` allow the behavior to be overridden at the top-level, which may be relevant if you are generating the MIDI events, rather than just reading them from a file.
