Notes
---

* https://github.com/Smoothieware/Smoothieware/blob/edge/FirmwareBin/firmware.bin

Motors are NEMA23 2.0A, 1.8deg (200 steps per revolution).
The pitch on the ballscrews appear to be 4mm (as in 1604?).

The formula for to determine stepper motor pulses per mm is:

`steps per mm = (steps per revolution) / (pitch)`

In this case:

` 200 / 4 = 50 `

