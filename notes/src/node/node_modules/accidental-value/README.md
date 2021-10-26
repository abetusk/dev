# accidental-value

A simple module for parsing chord symbols, both Jazz and Classical.
Parses correctly everything from simple power chords (`D#5`) to chords you'll
often find in the real book (`G7#5`, `Dm7b5`) to crazy chords like
`Fsus4maj#11` or `Cm13b5#9`.

Note that this module only parses the chord symbol (that is the part of the
chord string that does *not* include the root, and thus returns relative
intervals from which the chord can be constructed with any root.

## usage

```js
var accval = require('accidental-value');
```

### accval(accidental)

Returns the *value* of the accidental from the table below.
This is useful for manipulating notes and intervals.

 - 'x' = 2
 - '#' = 1
 - '' = 0
 - 'b' = -1
 - 'bb' = -2

### accval.interval(accidental)

Returns the relative interval (given in `[octaves, fifths]` format)
of the accidental. E.g.:
```js
accval.interval('#') // [-4, 7]
accval.interval('bb') // [8, -14]
```
