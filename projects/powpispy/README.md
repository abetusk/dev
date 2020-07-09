PowPiSpy
===


**WIP**

Simple power monitoring for the Raspberry Pi Zero W (rpi0w) using
the INA260 module.

The rpi0w is connected to the INA260 module
via an I2C interface.
The rpi0w is configured to be an access point so
that a remote machine can connect to it and access
a web page providing power statistics for the rpi0w.

The web page is bare bones.

Historic logs can also be downloaded via the `logs.html` page.

---

This is a work in progress.

License
---

Where appropriate, CC0.

uPlot is licensed under an MIT license.

References
---

* [GitHub: uPlot](https://github.com/leeoniya/uPlot)
* [Adafruit: INA260](https://www.adafruit.com/product/4226) ([tutorial](https://learn.adafruit.com/adafruit-ina260-current-voltage-power-sensor-breakout))
* [Adafruit: I2C on the Raspberry Pi](https://learn.adafruit.com/adafruits-raspberry-pi-lesson-4-gpio-setup/configuring-i2c)
