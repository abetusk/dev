Inner Light Jacket
===

Bill Of Materials
---

| Item | Quantity | Cost | Link |
|------|----------|------|------|
| Buck converter (5V, 10A, waterproof) | 1 | $7 | [ebay](https://www.ebay.com/itm/Waterproof-DC-DC-Buck-Converter-12V-24V-to-5V-10A-Step-Down-Power-Supply-Module/192540821482) |
| Jacket | 1 | ? | ? |
| LED strip (WS2812B 5V 5050 RGB) | 2M | $15 | [ebay](https://www.ebay.com/itm/WS2812B-5V-5050-RGB-LED-Strip-1-5M-30-60-144-150-300-Leds-Individual-Addressable/283361185505) |
| LED silicon tube (10mm wide) | 5M | $6 | [ebay](https://www.ebay.com/itm/20m-10m-Silicon-Tube-12mm-10MM-IP67-for-WS2812-ws2811-5050-5630-LED-Strip-Light/292508212725) |
| Velcro strip (.75 inch wide) | 10M | $13 | [amazon](https://www.amazon.com/Meters-10-92Yards-Strips-Non-Adhesive-Fastener/dp/B06XC41XSJ/ref=sr_1_29) |

### maybe

| Item | Quantity | Cost | Link |
|------|----------|------|------|
| Vinyl spray (white) | 1 | $15 | [amazon](https://www.amazon.com/Rust-Oleum-1911830-Specialty-Aerosol-11-Ounce/dp/B000KKMVJS/ref=sr_1_6) |

Circuit Overview
---

A Raspberry Pi Zero (W?) controls the strip and polls the two encoders.
Each encoder is a way to interact with the running electronics.
One encoder sets a parameter depending on state such as sensitivity, bpm etc.
The other encoder sets state.

There is a microphone attached to the USB input to do beat detection, depending on state.
The HDMI cable isn't normall attached.

There is a 11.1V 5.5Ah LiPo rechargeable battery that is used to power all the electronics.
The strips are 60 LED per meter RGB individually addressable strips at 5V, 14.4 W/m.
The power distribution to the LED strips is done through a 5V 10A buck converter.
3 meters of LED strips runs about 45W which should be about 9A.

The Raspberry Pi is run off of it's own buck converter.
The Raspberry Pi should run at a maximum of 250mA, 5V, and
the separate buck converter is used to reduce noise.

Note that peripherals and other GPIO pins run at 3.3V.
The communication is done straight through from a GPIO pin.
The hope is that this is good enough.
If this turns out not to be true, a level shifter will need to be used.

There is a fuse at the battery outlet before it feeds into any
electronics.
There is a power switch after the fuse.

Software Overview
---

The Raspberry Pi on startup will run a `beatsrv` and `innerlight` daemons.
The `innerlight` deamon does the following:

* communicates with the LED strip
* polls the encoders for values
* changes state depending on encoder values
* receives messages from the `beatsrv` daemon for beats when needed

The `beatsrv` daemon sets up the microphone and passes it through to a real-time beat detection algorithm.
The `innerlight` daemon receives the `beatsrv` beat messages from stdin and then ignores or processes them,
depending on state.

---

need some sort of pubsub server, like `nanomsg`, for ipc under the rpi system.


Power Usage
---

| Element | Watts |
|---------|-------|
| RPi     | 1.25 W |
| LED strip | 14.4 W / 1M 


Input Audio
---

I'm having a lot of trouble figuring out how to get an input stream.
On my Ubuntu system, this worked for me:

```
$ pacmd list-sources | grep -P 'input.*usb' | cut -f2 -d'<' | tr -d '<>'
alsa_input.usb-046d_0825_055D4550-02.analog-mono
$ timeout 10 parecord --channels=1 -d alsa_input.usb-046d_0825_055D4550-02.analog-mono out.wav
$ mplayer out.wav
```

I guess `parecord` has problems when you don't specify a file?
This works:

```
$ timeout 10 parec --channels=1 --format=s16le -d alsa_input.usb-046d_0825_055D4550-02.analog-mono > out.raw
$ play -t raw -e signed -b 16 -c 1 -r 44100  out.raw
```

to convert for some testing:

```
$ ffmpeg -i track.wav -f s16le -ac 1 -acodec pcm_s16le track.raw
```

another way to convert


```
$ sox track.wav -t raw -r 44100 -e float -c 1 - > track_f32.raw
$ play -t raw -e float -b 32 -c 1 -r 44100 track_f32.raw 
$ cat track_f32.raw | bpm
```

### Raspberry Pi

Turn on ssh:

```
systemctl enable ssh.socket
```

For remote debugging (executed on the pi):

```
sss -R 2222:localhost:22 remote.host
```

---

Getting mic input and pumping it to our program:

```
$ arecord --device=hw:1,0 --format S16_LE --rate 44100 -c1 -t raw | ./beatsrv 
```

or with the incantation:

```
$ devhw=`arecord -l | grep card | grep -o -P '^card \d+|device \d+' | cut -f2 -d' ' | tr '\n' ',' | sed 's/,$//'`
$ arecord --device=hw:$devhw --format S16_LE --rate 44100 -c1 -t raw | ./beatsrv
```

Turn on `ssh` ([link](https://www.raspberrypi.org/documentation/remote-access/ssh/)):

```
sudo systemctl enable ssh
sudo systemctl start ssh
```



### beatsrv

```
// taken from SoundStretch/main.cpp
// g++ -I../../include  main.cpp ../SoundTouch/BPMDetect.cpp ../SoundTouch/FIFOSampleBuffer.cpp ../SoundTouch/PeakFinder.cpp -o beatsrv
//
#include <stdexcept>
#include <stdio.h>
#include <string.h>
#include <time.h>
#include "SoundTouch.h"
#include "BPMDetect.h"

using namespace soundtouch;
using namespace std;

// Processing chunk size (size chosen to be divisible by 2, 4, 6, 8, 10, 12, 14, 16 channels ...)
//
//#define BUFF_SIZE       6720
#define BUFF_SIZE       16384

static inline short _swap16(short &wData) {
    wData = ((wData >> 8) & 0x00FF) |
            ((wData << 8) & 0xFF00);
    return wData;
}

static void findThatBeat(FILE *fp) {
  int i;
  float bpmValue;
  int nChannels;
  size_t _buf_size = BUFF_SIZE;
  BPMDetect bpm(1, 44100);
  SAMPLETYPE sampleBuffer[_buf_size];

  char buf[_buf_size*2];
  double conv =  1.0 / 32768.0;

  int count=0;

  nChannels = 1;
  int readSize = _buf_size - _buf_size % nChannels;   // round read size down to multiple of num.channels 

  printf("# BUFF_SIZE %i, _buf_size %i\n", (int)BUFF_SIZE, (int)_buf_size);

  while (1) {
    int num, samples, numx2;
    float _bpm=0.0;

    num = fread(buf, 2, _buf_size, fp);
    if (num==0) { break; }

    short *tmp2 = (short *)buf;
    for (i=0; i<num; i++) {
      short val = tmp2[i];
      sampleBuffer[i] = (float)(_swap16(val) * conv);
    }

    samples = num / nChannels;
    bpm.inputSamples(sampleBuffer, samples);

    _bpm = bpm.getBpm();
    printf("... %f\n", _bpm);

    count ++;
  }

}

int main(int argc, char **argv) {
  printf("beat\n");
  findThatBeat(stdin);
  printf("done...\n");
  return 0;
}
```

Compiling:

```
$ g++ -I../../include  main.cpp ../SoundTouch/BPMDetect.cpp ../SoundTouch/FIFOSampleBuffer.cpp ../SoundTouch/PeakFinder.cpp -o beatsrv

```

Running:

```
$ parec --channels=1 --format=s16le -d alsa_input.usb-046d_0825_055D4550-02.analog-mono | ./beatsrv
```

or maybe:

```
$ parec --channels=1 --format=s16le -d ` pacmd list-sources | grep 'name:' | grep input | grep -o '<.*>' | tr -d '<>' ` | ./beatsrv
```

`WS2812B`
---


### For Arduino

"hello world"

```
#include <FastLED.h>

#define NUM_LEDS 144

// For led chips like Neopixels, which have a data line, ground, and power, you just
// need to define DATA_PIN.  For led chipsets that are SPI based (four wires - data, clock,
// ground, and power), like the LPD8806 define both DATA_PIN and CLOCK_PIN
#define DATA_PIN 5

// not needed...
//
#define CLOCK_PIN 13

CRGB leds[NUM_LEDS];

// I have WS2812B but for some reason showing green instead of red when I set it
// to WS2812B
//
void setup() { 
  FastLED.addLeds<NEOPIXEL, DATA_PIN>(leds, NUM_LEDS);
}

void loop() {
  int i;

  for (i=0; i<NUM_LEDS; i++) { leds[i] = CRGB::Red; }
  FastLED.show();
  delay(500);

  for (i=0; i<NUM_LEDS; i++) {leds[i] = CRGB::Black;  }
  FastLED.show();
  delay(500);
}
```

* data pin 5
* common ground
* separately powered by 5V power supply

### For Raspberry Pi



Raspberry Pi
---

* I had some troubles seeing a wifi card on the zero W. Creating a new image on an 8Gb drive with the latest raspbian 
  resolved the issue.

From [raspbian downloads](https://www.raspberrypi.org/downloads/raspbian/), download the latest image.
I chose Raspbian Stretch as there's no reason to prematurely optimize.

```
unzip 2018-11-13-raspbian-stretch-full.img.zip
dd bs=4M if=2018-11-13-raspbian-stretch-full.img of=/dev/sdb status=progress conv=fsync
```

Note that on my system, `/dev/sdb` was the device that the card was on.
Also note that I had to use a USB adapter to get it to format properly.


After attaching a USB hub along with a keyboard and mouse, I [configured the wifi](https://raspberrypihq.com/how-to-connect-your-raspberry-pi-to-wifi/):

```
sudo nano /etc/wpa_supplicant/wpa_supplicant.conf
```

```
network={
   ssid="My Wifi Network"
   psk="My Wifi Netowrk Secret Password"
   key_mgmt=WPA-PSK
}
```

---

```
$ sudo bash
# apt-get update
# sudo apt-get install gcc make build-essential python-dev git scons swig
# echo blacklist snd_bcm2835 >> /etc/modprobe.d/snd-blacklist.conf
# sed -i 's/^\(dtparam=audio=on\)/#\1/' /boot/config.txt 
```

---

```
$ sudo bash
# pip3 install rpi_ws281x adafruit-circuitpython-neopixel
# cat > pixel_example.py <<EOF
import board
import neopixel
pixels = neopixel.NeoPixel(board.D18, 30)
pixels[0] = (255, 0, 0)
for x in range(0, 9):
  pixels[x] = (255, 0, 0)
  sleep(1)
pixels.fill((0,255,0))

```


Resources
---

* [SO: redirect sound (microphone) via ssh, how to telephone via ssh?](https://unix.stackexchange.com/questions/116919/redirect-sound-microphone-via-ssh-how-to-telephone-via-ssh)
* [SoundTouch](https://www.surina.net/soundtouch/) ([GitLab](https://gitlab.com/soundtouch/soundtouch))
* [Guide for WS2812B Adressable RGB strip with Arduino](https://randomnerdtutorials.com/guide-for-ws2812b-addressable-rgb-led-strip-with-arduino/)
* [FastLED](https://github.com/FastLED/FastLED)
* [rpi_ws281x](https://github.com/jgarff/rpi_ws281x)
* [buxtronix/arduino - Rotary.cpp](https://github.com/buxtronix/arduino/blob/master/libraries/Rotary/Rotary.cpp)
* [Rotary encoder on RPi](https://github.com/attilagyorffy/Rotary-Encoder/blob/master/rotary_encoder.py)
* [SO - Access point as WiFi repeater, optional with bridge](https://raspberrypi.stackexchange.com/questions/89803/access-point-as-wifi-repeater-optional-with-bridge/89804#89804)
* [Beat detection algorithm](https://www.parallelcube.com/2018/03/30/beat-detection-algorithm/)
* [gamedev.net - Beat Detection Algorithms](http://archive.gamedev.net/archive/reference/programming/features/beatdetection/)
* [Beat This](https://www.clear.rice.edu/elec301/Projects01/beat_sync/beatalgo.html)
* [Connect and Control WS2812 RGB LED Strips via Raspberry Pi](https://tutorials-raspberrypi.com/connect-control-raspberry-pi-ws2812-rgb-led-strips/)
* Geekpub RPi WS2812B [(wiring)](https://www.thegeekpub.com/15990/wiring-ws2812b-addressable-leds-to-the-raspbery-pi/), [(controlling)](https://www.thegeekpub.com/16187/controlling-ws2812b-leds-with-a-raspberry-pi/)
