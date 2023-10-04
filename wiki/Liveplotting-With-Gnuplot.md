Liveplotting with Gnuplot
===

`liveplot.gnuplot`

```
set view map
set tic scale 0
splot 'map.gp' matrix with image
pause 1
reread
```

`gen-map`
```
#!/usr/bin/python3
import os, time, random
n_col, n_row = 128, 128
while True:
  with open("map.tmp", "w") as fp:
    for _col in range(n_col):
      line = []
      for _row in range(n_row):
        line.append( str(random.random()) )
      fp.write(" ".join(line) + "\n")
  os.replace("map.tmp", "map.gp")
  time.sleep(1)
```

###### 2023-09-28
