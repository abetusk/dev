Gibber Music Notes
===

###### 2020-11-27

I just discovered Gibber.
The documentation seems pretty spartan and maybe this is because of it being a new project.

Gibber looks like a very good candidate to hack in.
It's Javascript based, has a lot of nice sounding synths "out of the box" and focuses
on effects.

I have to play around with it but so far it looks like Gibber might be much more accessible
in terms of ease of use and musical polish.

These are notes on my discovery of how to use the system.
As with many of these libraries, often times "the code is the documentation" so
I shouldn't be shy about diving into the code to figure out how things work.

I'll be focusing on the '[alpha](https://gibber.cc/alpha/playground/)' release as this seems to have some features and maybe
is a bit more accessible then the older version.

---

| | |
|---|---|
| Run code | `Alt` + `Enter` |
| Stop code | `Ctrl` + `.` |

Note that the `Alt` + `Enter` will run a block of code only, where each block
is marked by an empty line.

For example:

```
bass = Synth('bleep', {"decay":1})
  .note.seq( [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15], 1 )

hat = Hat({ decay:.0125 })
  .trigger.seq( [1,.5], 1)
```

Will only either play the synth part or the drum part depending on where the cursor is, whereas

```
bass = Synth('bleep', {"decay":1})
  .note.seq( [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15], 1 )
 // a space here!
hat = Hat({ decay:.0125 })
  .trigger.seq( [1,.5], 1)
```

will play the both.

`Gibber.clear` is the programmatic way of stopping sound.

---

By default, Gibber runs note sequences in a musical mode (e.g. 'aeolian') which
means note numbers reference the position in the musical mode.

Gibber controls this via the `Theory` object.
To get control, set the musical mode to `chromatic` like so:

```
Theory.mode = "chromatic"
bass = Synth('bleep', {"decay":1})
  .note.seq( [0,1,2,3,4,5,6,7,8,9,10,11],1)
```

See [theory.js](https://github.com/charlieroberts/gibber.audio.lib/blob/8820baa90f5a789eebe9b56c43adfa6f853996dd/js/theory.js) for details.

Note, as a sanity check, you can use the web application [pitchdetect](https://webaudiodemos.appspot.com/pitchdetect/) ([src](https://github.com/cwilso/pitchdetect)) to detect frequencies of notes being produced.

---

Gibber comes with presets of instruments but I can't find documentation for them anywhere.
See the [presets directory](https://github.com/charlieroberts/gibber.audio.lib/tree/main/js/presets),
in particular, the [synth presets](https://github.com/charlieroberts/gibber.audio.lib/blob/main/js/presets/synth_presets.js).

Here are some table for ease of perusal:

---

| Synth Presets | Synth Presets |
|---|---|
| acidBass | acidBass2 | bleep.dry |
| bleep | bleep.echo | shimmer |
| stringPad | cry | brass |
| brass.short | pwm.squeak | pwm.short |
| chirp | square.perc | square.perc.long |
| rhodes | | |


([synth_presets.js](https://github.com/charlieroberts/gibber.audio.lib/blob/main/js/presets/synth_presets.js))

---

| FM Presets | FM Presets | FM Presets |
|---|---|---|
| bass  | kick | bass.electro |
| glockenspiel | glockenspiel.short | frog  |
| gong  | drum  | |

([fm_presets.js](https://github.com/charlieroberts/gibber.audio.lib/blob/main/js/presets/fm_presets.js))

---


| MonoSynth Presets | MonoSynth Presets | MonoSynth Presets |
|---|---|---|
|  short.dry | arpy | lead |
|  lead2 | dirty | winsome |
|  pluckEcho | bassPad | warble |
|  dark | bass | bass2 |
|  edgy | easy | easyfx |
|  chords | chords.short | jump |
|  shinybass2 | shinybass | bass.muted |
|  short | noise |  |

([monosynth_presets.js](https://github.com/charlieroberts/gibber.audio.lib/blob/main/js/presets/monosynth_presets.js))

---

old version presets:

| FM |
|---|
| bass |
| brass |
| clarinet |
| drum |
| drum2 |
| frog |
| glockenspiel |
| gong |
| noise |
| radio |
| stabs |

| Mono |
|---|
| bass |
| bass2 |
| dark |
| dark2 |
| easy |
| easyfx |
| edgy |
| lead |
| noise |
| short |
| winsome |

| Synth |
|---|
| bleep |
| bleepEcho |
| calvin |
| cascade |
| rhodes |
| short |
| warble |

| Synth2 |
|---|
| pad2 |
| pad4 |

Buses connect multiple inputs or outputs to single effect.
For example, it might be a desired effect to twiddle a single parameter that then has an effect on multiple
instruments.
To "bus" these signals together, a `Bus` (or `Bus2` for stereo?) can be used.

In other words, Buses allow for fan-in/fan-out operations.

---




References
---

* [Gibber alpha playground](https://gibber.cc/alpha/playground/)
* [Gibber documentation](https://gibber.cc/alpha/playground/docs/index.html#prototypes-ugen)
* [Tutorial Vid](https://www.youtube.com/watch?v=hqWIdaAjdmI)
* [github.com/charlieroberts/gibber.audio.lib](https://github.com/charlieroberts/gibber.audio.lib)
* [TidalCycles](https://tidalcycles.org/index.php/Userbase)
* [Gibber User Manual](https://bigbadotis.gitbooks.io/gibber-user-manual/content/index.html)
