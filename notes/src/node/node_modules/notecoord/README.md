# notecoord

A data package containing the relative intervals bewteen notes in the Western muscic system.
The coordinates are in the format of an array. `[octaves, fifths]` relative to C.

Thus `c`'s coord is `[0, 0]`, while `d`'s is `[-1, 2]` because going to the
note `d` in the same octave as `c` requires going one octave *down* and two
fifths *up*.

```js
var coords = require('notecoord');

// Get the coord of a note name (relative to C)
coords('a') // -> [-1, 3]

// Get the coord of note A4 (relative to C0)
coords.A4 // -> [3, 3]

// Access all the notes
coords.notes /* -> {
  c: [0, 0],
  d: [-1, 2],
  e: [-2, 4],
  f: [1, -1],
  g: [0, 1],
  a: [-1, 3],
  b: [-2, 5],
  h: [-2, 5]
} */
```

Above is **everything** this module does.
