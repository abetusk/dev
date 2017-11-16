#!/bin/bash

for x in `ls source/*.JPG` ; do
  bn=`basename $x .JPG`
  #convert -chop 1792x1280 $x out/$bn.jpg
  convert -shave 256x256 $x processed/$bn.jpg

done
