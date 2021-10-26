# helmholtz

Parsing notes written in
[Helmholtz pitch notation](http://en.wikipedia.org/wiki/Helmholtz_pitch_notation)
returning intervals in octaves and fifths relative to A4 (or `a'`)

```js
var helmholtz = require('helmholtz');

helmholtz('a\'') // -> [ 0, 0 ]
helmholtz(',,C') //  -> [ -3, -3 ]
helmholtz('d#\'') // -> [ -4, 6 ]
helmholtz('a\'\'') // -> [ 1, 0 ]
```

## usage

```js
var helmholtz = require('helmholtz');
```

### helmholtz(note)

Takes a `note` string in the Helmholtz notation and returns an array
describing the interval of that note relative to A4. The returned interval is
in the format `[octaves, fifths]` - that is, an array consisting of two
numbers, the first the number of octaves to jump, the second the number of
fifths to jump from A4 to land at the desired note.
