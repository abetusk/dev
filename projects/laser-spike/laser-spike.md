Laser Spiked Jacket
===

- intro
- materials
- design
- laser diode cabling
- laser diode housing (laser cut)
- assemble laser diode with housing (& strain relief)
- laser diode testing
- electronics assembly
- programming
- electronics housing
- electornics and laser diode testing
- lazer diode jacket layout
- attach laser diodes to jacket
- create lazer diode cabling
- attach lazer diode cabling
- laser cabling and cabling strain relief
- final testing

Intro
---

After seeing Wei Chieh Shi's laser jacket design, I wanted to design my own.
This instructable shows how to modify a jacket to add laser diodes
and control them electronically to produce different laser light patterns.
The laser diodes give the jacket an appearance of being "spiky", like having
metal spikes but with red laser light.
The effect is especially striking in environments with fog or smoke as the
laser light path shows a trail from where it originates.

The concept and execution is relatively simple but care has to be taken to
make sure that the electronics, wiring and other aspects of the jacket don't
fail when in use.
Much of the subtlety and complexity of the project is providing proper wire
routing and making sure that proper strain relief and support for the electronics
and connections is provided so it's resilient under normal wear.

Materials
---

* Jacket

* Soldering Iron
* Solder
* Wire Cutter
* Wire Strippers
* Flux (optional but highly recommended)
* Helping Hands (optional)
* Soldering Braid (optional)

* Arduino Nano
* Joystick Module
* Microphone
* 128x Laser Diode Module
* 2x PCA9685 16 channel PWM drivers
* 5V Buck Converter
* 5V 3A BEC
* 7.4V 3Ah LiPo battery
* 2s LiPo charger
* 2x Gikfun Proto-Boards
* 1x protoboard
* 1x small protoboard

