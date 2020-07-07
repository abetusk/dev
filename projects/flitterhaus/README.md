Flitter Haus
===

Notes
---

Enable camera:

```
raspi-config
```

After a reboot, test with:

```
raspivid -f
```

Setup dependencies:

```
apt-get install nginx libnginx-mod-rtmp ffmpeg
systemctl enable nginx
systemctl start nginx
```

Add to `/etc/nginx/nginx.conf`:

```
rtmp {
  server {
    listen 1935; # Listen on standard RTMP port
    chunk_size 4000;

    application show {
      live on;
      # Turn on HLS
      hls on;
      hls_type live;
      hls_path /var/www/html/hls/;
      hls_fragment 5s;
      hls_playlist_length 20s;
      
      # Turn on DASH      
      dash on;
      dash_path /var/www/html/dash/;
      dash_fragment 5s;
      dash_playlist_length 20s;

      # disable consuming the stream from nginx as rtmp
      deny play all;
    }
  }
}
```

Add to `/etc/fstab` so we don't hammer the SD card:

```
tmpfs /var/www/html/dash  tmpfs defaults,noatime,size=50m
tmpfs /var/www/html/hls tmpfs defaults,noatime,size=50m
```

Add to `/etc/nginx/sites-enabled/default`:

```
server {
  listen 8080;
  listen [::]:8080;

  sendfile off;
  tcp_nopush on;
  directio 512;
  default_type application/octet-stream;

  location / {
    add_header 'Cache-Control' 'no-cache';
    add_header 'Access-Control-Allow-Origin' '*' always;
    add_header 'Access-Control-Allow-Credentials' 'true';
    add_header 'Access-Control-Expose-Headers' 'Content-Length';

    if ($request_method = 'OPTIONS') {
      add_header 'Access-Control-Allow-Origin' '*';
      add_header 'Access-Control-Allow-Credentials' 'true';
      add_header 'Access-Control-Max-Age' 1728000;
      add_header 'Content-Type' 'text/plain charset=UTF-8';
      add_header 'Content-Length' 0;
      return 204;
    }

    types {
      application/dash+xml mpd;
      application/vnd.apple.mpegurl m3u8;
      video/mp2t ts;
    }

    root /var/www/html/;
  }
}
```

Add necessary JavaScript libraries:

```
mkdir -p /var/www/html/js
cd /var/www/html/js
wget 'https://reference.dashif.org/dash.js/latest/dist/dash.all.debug.js'
wget 'https://reference.dashif.org/dash.js/latest/dist/dash.all.min.js'
```

Create the HTML file `/var/www/html/vid.html`:

```
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <script src="js/dash.all.min.js"></script>
  </head>
  <body>
  <div>
      <video data-dashjs-player="" autoplay="" src="http://192.168.10.32/dash/pi.mpd" controls="true"></video>
  </div>
  </body>
</html>
```

---

Work in progress:

```
wget "https://vjs.zencdn.net/7.8.2/video-js.min.css"
wget "https://vjs.zencdn.net/7.8.2/video.min.js"
wget "https://unpkg.com/browse/@videojs/http-streaming@1.13.3/dist/videojs-http-streaming.js"
```

```
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>flitterhaus m3u8</title>
    <link href='css/video-js.min.css' rel='stylesheet'>
  </head>
  <script src='js/video.min.js'></script>
  <script src='js/videojs-http-streaming.js'></script>

  <body>
    <video-js id=vid1 width=600 height=300 class='vjs-default-skin' controls>
      <source src='http://192.168.10.32/hls/pi.m3u8' type='application/x-mpegURL'>
    </video-js>
  <script>
    var player = videojs('vid1');
		player.play();
  </script>
  </body>
</html>
```

---

Run `ffmpeg`:

```
v4l2-ctl --set-ctrl video_bitrate=300000
ffmpeg -f video4linux2 \
  -input_format h264 \
  -video_size 640x360 \
  -framerate 30 \
  -i /dev/video0  \
  -vcodec copy \
  -an -f flv rtmp://192.168.10.32/show/pi
```

or (?):

```
ffmpeg -f video4linux2 \
  -input_format h264 \
  -video_size 640x360 \
  -framerate 30 \
  -i /dev/video0 \
  -vcodec copy \
  -an -f flv \
  rtmp://localhost/show/pi
```

Replace `192.168.10.32` as necessary.

Point Firefox to `http://192.168.10.32/vid.html` and you should see a video feed, perhaps with a ~20s delay.

---

To turn off the LED on the camera, try:

```
echo disable_camera_led=1 >> /boot/config.txt
```

---

To use a custom DNS entry, add this to `/etc/dnsmasq.conf`:

```
echo 'address=/flitter.haus/192.168.10.32' >> /etc/dnsmasq.conf
```

And be sure to make an appropriate HTML page:

```
cat > /var/www/html/flittervid.html <<EOF
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>flitterhaus m3u8</title>
    <link href='css/video-js.min.css' rel='stylesheet'>
  </head>
  <script src='js/video.min.js'></script>
  <script src='js/videojs-http-streaming.js'></script>

  <body>
    <video-js id=vid1 width=600 height=300 class='vjs-default-skin' controls>
      <source src='http://flitter.haus/hls/pi.m3u8' type='application/x-mpegURL'>
    </video-js>
  <script>
    var player = videojs('vid1');
		player.play();
  </script>
  </body>
</html>
EOF
```

References
---

* [MDN: Live streaming web audio and video](https://developer.mozilla.org/en-US/docs/Web/Guide/Audio_and_video_delivery/Live_streaming_web_audio_and_video)
* [FFmpeg: StreamingGuide](https://trac.ffmpeg.org/wiki/StreamingGuide)
* [dash.js: Auto load single video src (example)](https://reference.dashif.org/dash.js/latest/samples/getting-started/auto-load-single-video-src.html)
* [dash.js: Dash.js Samples](https://reference.dashif.org/dash.js/latest/samples/index.html)
* [GitHub: dash.js](https://github.com/Dash-Industry-Forum/dash.js)
* [Ben's Place: Raspberry Pi Streaming Camera](https://www.hardill.me.uk/wordpress/2020/05/18/raspberry-pi-streaming-camera/)
* [Ben's Place: Streaming Camera to Chromecast](https://www.hardill.me.uk/wordpress/2020/05/03/streaming-camera-to-chromecast/)

License
---

CC0


