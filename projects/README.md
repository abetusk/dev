Projects
===

###### 2021-01-25

Generative Music
---

### Status

Have a rudimentary song generator at [familiar-synths.js](https://github.com/abetusk/dev/blob/release/notes/src/familiar-synths.js).

The song still isn't quite to my liking as all tunes it generates still sound "same-y".

Gibber (alpha playground) is still having problems with some of the presets, so the preset/instrument library
that can be drawn on is pretty limited.

### todo

* figure out how to make some reasonable generative synths instead of relying on presets
* remove drums at end so they stop
* find instrument sound levels with each other so they play well with each other
* add extra effects (pads, background texture, more complex beats/rythms) to score to help flesh it out
* figure out why the songs sound so stale

| | |
|---|---|
| priority | low |

Sandtrotter
---

### Status

Boards is generated but unordered and the test is unassembled.

### todo

* test out with a nano/arduino with a CR2032 cell to see you can vibrate the motor
* order boards
* create software for it

| | |
|---|---|
| priority | medium |

Live Free, Live Forever
---

### Status

Jacket is assembled but the backing board needs to be paired down.

If there's some way to make the backing easier, this would be ideal.

* Put EVA foam used for floors as a backing plane for the LEDs
* Put EVA foam in both front corners as backing
  - left is for electronics, suitably shoved in there to try and shield it from
    use and offer some strain relief
  - right is for battery
  - might need to elongate the wire from battery to electronics

### todo

* Need to fit to see if the positioning, EVA foam pruning and corner backing
  is reasonable

| | |
|---|---|
| priority | high |

BLDC Driver
---

### Status

Boards are ordered but need to be soldered and tested

* Tested boards
* Big hangup was the 'sense' that needed to either be tied to ground or
  go through a 1ohm resistor
* Let the smoke out of one by connecting it to a large BLDC motor
* Ordered more motors

[src](https://meowcad.com/project?projectId=9ff614c5-18d6-4155-b22e-76b0fd457886)

### todo

* Test with encoder
* Create two motor system with arms to create something interesting
* rev version (?)
  - on board atmega
  - on board encoder (integrated)

| | |
|---|---|
| priority | high |

Seg16
---

### Status

Have a set of 10 boards (put on Tindie) but without a good
method for the diffusors.

The diffusors are laser cut from EVA foam but maybe they
would be better served by 3d printing them.
Seems like kind of a waste of material but who knows.

### todo

* create a clock out of them (or something) as a standalone project

| | |
|---|---|
| priority | medium |


Bloom3d
---

### Status

The 3d printing solution I was pursuing is not going to work.

I think a better method is to have cloth/Tyvek hinges sandwiched in between
laser cut/3d printed/whatever thin strips which then go to a central shaft.

Ordered some tiny stepper motors.
Hopefully they can be driven direct from an Arduino or, in the worst case,
driven by some small transistors.
With luck, I can connect the shaft directly to the platform.

### todo

* get tiny stepper to run (direct off an Arduino)
* construct test rig as proof of concept

| | |
|---|---|
| priority | high |

Frands
---

### Status

Still don't know how to approach this.

Some key points:

* Each layer does not have lights in between them, it's completely
  backlit by the back most panel, diffused from LEDs
* The spacing can be done with foam
* Put it in a frame

### todo

* figure out what the scene should be an implement it

| | |
|---|---|
| priority | low |

BTC Node
---

Create a full node with lightning support.

### Status

None.

### todo

* Either buy a pi + hdd or rent one that has enough space
* stand up node and play around with it

| | |
|---|---|
| priority | high |


Flitterhaus
---

### Status

Software is mostly created, though it needs to be tested a bit.

### todo

* run some outdoor tests on the solar + battery to discover feasibility

| | |
|---|---|
| priority | medium |

Music Similarity
---

### Status

Highly speculative, need to research more.

A modification to `sox` to allow for logarithm frequency spectrogram [here](http://jdesbonnet.blogspot.com/2014/02/sox-spectrogram-log-frequency-axis-and.html) ([gh](https://github.com/jdesbonnet/joe-desbonnet-blog/blob/master/projects/sox-log-spectrogram/spectrogram.c)).

### todo

* find a workflow to create spectrogram, output some type of constellation map
* go back from constellation map to sound to see what gets picked up

| | |
|---|---|
| priority | low |


OK Continuity
---

### Status

Initial investigation is good.
DeepSpeech is faster than real-time.

### todo

* test with usb microphone
* create interface (maybe with visual feedback)
* add some external trigger mechanisms

