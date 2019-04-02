2019-04-02
---

* `requestFrom` needs extra parameter at end to function properly
* used [kanestoboi/AS5600](https://github.com/kanestoboi/AS5600) as basis for AS5600 library (was buggy, added fixes)
* the AS5600 library has `Wire.begin()` in a constructor which is necessary (and has tripped me up before) for proper functioning
* forked and fixed into [abetusk/AS5600](https://github.com/abetusk/AS5600)
* the mocoder looks to have shipped with the 5V jumper set to 3.3V. To function properly, this jumper should be de-soldered.
* `A4 = SDA` and `A5 = SCL`.
* The mocoder only needs 4 wires, 2 for power/ground (5V, gnd) and two for `SCL` and `SDA`.

todo:

* jig for motor + encoder
* 'hello world' for motor + encoder
  - replay
  - simple movement
* sn754410 powered bldc
