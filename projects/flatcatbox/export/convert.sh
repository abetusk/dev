#!/bin/bash

flat="0.03125"

sf=`echo '72/25.4' | bc -l`
isf=`echo '25.4/72' | bc -l`
workPreMul='1.0'
iWorkPreMul=`echo "1.0 / $workPreMul" | bc -l`
C=`echo "10000 * $workPreMul" | bc -l`
iC=`echo "(1.0 * $workPreMul )/($C)" | bc -l`

toolR=` echo "(1.25) / 2" | bc -l`
toolRC=`echo "$toolR * $C / $workPreMul" | bc -l`

tmpfn=`mktemp`
tmpofn=`mktemp`

zplunge=-4.0
zstep=`echo "$toolR/1.25" | bc -l`

fnOutline="flatcatbox-outline.eps"
fnInside="flatcatbox-interior.eps"
fnFold="flatcatbox-fold.eps"

##########
##########
##########

pstoedit -flat $flat -f gnuplot $fnOutline $fnOutline.gp
clipcli -F -x $C -s $fnOutline.gp > $tmpofn.0
clipcli -O 1 -R $toolRC -s $tmpofn.0 > $tmpofn.1

gp2ngc --z-plunge $zplunge  --z-step $zstep --tab-length 8 --tab-n 4 --slow 'F150' --rapid 'F800' --preset 3040 --premul $iC -i $tmpofn.1 > $fnOutline.ngc

##########
##########
##########

pstoedit -flat $flat -f gnuplot $fnInside $fnInside.gp

clipcli -F -x $C -s $fnInside.gp > $tmpofn.0
clipcli -O 1 -R "-$toolRC" -s $tmpofn.0 > $tmpofn.1

#fff
#gp2ngc --slow 'F150' --rapid 'F800' --sort --premul $iC -i $tmpofn.1 --z-plunge $zplunge --z > $fnInside.ngc

#gp2ngc --z --z-plunge $zplunge  --z-step $zstep --tab-length 8 --slow 'F150' --rapid 'F800' --preset 3040 --premul $iC -i $tmpofn.1 > $fnInside.ngc
gp2ngc --z --z-plunge $zplunge  --z-step $zstep --notab --slow 'F150' --rapid 'F800' --preset 3040 --premul $iC -i $tmpofn.1 > $fnInside.ngc
#gp2ngc --slow 'F150' --rapid 'F800' --sort --premul $iC -i $tmpofn.1 --z-plunge $zplunge --preset 3040 --tab-n 0 --z-step $zstep z > $fnInside.ngc

##########
##########
##########

#pstoedit -flat $flat -f gnuplot $fnFold $fnFold.gp
#egrep -v '^#' $fnFold.gp | \
#  tr '\t' ' ' | \
#  ./gpx.py $workPreMul | \
#  sed 's/^ *\(.*\)  *\(.*\) *$/G0Z5\nG0 X\1 Y\2\nG1Z'$zplunge'\nG0Z5\n/g' > $fnFold.ngc
#gp2ngc --z-plunge -1.5 --slow 'F150' --rapid 'F800' --sort -i xxx --z > $fnFold.ngc

##########
##########
##########

#cat $fnInside.ngc $fnOutline.ngc $fnFold.ngc > flatcatbox-fin.ngc.tmp
cat $fnInside.ngc $fnOutline.ngc > flatcatbox-fin.ngc.tmp

minx=`ngc_bounds flatcatbox-fin.ngc.tmp | grep min_x | cut -f2 -d' '`
miny=`ngc_bounds flatcatbox-fin.ngc.tmp | grep min_y | cut -f2 -d' '`

minx=`echo "(10 - $minx)" | bc -l`
miny=`echo "(10 - $miny)" | bc -l`

grecode -shift $minx $miny flatcatbox-fin.ngc.tmp > flatcatbox-fin.ngc

##########
##########
##########

rm -f $tmpfn $tmpofn $tmpofn.0 $tmpofn.1
