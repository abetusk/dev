### Video Cropping

`-qscale` sets the compression level (?) (higher is more compression).
`crop` is width, height, start x, start y.

```bash
ffmpeg -i inp.mp4 -qscale 10  -filter:v "crop=in_w:in_h-63:0:63" out.mp4
```


###### 2015-11-05