* 50x 2pin male/female JST connectors (with headers and crimper)
* 5x 6pin male/female JST connectors
* 150x JST 1.5mm male/femail pair ([Amazon](https://www.amazon.com/gp/product/B013JRWCBU/ref=ppx_yo_dt_b_asin_title_o07_s00?) [EBay](https://www.ebay.com/itm/50-Sets-Mini-Micro-JST-1-5mm-ZH-2-Pin-Connector-Plug-With-Wires-Cables-150mm/332287106091?hash=item4d5ddadc2b:g:j-wAAOSwiQ9ZVikI))
* 6 colors of 24 AWG wire, stranded (10ft)
* 2 colors of 24 AWG wire, stranded (200ft)
* 2 colors of 24 AWG wire, solid core (10ft)

* 12x 30mm M3 bolt
* 20x 6mm M3 bolt
* 100x M3 nut
* 400x M2 black hex cap bolt
* 1000x M2 nut

* 8x 12"x12"x1/16" Black Acrylic Sheet
* 3x 12"x12"x1/8" Wood Sheet
* Laser Cutter

* Velcro (optional)
* Snaps (optional)

A quick note: Amazon generally offers quicker shipping than the EBay alternative but often at 2-10 times the cost.
I've found there's often minimal difference in quality between the items I order on Amazon and EBay.

Design Overview
---

The basic design is to attach 128 laser diodes to the arms, shoulders and upper back of a
'moto' jacket and provide power and control to the laser diodes with electronics.
The electronics are put into a housing and all wires, electronics and their housing are
hidden in the interface between the outer jacket shell and the inner lining.

A joystick and microphone is used for input, with power being provided by a LiPo rechargeable batter.

The basic components are:

* Laser diode housing and attachement
* Electronics
* Electronics Housing
* Wiring and connection

The basic workflow is roughly as follows:

* Assemble the laser diodes with their connectors and housing
* Attach the laser diodes to the jacket
* Solder the electronics and assemble them in their housing
* Create the cabling and connect the laser diodes to the electronics
* Wear it

Laser Diode Assembly
---

The laser diodes are attached to the outside of the jacket by a laser cut 'housing'.
Each laser diode housing is a stack of laser cut acrylic, fit together with M2 screws.
The base of the housing is put under the outer jacket shell to provide support for
the laser diode and relief for the laser diode wires.

### Attach Laser Diode Cabling

After testing each laser diode to make sure they work, solder a male  JST 1.5mm 2pin header
to each of the ends of the laser diode.
I've found best results by cutting the edge of the wires off, stripping them and then wrapping and
soldering them.

As much as possible, I try to make a 'lineman splice' when connecting wires to make sure
there's a good connection.
Make sure to put the heat shrink tubing on before soldering.

Before soldering, apply a healthy drop of flux to make sure the solder will flow well.
Once the wires are soldered together, put the heat shrink tube on and heat with the heat
gun to give a good fit.

If there's any exposed wires, cover with electrical tape.
If for some reason the heat shrink tube is loose, you can alway sput another, larger,
heat shrink tube around both and shrink to fit.

Be gentle when handling the laser diodes as the wires connected to the laser come off easily.

Do this for each of the 128 laser diodes.
As much as possible, test the laser diodes after attaching the cabling.
This might mean making a 'test cable' to test each of the laser diodes.

### Laser Cut Housing

Use your laser cutter to cut the laser diode housing.
I used 1/16" black acrylic.
My laser cutter has an effective work area of 8"x12" which allows a sheet of
black acrylic to cut out approximately 20 laser diode housings.

Though probably obvious to people who use laser cutters more than I do, make
sure to take off the paper protection for the acrylic sheets.
The acrylic cut is clean and often doesn't produce a flame, so any paper protection
isn't necessary.
Leaving the paper on also tends to cause the work to catch fire.

I've found that my laser cutter only has about 30 minutes of operation before
the water cooling becomes too hot for the laser cutter to keep functioning properly.
This is highly dependent on the type of laser cutter and cooling system that's installed
but it's something to keep an eye on.

After the housing has been cut, I've found that it's necessary to remove smaller interior
pieces with a small pick.
I like to prepare the acrylic pieces by putting them into groups dpeending on whether
it's and outer, inner or backing piece, for ease of assembly laster.

### Assemble Laser Diode Housing

After the laser diodes have been cabled and the laser diode housings have all been cut,
it's time to assemble the laser diode in it's housing.
This won't be the complete housing as there's a final backing piece that won't be put
until the laser diode is attached to the jacket but most of the laser diode assembly
is done in this step.

Prepare the 128 cabled laser diodes along with the pile of acrylic housing pieces and
the M2 25mm screws and nuts.
One by one, put each of the laser diodes into the assembled laser housing.

I've found the best way to proceed is to put two M2 screws through the top housing
plate then progressively add the six middle plates.
I try and put the two M2 screws in a position that is perpendicular to the rectangular
slot in the middle stacked plates.
When stacking the middle plates, make sure that the rectangular slots line up.

I loop each laser diode through a bottom plate.
This loop is done to provide strain relief for the wire so that moderate force
won't disconnect the soldered wires from the laser diode.
Once the laser diode is looped through the bottom plate, I then position the
laser diode onto the stack.

Once the laser diode is seated in the laser diode housing stack, I then insert
the third M2 screw and put a nut on each of the three M2 screws.
The idea is to screw the bottom plate on tight enough to keep the laser diode
cables in place and relieve any forces that would yank on the wires coming out.

Using acrylic for the housing and strain reilef is less than ideal as the acrylic
is very brittle and cracks easily.
I've found that the bottom plate often cracks when screwing the nuts in place.
As long as the acrylic bottom plate provides strain relief, even if it's cracked,
the housing is still doing it's job.
While the brittle acrylic and potential cracking is not ideal, I've found that
it works well enough.

Any future iteration of this project should provide a better solution to housing
the laser diodes.

### Attach Laser Diodes to Jacket

Once the 128 laser diodes have been put in their housing, it's time to attach
them to the jacket.
First, open up the jacket lining to get access to the inner jacket shell.
It's best to keep as much of the lining intact as possible as the lining
provides shielding from the cabling to your skin when wearing the jacket
and also provides a convienient place to put the electronics out of sight.

I've found that takin the stitches out of the middle back is best.
The opening can be closed off later with snaps or velcro.

A pattern is first marked on the outside of the jacket to decide where to place each of the
laser diodes.
I initially did this with tape.
After the first few rows had been placed, I found the tape was mostly not necessary
as it's easy to judge where the to place the laser diodes by eye.

The basic procedure is to use a template middle plate of the laser housing to
poke four holes per laser diode in the jacket, three for the M2 screws and one
in the center for the cable.
I use an antique walnut cracker but any sharp pointed object will do to create
the holes in the jacket.

The center hole for the cable needs to be bigger than the rest as the JST 1.5mm
male header is bigger than the M2 screws.
I've found that enlarging the hole with a pair of needle nose plyers works well.

Once the laser diode housing's cable and three M2 screws have been fed through
the holes, the inside of the jacket shell needs to be accessed to attach
a middle housing plate to the M2 screws that are now poking through.
For the fist few rows of the laser diodes, the jacket arm might need to be
turned inside out but as the laser diodes are attached further up the arm,
it's possible to get access to them without completely turning the arm inside out.

When turning the arm inside out, take care to try not to damage the laser
diodes.
The should be moderately resilient (after all, that's one of the reasons they
were designed) but it's best to still be as careful as possible.

When the underside has been accessed, place a center laser housing plate on
the bottom, feeding the M2 screws through the three holes and the laser diode
cable through the center.
Screw the plate on with three M2 screws.

Once all the laser diodes have been attached, if possible, test each laser
diode to make sure they still function.
Testing earlier in the process helps weed out potential promblems down the line.
Engineering and electronics are hard to do in general and when there's the added
element of electronics attached to clothing that's bending, bumping, moving and
flexing, it makes it all that much more probable that failure occurs.

Considering the quantity of elements involved in the project, failure can
be expected, so make sure to have a few extra laser diodes on hand so that
when failures are detected, the laser diodes can be replaced.

Understand that part failure is part of the process and don't get
demotivated when things break or don't initially work.
Failure is to be expected, planned for and compensated for by testing
and making sure there are replacement parts handy.

Once all the laser diodes are attached and we have some reasonable expectation
that they function, it's time to move on to the creating the electronics
that will drive the laser diodes.

Electronics Assembly
---

The electronics are a pair of PCA9685 PWM controllers which are themselves controlled by
an Arduino Nano.
A microphone is hooked up to the Nano to allow for ambient sound input, music for example,
and a joystick with a button is provided for some control.

The joystick button is used to control which 'mode' the jacket display is in.
Currently, there are three modes:

* Twinkle - loops the laser diodes in a 'twinkle' pattern
* Graphic Equalizer - use the microphone input to get graphic equalizer data to control the laser diode project pattern
* Joystick Controlled - use the joystick to control the laser diodes directly

Each output of the PWM driver is fed into four laser diodes.

The laser diodes are powered by a 5V 3A "battery elimination circuit" (BEC).
The Arduino Nano and all of the logic on the peripherals are powered by a 5V buck conververter.
The BEC and buck converter are powered by a LiPo 2s battery.
The battery has an attachment of a 3A fuse and power toggle.

As stated above, the fuse is a safety precaution to make sure that any accidental
short circuit doesn't result in a catstrophic and potentially hazardous failure.
The power toggle is provided for ease of use.

### Power Cable

For safety and convenience reasonse, a cable for the 2s LiPo battery created and connected.
It's sometimes easy to accidentally create a short when soldering or prototyping.
Should a short happen without a fuse in line with the LiPo battery, the battery often has
the potentially to push upwards of 25A through the connection.

When prototyping, I've accidentally created a short and had one of the wires heat up and explode,
causing the wire shielding to catch fire.
With the fuse in place, I've had no fires or explosions, so I would highly recommend putting
this safety feature in.

I've found the 20 AWG fuse holder to be a good wire size.
Larger AWG and it becomes unwieldy to attach to other cables.

Solder one end of the 20 AWG fuse holder is into the positive lead of a female XT30 connector.
In line with the fuser holder, on the end that isn't connected to the battery,
solder a power toggle switch wire.
For both, make sure to feed the heat shrink on before soldering.

For all attached wiring, I think the [Lineman splice](https://en.wikipedia.org/wiki/Western_Union_splice)
technique to use.
When the wires are wrapped together well, add drop of flux and solder them together.
Once soldered, give the wires a decent yank to make sure they're attached well.

Once the wires are attahced firmly, feed the heat shrink tubing onto them
and use the heat gun to shrink the tubing over the soldered joint.
If you don't ahve any heat shrink tubing or forgot to put it on, wrap
the exposed solder joint in electrical tape to make sure it's isolated.

I put electrical tape aroudn the bottom of the toggle switch to make sure
any exposed leads are covered.

Attach another lead to the negative end of the XT30 connector, making sure
to match the length of the fuse, toggle and end connector.

Create a 2 wire end connector with a JST 2.5mm male end.
I've found a 24 AWG stranded wire to be a good option for
this.

As before, I believe attaching the JST 2.5mm male 2 wire connector
to the battery wiring with a [Lineman splice](https://en.wikipedia.org/wiki/Western_Union_splice)
is best.
Once the wires have been spliced together, add a drop of flux
and solder them together, making sure to put the heat tube on before soldering.
Give the connection a yank to make sure the joint is good, resoldering
if necessary.

Once the eonnector is soldered on, move the heat tubing over the exposed
joint and use the heat gun to shrink the heat tubing in place.

I've found the cabling to be a bit loose, so I put a few cable ties
to keep it as clean and self contained as possible.

Make sure to put a 3A fuse into the fuse holder.

Attach the battery to the power cable.

### Power Regulators

We'll now build the breakout board for the power regulators.
The laser diodes should draw aroudn 1mA each, making the whole
system draw around ~200mA as an upper bound.

Since the power draw is significant and highly variable for the laser diodes
compared to the power draw of the rest of the electronics, separate
regulators have been used to make sure the laser diode power and
the electronics power are as isolated as possible.
Without this isolation, the Arduino might star to act weird
and other input devices might have undesirable noise.

The breakout board diverts power from the batter to a 5V buck
converter and to the 5V 3A BEC.
The 5V buck converter powers the Arduino Nano and other logic
circuits.
The 5V 3A BEC powers the laser diodes.

Sometimes regulators fail so it's nice to have them be swappable
as much as possible.

For the 5V buck converter, solder four 2-pin headers at the appropriate
positions.
For the BEC, cut off the ends and re-attach two 2-pin JST 2.5mm male headers,
making sure the positive lead is on the left side of the header if looking at
the header with the notch side visible.

Solder two 8x1 row female headers onto the protoboard.
Make the vertical spacing of the headers a matching distance to the height of the buck converter.
The headers will provide the seating for the buck converter.

Solder five 2-pin female headers to the protoboard, one at the top for the battery
power in, three on the right for the batter power out to the BEC and one last one on the left
for the output of the 5V regulator.

Two of the three 2-pin female headers on the right are for the input and output of the BEC.
The last 2-pin femail header is for the output of the BEC that goes to power the laser diodes.

Use connecting wires to make sure all power is routed to the appropriate places.

### Arduino and Input Breakout

An Arduino Nano provides the main processing power that takes input from the microphone
and joystick and communicates with the PWM drivers.

The basic layout of the circuit is to breakout the appropriate pins to route to
the I2C lines for the PWM controllers, input lines to read the joystick and button,
an input line for the microphone and power routing to the various portions of the
breakout that need it.

The only extra component is the 10k resistor to make sure the button line on the
joystick floats high.

When soldering, make sure to use flux as it helps solder flow and prevent cold
joints.
As a general rule, testing continuity is a good idea.
As a basic precaution, make sure that power and ground are isolated by confirming
there is no continuity between them.

After soldering is completed, clean up the bottom by removing any excess wiring.

>> talk about providing usb cable
>> go on to programming

### PWM breakout

The PWM controllers are not directly soldered on and isntead are seated on
the protoboard.
The laser diodes aren't directly driven by the PWM controller and are powered
by 2n2222 transistors whose gate is connected to the PWM controller output.

The power to the laser diode is routed through a female JST 2.5mm connector.
The board is powered by the BEC output.
The PWM controller's logic circuitry is powered by the 5V buck converter but
is provided by 6 connector line that's used for it's I2C connection.

There are two PWM controllers, each with their own proto-board.
One PWM controller will be housed with the Arduino Nano breakout and the power
regulator breakout.
The other PWM controller will be on it's own and eventually placed on the other
side of the jacket.

Each PWM controller is located on either side of the jacket to provide better
access to the laser diodes they will drive.

Each of the PWM controller has 16 output lines.
Each output line provides control to 4 laser diodes, for a total of 16*4=64
laser diodes per PWM controller.
Two PWM controllers that control 64 laser diodes each totals 128 laser diodes.

As a note, even with the large proto-board the PWM controller is housed in,
space is still a concern for the wiring.
I've found that using the top and bottom of the board helps keep wire management
under control.
The way I've wired the control lines from the PWM controller output to the transistors
means that the solder points of the wires will fall in the middle of other lines
above it.
To make sure that soldering doesn't damage the wires, I've found staggering the
soldering, first doing only one side of the top and bottom wires, then progressing
further down, is a better method than soldering a complete top or bottom at once.


### Connecting Wires

Power from the regulators needs to get to the Arduino and PWM controllers.
The Arduino needs to communicate to the PWM drivers.
The joystick and microphone need extension cables.

The power can be done via a ...

>> talk about testing microphone and joystick

### Electronics Housing Overview

The PWM driver, along with other electronic components, such as the power converters
and Arduino Nano, is seated in a laser cut electronic housing, consisting of
two laser cut wood panels that has plastic tubing in the middle for spacing.
The electronic housing is joined with various M3 screws.
The M3 screws provide double duty, acting as spacers for the two housing panels
and also provide support for the proto-board.

### Wiring and Connection Overview

The LiPo battery is attached to a fuse to make sure no catastrophies from shorts happen.
A power toggle is also attached for ease of powering on the laser diodes.

Each output line from
the PWM controller is attached to a group of four laser diodes.
The lines from the laser diodes are wrapped around a strain relief gadget on
top of the electronics housing.

The electronics housing is affixed to the inside of the jacket so it doesn't jossle
around.
The Joystick and microphone are positioned to make sure they're accessible.

### Final Design Notes

There are some major points of interest that I believe are worth mentioning.
Here is a list, in no particular order:

* The laser diodes are 5mw and don't pose a significant risk to people eyesight.
  Though people shouldn't stare directly into the laser diode, it's akin to staring
  straight into a flashligh...bad if done without looking away but no real danger
  of being blinded by accident.
* Strain relief is a must for all components involved. Without it, wires coming out
  of the laser diodes would be pulled off and connections on the protoboard would weaken.
* Making sure the proto-board is backed onto a more stable substrate, like the laser
  cut wood housing, prevents flexing from the proto-board, which helps mitigate breaks,
  weak joints and other failures from occuring.
* The LiPo battery has a fuse in line with it preventing more than 3A to be produced.
  A friend suggested I do this after setting many of my projects on fire. Since I've
  been using the fuse in line with the LiPo, I'm happy to report that I haven't had one
  wire explode or any of my jackets catch on fire.
* Without putting the main driving electronics on a separate regulartor from the
  main power draw I've had the noise cause major
  problems, especially when there's communication or audio sensing involved.
  In this project and others, I make sure to power the electronics components (the Nano,
  PWM controllers, etc.) from a 5V regulated buck converter and the main power
  components, in this case the laser diodes, from another regulator, in this
  case the 5V 3A BEC.
* In general, I like oriented and locking headers, especially for power connections.
  The orientation prevents accidentally inverting the ground and power.
  The locking mechanism prevents connections from coming loose.
  Since the electronics are to be worn, the locking mechanism prevents
  the headers from coming out if the assembly is jostled.
  If it's necessary to make connections in the field, the orientation
  helps prevent mis-wiring.


For anyone attempting this project, understand what you're getting into.
I have enough of a risk affinity to not mind the dangers but for others who might
be more risk averse, **understand that the LiPo batteries involved in this project could cause severe bodily damage**.

**The LiPo battery has enough power to catch fire, explode and otherwise cause potentially sever bodily damage**.

I personall believe the technology is safe enough to use (I am happy to wear the
jackets I make) but shorts can cuase fires, water exposures can cause shorts or other
potenially hazardous situations and battery puncture or rupture could cause severe bodily damage.

Before I started using fuses as a safety measure, I've had
wires explode and jackets catch fire because of shorts in my wiring (only in development,
never while actually wearing them out to events).

**Do your research to make sure you understand the risks involved and what level of risk you are comfortable with.**

Laser Diode Housing
---

The laser 


References
---

* [Make](https://makezine.com/2010/05/03/laser-jacket/)
* [200 LDs Stage Suite (behance)](https://www.behance.net/gallery/493017/200-ld-stage-suit)
* [Kazuya Yoshii](https://youtu.be/AgRMm9HB60Q)
* [Wei Chieh Shih](https://www.behance.net/shihweichieh)
* [U2 - 360 at the rose bowl](https://www.uncut.co.uk/reviews/dvd/u2-360-at-the-rose-bowl)
