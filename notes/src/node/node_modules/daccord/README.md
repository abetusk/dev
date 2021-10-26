# d'accord

> D'accord, je vais analyser vos accords

A simple module for parsing chord symbols, both Jazz and Classical.
Parses correctly everything from simple power chords (`D#5`) to chords you'll
often find in the real book (`G7#5`, `Dm7b5`) to crazy chords like
`Fsus4maj#11` or `Cm13b5#9`.

Note that this module only parses the chord symbol (that is the part of the
chord string that does *not* include the root, and thus returns relative
intervals from which the chord can be constructed with any root.

## example

```js
var daccord = require('daccord');

daccord('m7b5') // -> ['P1', 'm3', 'd5', 'm7']

daccord('maj7') // -> ['P1', 'M3', 'P5', 'M7']
```

You can use d'accord in combination with
[teoria](https://github.com/saebekassebil/teoria).
Although at the moment teoria includes this functionality itself this will
hopefully get lifted out of teoria into more focused, smaller modules. But for
now, here's a practical example

```js
var daccord = require('daccord');
var teoria = require('teoria');

// Create the root note
var root = teoria.note('C4');

// Get all the intervals (including the tonic) of a m(maj7) chord, and map them
// into notes relative to the root, C4
daccord('m(maj7)').map(root.interval.bind(root)).toString() === 'c4,eb4,g4,b4';
```

## usage

```js
var daccord = require('daccord');
```

### daccord(chordstring)

Return an array of intervals (including the tonic, that is `P1`), which
constitutes the full chord, with all implied intervals. If a `chordstring` is
unparsable, an error will be *thrown* with details.
