PCB Notes
===

PCB Thickness
---

Copper thickness is commonly expressed in `oz`, for example `1 oz Cu`.
This is shorthand for the height of copper if spread over a square foot
surface.

To calculate the height for `1 oz` `Cu`, we need a few conversions:

* $ 1\ \mathrm{oz} = 0.0625\ \mathrm{lbs}$
* $\mathrm{Cu}\ \mathrm{density} = 8.96 \frac{\mathrm{g}}{\mathrm{cm}^3} $
* $ 1\ \mathrm{g} \approx 0.00220462\ \mathrm{lbs} $
* $ 1\ \mathrm{cm} \approx 0.393701\ \mathrm{in} $

This implies:

* $\mathrm{Cu}\ \mathrm{density} = \frac{8.96 \cdot 0.00220462\ \mathrm{lbs}}{(0.393701^3)\ \mathrm{in}^3} \approx 0.324 \frac{\mathrm{lbs}}{\mathrm{in}^3} $
* $ h\ \mathrm{in} = \frac{1\ \mathrm{oz}}{ 1\ \mathrm{ft}^2 } = \frac{0.0625\ \mathrm{lbs}}{ 144\ \mathrm{in}^2 } \approx .00134 $

Or, in general,

$$ z\ \mathrm{oz}\ \mathrm{Cu} \rightarrow z \cdot 1.34\ \mathrm{mil} $$

Where $1\ \mathrm{mil} = \frac{1}{1000}\ \mathrm{in}$.

---


Decoupling Capacitors
---

* Either one 100nF or two, one of 0.1uF and another of 10uF 
* Place as close to the chip as possible
* Place the decoupling capacitor across the power supply (3.3v or 5v)

([src](https://www.autodesk.com/products/eagle/blog/what-are-decoupling-capacitors/))

SMD Sizes
---

| |
|---|
| ![surface mount sizes](img/SMT_sizes,_based_on_original_by_Zureks.svg) |

| SMD | mm | inch |
|---|---|---|
| 2920 | 7.4 x 5.1 | 0.29 x 0.20 |
| 2725 | 6.9 x 6.3 | 0.27 x 0.25 |
| 2512 | 6.3 x 3.2 | 0.25 x 0.125 |
| 2010 | 5.0 x 2.5 | 0.20 x 0.10 |
| 1825 | 4.5 x 6.4 | 0.18 x 0.25 |
| 1812 | 4.6 x 3.0 | 0.18 x 0.125 |
| 1806 | 4.5 x 1.6 | 0.18 x 0.06 |
| 1210 | 3.2 x 2.5 | 0.125 x 0.10 |
| 1206 | 3.0 x 1.5 | 0.12 x 0.06 |
| 1008 | 2.5 x 2.0 | 0.10 x 0.08 |
| 0805 | 2.0 x 1.3 | 0.08 x 0.05 |
| 0603 | 1.5 x 0.8 | 0.06 x 0.03 |
| 0402 | 1.0 x 0.5 | 0.04 x 0.02 |
| 0201 | 0.6 x 0.3 | 0.02 x 0.01 |
| 01005 | 0.4 x 0.2 | 0.016 x 0.008 |

| Package | Pitch (mm) |
|---|---|
| SOIC | 1.27 |
| TSOP | 0.5 |
| SSOP | 0.635 |
| QSOP | 0.635 |
| VSOP | 0.4, 0.5, 0.65 |
| LQFP | 1.4 |
| PLCC | 1.27 | 


| |
|---|
| ![surface mount cheat sheet](img/smd_cheat_sheet.png) |

---

Common Designator Meanings
---

| Designator | Component type |
|---|---|
| A | Separable assembly, Sub-assembly (e.g. printed circuit assembly) |
| AN, AS | Antenna |
| AR | Amplifier |
| AT | Attenuator, Isolator |
| BR | Bridge rectifier |
| B, BT | Battery |
| BZ | Buzzer |
| C | Capacitor |
| CB | Circuit breaker, Supercapacitor |
| CN | Capacitor network |
| D, | CR Diode (all types, including LED), Thyristor |
| DL | Delay line |
| DS | Display, General light source, Lamp, Signal light |
| F | Fuse |
| FB | Ferrite bead |
| FD | Fiducial |
| FL | Filter |
| G | Generator, Oscillator |
| GN | General network |
| H | Hardware, Screws, Nuts, Washers |
| HY | Circulator, Directional coupler |
| IR | Infrared diode |
| J | Jack (least-movable connector of a connector pair), Jack connector (connector may have male pin contacts and/or female socket contacts) |
| JP | Jumper (Link) |
| K | Relay, Contactor |
| L | Inductor, Coil, Ferrite bead |
| LS | Loudspeaker, Buzzer |
| M | Mosfet, Motor, Meter, Measuring device |
| MH | Mounting hole |
| MK | Microphone |
| MP | Mechanical part (including screws and fasteners) |
| OP | Opto-isolator, Operational amplifier |
| P | Plug (most-movable connector of a connector pair), Plug connector (connector may have male pin contacts and/or female socket contacts) |
| PS | Power supply |
| Q | Transistor (all types) |
| R | Resistor |
| RLA, RY | Relay |
| RN | Resistor network |
| RT | Thermistor |
| RV | Varistor, Variable resistor |
| S, SW | Switch (all types, including buttons) |
| T | Transformer, Incorrectly used as transistor (see “Q”) |
| TC | Thermocouple |
| TP | Test point |
| TR | Transistor, Transducer |
| TUN | Tuner |
| U | Integrated circuit (IC), Inseparable assembly |
| V | Vacuum tube |
| VR | Voltage regulator (voltage reference), Variable resistor (potentiometer or rheostat), PTC |
| W | Cable, Wire, Busbar |
| X | Socket connector for another item not P or J, paired with the letter symbol for that item (XV for vacuum tube socket, XF for fuse holder, XA for printed circuit assembly connector, XU for integrated circuit connector, XDS for light socket, etc.) |
| XMER | Transformer |
| XTAL | Crystal |
| Y | Crystal, Oscillator |
| Z | Zener Diode |

([digikey](https://forum.digikey.com/t/pcb-markings-reference-designator-meanings-part-identification/24464), [wp](https://en.wikipedia.org/wiki/Reference_designator))

###### 2018-02-03
