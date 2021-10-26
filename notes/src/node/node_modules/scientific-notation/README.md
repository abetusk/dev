# scientific-notation

Parsing notes written in
[Scientific pitch notation](http://en.wikipedia.org/wiki/Scientific_pitch_notation)
returning intervals in octaves and fifths relative to A4 (or `a'`)

```js
var scientific = require('scientific-notation');

scientific('A4') // -> [ 0, 0 ]
scientific('C0') //  -> [ -3, -3 ]
scientific('D#4') // -> [ -4, 6 ]
scientific('A5') // -> [ 1, 0 ]
```

## usage

```js
var scientific = require('scientific-notation');
```

### scientific(note)

Takes a `note` string in Scientific pitch notation and returns an array
describing the interval of that note relative to A4. The returned interval is
in the format `[octaves, fifths]` - that is, an array consisting of two
numbers, the first the number of octaves to jump, the second the number of
fifths to jump from A4 to land at the desired note.
