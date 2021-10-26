# note-parser [![npm](https://img.shields.io/npm/v/note-parser.svg)](https://www.npmjs.com/package/note-parser)

[![Build Status](https://travis-ci.org/danigb/note-parser.svg?branch=master)](https://travis-ci.org/danigb/note-parser) [![Code Climate](https://codeclimate.com/github/danigb/note-parser/badges/gpa.svg)](https://codeclimate.com/github/danigb/note-parser)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

Parse note names (in [scientific notation](https://en.wikipedia.org/wiki/Scientific_pitch_notation)) with javascript. Given a string, obtain a hash
with note properties (including midi number and frequency)

If you need parse interval names take a look to [interval-notation](https://github.com/danigb/interval-notation)

## Usage

Install via npm: `npm i --save note-parser` and require it:

```js
var parser = require('note-parser')
parser.parse('c#4') // => { letter: 'C', acc: '#', ... midi: 61, freq: 277.1826309768721 }
```

The returned object will contain:

- `letter`: the uppercase letter of the note
- `acc`: the accidentals of the note (only sharps or flats)
- `pc`: the pitch class (letter + acc)
- `step`: s a numeric representation of the letter. It's an integer from 0 to 6 where 0 = C, 1 = D ... 6 = B
- `alt`: a numeric representation of the accidentals. 0 means no alteration,
positive numbers are for sharps and negative for flats
- `chroma`: a numeric representation of the pitch class. It's like midi for
pitch classes. 0 = C, 1 = C#, 2 = D ... It can have negative values: -1 = Cb.

If the note name has octave, the returned object will additionally have:

- `oct`: the octave number (as integer)
- `midi`: the midi number
- `freq`: the frequency (using tuning parameter as base)

If the parameter `isTonic` is set to true another property is included:

- `tonicOf`: the rest of the string that follows note name (left and right trimmed)  

#### Midi note number and frequency

If you are interested only in midi numbers or frequencies, you can use `midi` function:

```js
parser.midi('A4') // => 69
parser.midi('blah') // => null
parser.midi(60) // => 60
parser.midi('60') // => 60
```

or the `freq` function:

```js
parser.freq('A4') // => 440
parser.freq('A3', 444) // => 222
parser.freq(69) // => 440
```

### Build the string back

With the `build` function you can convert back to string:

```js
parser.build(parser.parse('cb2')) // => 'Cb2'
```

Alternatively the `build` function accepts `step, alteration, octave` parameters:

```js
parser.build(3, -2, 4) // => 'Fbb4'
```

## Tests and documentation

You can read the [generated API documentation here](https://github.com/danigb/note-parser/blob/master/API.md)

To run the test clone this repo and:

```
npm install
npm test
```

## License

MIT License
