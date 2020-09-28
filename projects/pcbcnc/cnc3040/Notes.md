CNC 3040 Notes
===

###### 2020-08-10

Running SmoothieWare.

* 4mm pitch
* 1.8 deg per motor step
* 1/16 microstepping

---

* `(360/1.8)*16/4 = 800` pulses per mm

---

![motor wiring](img/motor-wiring.png)

---

![grbl pinout](img/Grbl_Pin_Diagram_v0.9+.png)

Using some TB6600 clone.

Dip switches are set to 1/16 microstepping and 2A:

| Dip Switch | Position |
|---|---|
| `S1` | Off |
| `S2` | Off |
| `S3` | On  |
| `S4` | On |
| `S5` | Off |
| `S6` | Off |

`ENA-`, `ENA+`, `DIR-` and `PUL-` are all tied to Arduino ground.

As per the Grbl wiring:

| Arduino Pin | Motor Driver Pin |
|---|---|
| `D2` | X Pulse |
| `D3` | Y Pulse |
| `D4` | Z Pulse |
| `D5` | X Direction |
| `D6` | Y Direction |
| `D7` | Z Direction |

