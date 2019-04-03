MIDI Notes
===


For older MIDI output plug interfaces, I think one solution is to have
a MIDI to USB cable ([amzn](https://www.amazon.com/Cable-Converter-Music-Keyboard-Window/dp/B0017H4EBG)) that
will convert MIDI messages to serial text.

My bet is that most modern instruments have a USB cable to send MIDI messages through.
See the [ArchLinux "USB MIDI keyboards"](https://wiki.archlinux.org/index.php/USB_MIDI_keyboards) page but, as a brief summary,
the ALSA drivers should take care of negotiation and interpretation of MIDI messages.
I think the following command line programs will work:


```
aconnect -i
```

```
aseqdump -p <client_id>
```

Here's demo code of reading [MIDI on an Arduino](https://www.instructables.com/id/MIDI-Controlled-LED-Structure/):

```
#include <Adafruit_NeoPixel.h>
#include <MIDI.h>
#define PINA 3
#define PINB 2
#define PINC 5
#define PIND 6

int brightness = 0;
MIDI_CREATE_DEFAULT_INSTANCE();
Adafruit_NeoPixel strip = Adafruit_NeoPixel(5, PINA, NEO_GRB + NEO_KHZ800);
Adafruit_NeoPixel strip2 = Adafruit_NeoPixel(5, PINB, NEO_GRB + NEO_KHZ800);
Adafruit_NeoPixel strip3 = Adafruit_NeoPixel(6, PINC, NEO_GRB + NEO_KHZ800);
Adafruit_NeoPixel strip4 = Adafruit_NeoPixel(6, PIND, NEO_GRB + NEO_KHZ800);


void setup() {

  strip.begin();
  strip2.begin();
  strip3.begin();
  strip4.begin();
  strip4.setBrightness(127);
  MIDI.begin(MIDI_CHANNEL_OMNI);
  MIDI.setHandleNoteOn(NoteOnFunction);
  MIDI.setHandleNoteOff(NoteOffFunction);
  MIDI.setHandleControlChange(CCFunction);
}

void loop() {
   MIDI.read();
}

void NoteOnFunction(byte channel, byte note, byte velocity){
  switch (note){
      case 0:
          strip.setPixelColor(0, 255, 0, 255);
          strip2.setPixelColor(0, 255, 0, 255);
          strip3.setPixelColor(1, 255, 0, 255);
          break;
      case 1:
          strip.setPixelColor(3, 0, 255, 0);
          strip2.setPixelColor(1, 0, 255, 0);
          strip3.setPixelColor(2, 0, 255, 0);
          break;
      case 2:
          strip.setPixelColor(2, 255, 0, 255);
          strip2.setPixelColor(2, 255, 0, 255);
          strip3.setPixelColor(3, 255, 0, 255);
          break;
      case 3:
          strip.setPixelColor(1, 0, 255, 0);
          strip2.setPixelColor(3, 0, 255, 0);
          strip3.setPixelColor(4, 0, 255, 0);
          break;
      case 4:
          strip.setPixelColor(4, 255, 0, 255);
          strip2.setPixelColor(4, 255, 0, 255);
          strip3.setPixelColor(5, 255, 0, 255);
          break;
      case 5:
          for(int i = 0; i < 6; i++)  strip4.setPixelColor(i, 255, 255, 255);
          strip3.setPixelColor(0, 255, 255, 255);
          break;
      default:
          break;

  }
  strip.show();
  strip2.show();
  strip3.show();
  strip4.show();
};

void NoteOffFunction(byte channel, byte note, byte velocity){
 switch (note){
      case 0:
          strip.setPixelColor(0, 0, 0, 0);
          strip2.setPixelColor(0, 0, 0, 0);
          strip3.setPixelColor(1, 0, 0, 0);
          break;
      case 1:
          strip.setPixelColor(3, 0, 0, 0);
          strip2.setPixelColor(1, 0, 0, 0);
          strip3.setPixelColor(2, 0, 0, 0);
          break;
      case 2:
          strip.setPixelColor(2, 0, 0, 0);
          strip2.setPixelColor(2, 0, 0, 0);
          strip3.setPixelColor(3, 0, 0, 0);
          break;
      case 3:
          strip.setPixelColor(1, 0, 0, 0);
          strip2.setPixelColor(3, 0, 0, 0);
          strip3.setPixelColor(4, 0, 0, 0);
          break;
      case 4:
          strip.setPixelColor(4, 0, 0, 0);
          strip2.setPixelColor(4, 0, 0, 0);
          strip3.setPixelColor(5, 0, 0, 0);
          break;
      case 5:
          for(int i = 0; i < 6; i++)  strip4.setPixelColor(i, 0, 0, 0);
          strip3.setPixelColor(0, 0, 0, 0);
          break;
      default:
          break;
  }
  strip.show();
  strip2.show();
  strip3.show();
  strip4.show();
};
void CCFunction(byte channel, byte number, byte value){
  brightness = value*2;
  strip.setBrightness(brightness);
  strip2.setBrightness(brightness);
  strip3.setBrightness(brightness);

  strip.show();
  strip2.show();
  strip3.show();

};
```

Reference
---

* [Send and Receive MIDI with Arduino](https://www.instructables.com/id/Send-and-Receive-MIDI-with-Arduino/)
* [SANOXY USB MIDI Cable Converter PC to Music Keyboard Window Win Vista XP, Mac OS](https://www.amazon.com/Cable-Converter-Music-Keyboard-Window/dp/B0017H4EBG))
* [USB MIDI controllers & making music with Ubuntu](https://rafalcieslak.wordpress.com/2012/08/29/usb-midi-controllers-and-making-music-with-ubuntu/)
* [USB MIDI keyboards](https://wiki.archlinux.org/index.php/USB_MIDI_keyboards)
* [Arduino MIDI](https://www.arduino.cc/en/tutorial/midi)
* [MIDI Controlled LED Structure](https://www.instructables.com/id/MIDI-Controlled-LED-Structure/)
* [Instructable - PiMiDi](https://www.instructables.com/id/PiMiDi-A-Raspberry-Pi-Midi-Box-or-How-I-Learned-to/)
* [Sparkfun - i2c on rpi](https://learn.sparkfun.com/tutorials/raspberry-pi-spi-and-i2c-tutorial/all)
