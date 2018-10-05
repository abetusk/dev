PCB CNC Development Log
===

This is a place to collect a development log
about the PCB CNC project(s) I'm doing.

2018-10-03
---

I purchased a CNC1610 for ~$180 from Amazon a couple of days ago.
It arrived unassembled and I used [3DSage's YouTube Assembly video](https://www.youtube.com/watch?v=XfhlZuw5mDs)
to help in my assembly.

One thing I didn't do is add a lot of washers I might want to do that if I don't want the screws
to constantly come out.

In order to put the channel screw anchors, I used a pair of tweezers to pick them up by the middle
and then twist them.
A "gotcha" for me was assembling the z-axis frame where I reversed the outer and inner channels.
I mistakenly used the 220mm length one as the 'up' direction and used the 200mm as the cross beams.
Reversing these the z-axis assembled correctly (see the [appropriate point in the video](https://www.youtube.com/watch?v=XfhlZuw5mDs&t=135)).

Hooking up the motors, I successfully moved all three axies.
I used minicom to put it through it's paces:

```
minicom -s -c on -D /dev/ttyACM0
```

The common values are `/dev/ttyACM0` and `/dev/ttyUSB0`.

I believe the config values for minicom are:

* `115200 8N1`
* `Hardware Flow Control : Yes`
* `Software Flow Control : No`

I didn't put the cross beams for the z-axis close enough so I had to unscrew them and realign them
to have all four anchor points connect to the Arduino/GRBL shield connect to the back.

I labelled the axies on the board with a sharpie.

![img/cnc1610-basic-pinout.png](basic pinout for the Arduino/GRBL board that comes with the cnc1610)

![img/cnc1610-grbl0.9-board-layout.jpg](board equivalent overview)

![img/cnc1610-grbl0.9-board-layout2.jpg](board equivalent overview)

From [gne/grbl issue #123](https://github.com/gnea/grbl/issues/123#issuecomment-279131776), the pinout looks to be the following (though this should be double checked):

> The external contacts are all GND.

| name | description  |
|------|--------------|
| xen  | Limit-X-Axis |
| xen  | Limit-X-Axis |
| yen  | Limit-Y-Axis |
| yen  | Limit-Y-Axis |
| zen  | Limit-Z-Axis |
| zen  | Limit-Z-Axis |
| A5 | Probe |
| A4 | |
| A3 | Coolant Enable |
| A2 | Cycle Start/Resume |
| A1 | Feed Hold |
| A0 | Reset/Aboat |
| A7 | |
| A6 | |
| D13 | Spindel Direction |
| RST | |
| 5V | |

My bet is that each of the axies of the `[xyz]en` pins are connected (so `xen` has two pinouts but is connected)
so that you can plug the limit switches directly in for each side without having to create extra wiring.


