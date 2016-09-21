Screencasts
---

I've found `kazam` to work very well.

```bash
$ sudo apt-get install kazam
$ kazam
```

Screenshots
---

### Gimp

`File->Create->Screenshot`


### ImageMagick

```bash
$ import -window root screenshot.png
```


Animated Gifs
---

### ImageMagick

```bash
$ convert -delay 1 -layers optimize inp*.png anim.gif
```

Quick and dirty way to create animated Gifs from a window
---

```bash
$ winid=`xwininfo | grep -o 'Window id: [^ ]* ' | cut -f3 -d' '` ; echo $winid
```

Click on the window in question and make sure the portion of the
window you want to record is exposed.

```bash
$ for x in {1..10}
do
  import  -window $winid out$x.png
  sleep 0.1
done
```

Once the `out{1..10}.png` files are created, coalesce them into an animated Gif:

```bash
$ convert -delay 1 -layers optimize out*.png anim.gif
```

Using ImageMagick is sometimes slow.  Using `kazam` (and only capturing a window) will create an `mp4` file that can be exploded:

```bash
$ ffmpeg -i inp.mp4 pic%03d.jpg
$ for x in `ls pic*.jpg`
do
  mogrify -crop 1000x700+0+70 $x
done
$ convert -layers optimize pic*.jpg out.gif
```

Where `mogrify` alters the image file in place and `-crop` crops the top pixels (to get rid of the tabs and URL if it's a web browser, say).

Sometimes ImageMagick has a lot of issues when trying to create an animated Gif, especially if there are many frames.  Instead, you can use `ffmpeg` directly (see [SO](http://superuser.com/a/893031)):

```bash
$ palette="/tmp/palette.png"
$ filters="fps=15,scale=320:-1:flags=lanczos"
$ ffmpeg -i input.mp4 -vf "$filters,palettegen" -y $palette
$ ffmpeg -i input.mp4 -i $palette -lavfi "$filters [x]; [x][1:v] paletteuse" -y output.gif
```

`ffmpeg` can apparently also directly create (large) animated Gifs:

```bash
$ ffmpeg -i input.mp4 large_output.gif
```

To reduce the `large_output.gif`, `gifsicle` can be used:

```bash
$ gifsicle -O1 --loop large_output.gif > slim_output.gif
```

though `gifsicle` looks to have some problems compressing well.

To take a sub range of pictures from `gifsicle`, you can do something like:

```bash
$ gifsicle -U inp.gif '#50-73' > out50-73.gif
```

Where the `#` specifies the frame range and the `-U` (unoptimize) option is needed to get rid of artifacts that appear to happen when selecting from a mid range of frames.


**recommended workflow**

* capture with `kazam`
* use the above script to convert from `.mp4` to animated Gif with `ffmpeg`

###### 2015-11-01

