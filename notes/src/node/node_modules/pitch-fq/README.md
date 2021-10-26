# `pitch-fq`

Calculate the frequency of a note, in the pitch "coord" format. (E.g `[x, y]`)

## usage

```js
var fq = require('pitch-fq');
var parse = require('scientific-notation');

fq(parse('A4'))     // -> 440
fq(parse('A4'), 442) // -> 442

var concertPitch = fq(440);
concertPitch(parse('A5')) // -> 880
```

### `fq(coord, concertPitch = 440) -> frequency`

Calculate the frequency of a [notecoord](https://github.com/saebekassebil/notecoord)
(relative to A4), in the given "concert pitch", assuming an equal temperament.

Normally you'd tune A4 to 440Hz, but in some settings you might want to tune
it to 442Hz or something else.

### `fq(concertPitch) -> fn(coord)`

Given only a concertPitch `Number`, it returns a function, calculating the
frequency of a note, given *that* concert pitch.
