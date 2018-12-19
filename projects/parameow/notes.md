ParaMeow Notes
===

Here are some brief steps I took:

* Get a 128Gb SD card
* Install [Rasbian desktop and recommended software](https://www.raspberrypi.org/downloads/raspbian/) on it via a combination of `gparted` and `dd` to [copy the image over](https://www.raspberrypi.org/documentation/installation/installing-images/linux.md)
* Configure the WiFi to connect and install appropriate software
* Hook up the camera and [twist the outside lens to focus](https://www.jeffgeerling.com/blog/2017/fixing-blurry-focus-on-some-raspberry-pi-camera-v2-models)

Basic Idea
---

On startup, it will record to `flv` (or `mp4` maybe?). Each 15 minute time segment will record to it's own file with a timestamp (UTC).

The basic command to record will be (taken from the [Bird Box tutorial]):

```
raspivid -o - -t 900000 -w 1280 -h 720 -fps 25 \
  -b 4000000 -g 50 | \
  ffmpeg -re -ar 44100 -ac 2 -acodec pcm_s16le \
  -f s16le -ac 2 -i /dev/zero -f h264 \
  -i - -vcodec copy -acodec aac -ab 128k -g 50 \
  -strict experimental \
  -f $outfile.flv
```

Where `$outfile` is the appropriate file it's currently creating and the `900000` is the time (15mins in ms?) to record.

Also on startup, a 'light show' should start, cycling through whatever RGB program is desired.
This should probably be some JSON config file that has relevant detail.
The config file should also have an option for what to do with the video data.

For example:

```
{
  "type" : "parameow-config",
  "#video-copy-options" : [ "copy", "copy-and-delete", "remove", "nop" ],
  "video-copy-option"  : "copy-and-delete",
  "video-copy-led" : {
    "copy" :            [ {"rgb" : ["#00ff00", "#00aa00"], "dt": 0.25 }, {"rgb" : ["#00aa00", "#00ff00"], "dt": 0.25 } ],
    "copy-and-delete" : [ {"rgb" : ["#0000ff", "#0000aa"], "dt": 0.25 }, {"rgb" : ["#0000aa", "#0000ff"], "dt": 0.25 } ],
    "remove" :          [ {"rgb" : ["#ff0000", "#aa0000"], "dt": 0.25 }, {"rgb" : ["#aa0000", "#ff0000"], "dt": 0.25 } ],
    "nop" :             [ {"rgb" : ["#ffffff", "#aaaaaa"], "dt": 1.0  }, {"rgb" : ["#aaaaaa", "#ffffff"], "dt": 1.0 } ]
  },
  "catalog" : [
      { "name" : "default",
        "data": [{ "rgb" : ["#ff0000", "#770000"], "dt" : 0.3 },
                 { "rgb" : ["#770000", "#770077"], "dt" : 0.5 },
                 { "rgb" : ["#770077", "#770000"], "dt" : 0.7 },
                 { "rgb" : ["#770000", "#ff0000"], "dt" : 0.2 }]
      },
      { "name" : "red-pulse",
        "data" : [{ "rgb" : ["#770000", "#aa0000"], "dt" : 2 },
                  { "rgb" : ["#aa0000", "#770000"], "dt" : 2 } ]
      },
      { "name" : "red",
        "data" : [ {"rgb" : ["#ff0000"], "dt" : 0 }]
      }
  ]
}
```

Notes
---

* From some initial tests, a minute's worth of video is ~31Mb. This means that about 24 hours of straight recording will fill up approximately 43Gb worth.
* I don't want the RPi to automatically connect to the internet so there should be an option to export to a USB drive
* There should be a watermark of 10% free space before it starts deleting old videos

TODO
---

* Hook up WS2812 modules and provide program on startup to loop through whichever light cycle is wanted. I'm going to try for a text file in a known location that will provide configuration information on which colors and cycles to run through.
* Start recording on startup
* Provide access to USB
* Provide program for data copy

References
---

* [Infrared Bird Box](https://projects.raspberrypi.org/en/projects/infrared-bird-box)
* [Focus Raspberry Pi Camera](https://www.jeffgeerling.com/blog/2017/fixing-blurry-focus-on-some-raspberry-pi-camera-v2-models)
* [Raspbian](https://www.raspberrypi.org/downloads/raspbian/)
* [Installing Raspberry Pi Image](https://www.raspberrypi.org/documentation/installation/installing-images/linux.md)
* [Getting Started With PiCamera](https://projects.raspberrypi.org/en/projects/getting-started-with-picamera)
* [Raspberry Pi PWM tutorial](https://circuitdigest.com/microcontroller-projects/raspberry-pi-pwm-tutorial)
* [WS2812 RGB Raspberry Pi Tutorial](https://tutorials-raspberrypi.com/connect-control-raspberry-pi-ws2812-rgb-led-strips/)
