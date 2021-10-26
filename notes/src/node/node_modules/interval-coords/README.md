# `interval-coords`

This module makes it possible to convert music intervals in so-called "simple format",
into a coordinate in the format `[octaves, fifth]`, which represents how many
octaves and fifths you need to "jump" before arriving at the interval.

For example `P1` means "perfect unison", and so the coordinate would be `[0, 0]`
because there's no movement.

Another example, `M3` means "major third" and the coordinate is `[-2, 4]`.
This means that in order to travel a "major third" up, you first go 2
octaves down, and then 4 fifths up

This way of representing intervals and notes is a powerful one, and it lets us
take advantage of numeric computations instead of string-parsing and long
if/else statements

## usage

```js
var icoords = require('interval-coords');

icoords('P1')   // perfect unison -> [0, 0]
icoords('M3')   // major third -> [-2, 4]
icoords('P8')   // perfect octave -> [1, 0]
icoords('m13')  // minor 13th -> [4, -4]

// You can also use "negative" intervals (going down)
icoords('m-2')  // downwards minor second -> [-3, 5]
```

### `icoords(simpleInterval) -> [octaves, fifths]`

Given a `string` with a "simple format" interval, it returns the corresponding
coordinate vector of that interval.

### "simple format" interval

A simple interval is a string in the following format:

`dd, d, m, P, M, A, AA` followed by an optional `-` sign (for negative intervals), followed by the
`number` of the interval.

Not all combinations are valid, e.g. P3 (a "perfect third") doesn't make sense,
but P4 ("perfect fourth") does.
