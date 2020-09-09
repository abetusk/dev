#!/bin/bash
#
# License: CC0
#

pfx="$1"

if [[ "$pfx" == "" ]] ; then
  echo "provide input gcode file prefix"
  exit 1
fi


originx="-235"
originy="-195"

screw_start_dx="76"
screw_start_dy="63"

screw_dx="100"
screw_dy="121"

work_start_dx="11"
work_start_dy="23"


virtx=` echo "$originx + $screw_start_dx" | bc -l`
virty=` echo "$originy + $screw_start_dy" | bc -l`


sx=`echo "$virtx + $work_start_dx" | bc -l`
sy=`echo "$virty + $work_start_dy" | bc -l`

screw_x0="$virtx"
screw_x1=`echo "$virtx + $screw_dx" | bc -l`

screw_y0="$virty"
screw_y1=`echo "$virty + $screw_dy" | bc -l`



shiftx="0"
shifty=`echo "($screw_y1 + $screw_y0)" | bc -l`

ifn="${pfx}-top.ngc"
grecode -shift $sx $sy $ifn > $ifn.1
grecode -yflip $ifn.1 > $ifn.2
grecode -shift $shiftx $shifty $ifn.2 > $ifn.3
cp $ifn.3 fin-top.ngc

ifn="${pfx}-bot.ngc"
grecode -shift $sx $sy $ifn > $ifn.1
cp $ifn.1 fin-bot.ngc

rm -f bounds.ngc
echo "G1 Z10" > bounds.ngc
echo "G0 X$originx Y$originy" >> bounds.ngc
echo "G0 X$screw_x0 Y$screw_y0" >> bounds.ngc
echo "G0 X$screw_x1 Y$screw_y0" >> bounds.ngc
echo "G0 X$screw_x1 Y$screw_y1" >> bounds.ngc
echo "G0 X$screw_x0 Y$screw_y1" >> bounds.ngc
echo "G0 X$screw_x0 Y$screw_y0" >> bounds.ngc

cat bounds.ngc fin-top.ngc fin-bot.ngc > fin.ngc
#cat bounds.ngc fin-bot.ngc > fin.ngc


