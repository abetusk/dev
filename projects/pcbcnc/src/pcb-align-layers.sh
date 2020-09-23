#!/bin/bash
#
# License: CC0
#

#
# Order of operations:
#
# * cut the registartion screw holes, if need be (tool 3.175mm say)
# ** tool change to isolation bit
# * isolation route 'bot' layer ("fin-bot.ngc")
# * flip board
# * isolation route 'top' layer ("fin-top.ngc")
# ** tool change to 0.8mm 2flute
# * drill holes ("fin-drill.ngc")
# * cut edges ("fin-edge.ngc")
# 

pfx="$1"

if [[ "$pfx" == "" ]] ; then
  echo "provide input gcode file prefix"
  exit 1
fi


edge_toolr="0.4"
drill_toolr="0.4"
iso_toolr_inch=`echo "0.2/(25.4*2)" | bc -l`

originx="-199"
originy="-199"

screw_start_dx="109"
screw_start_dy="0"

screw_dx="90"
screw_dy="80"

work_start_dx="20"
work_start_dy="20"


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

gbr2ngc -M -r $iso_toolr_inch ${pfx}-F_Cu.gtl -o ${pfx}-top.ngc

ifn="${pfx}-top.ngc"
grecode -shift $sx $sy $ifn > $ifn.1
grecode -yflip $ifn.1 > $ifn.2
grecode -shift $shiftx $shifty $ifn.2 > $ifn.3
cp $ifn.3 fin-top.ngc

gbr2ngc -M -r $iso_toolr_inch ${pfx}-B_Cu.gbl -o ${pfx}-bot.ngc

ifn="${pfx}-bot.ngc"
grecode -shift $sx $sy $ifn > $ifn.1
cp $ifn.1 fin-bot.ngc

./calibration/gbr-simple-edge.py ${pfx}-Edge_Cuts.gbr > ${pfx}-edge.ngc
ifn="${pfx}-edge.ngc"
grecode -shift $sx $sy $ifn > $ifn.1
grecode -yflip $ifn.1 > $ifn.2
grecode -shift $shiftx $shifty $ifn.2 > $ifn.3
cp $ifn.3 fin-edge.ngc

./calibration/gbr-simple-drill.py -f ${pfx}.drl > ${pfx}-drill.ngc
ifn="${pfx}-drill.ngc"
grecode -shift $sx $sy $ifn > $ifn.1
grecode -yflip $ifn.1 > $ifn.2
grecode -shift $shiftx $shifty $ifn.2 > $ifn.3
cp $ifn.3 fin-drill.ngc



rm -f bounds.ngc
echo "G1 Z10" > bounds.ngc
echo "G0 X$originx Y$originy" >> bounds.ngc
echo "G0 X$screw_x0 Y$screw_y0" >> bounds.ngc
echo "G0 X$screw_x1 Y$screw_y0" >> bounds.ngc
echo "G0 X$screw_x1 Y$screw_y1" >> bounds.ngc
echo "G0 X$screw_x0 Y$screw_y1" >> bounds.ngc
echo "G0 X$screw_x0 Y$screw_y0" >> bounds.ngc

#cat bounds.ngc fin-top.ngc fin-bot.ngc > fin.ngc
cat bounds.ngc fin-top.ngc fin-bot.ngc fin-edge.ngc fin-drill.ngc > fin.ngc
#cat bounds.ngc fin-bot.ngc > fin.ngc


