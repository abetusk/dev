#!/bin/bash

maxiter=100

flat="0.03125"

#sf=`echo '72/25.4' | bc -l`
sf=`echo '72/25.4' | bc -l`
isf=`echo '25.4/72' | bc -l`
workPreMul=2
iWorkPreMul=`echo "1.0 / $workPreMul" | bc -l`
C=`echo "10000 * $workPreMul" | bc -l`
#iC=`echo "(1.0 * $workPreMul )/($C * $sf)" | bc -l`
iC=`echo "(1.0 * $workPreMul )/($C)" | bc -l`
#toolR=` echo "0.25 * 25.4 / 2" | bc -l`
toolR=` echo "0.20 * 25.4 / 2" | bc -l`
toolRC=`echo "$toolR * $C / $workPreMul" | bc -l`
tmpfn=`mktemp`
tmpofn=`mktemp`

fnOutline="ig-robo_outline.eps"
fnInside="ig-robo_inside.eps"

##########
##########
##########

pstoedit -flat $flat -f gnuplot $fnOutline $fnOutline.gp
clipcli -F -x $C -s $fnOutline.gp > $tmpofn.0
clipcli -O 1 -R $toolRC -s $tmpofn.0 > $tmpofn.1

gp2ngc --preset maslow  --premul $iC -i $tmpofn.1 > $fnOutline.ngc

##########
##########
##########

pstoedit -flat $flat -f gnuplot $fnInside $fnInside.gp

nline=1
curiter=0
curRC="$toolRC"

while [[ "$nline" -gt 0 ]] && [[ "$curiter" -lt "$maxiter" ]] ; do
  clipcli -F -x $C -s $fnInside.gp > $tmpofn.0
  clipcli -R "-$curRC" -s $tmpofn.0 >> $tmpofn.1

  nline=`clipcli -R "-$curRC" -s $tmpofn.0 | sed 's/^ *//' | sed 's/ *$//' | grep -P -v '^$' | wc -l | cut -f1 -d' ' `
  curiter=`expr "$curiter" "+" "1"`
  curRC=`echo "$curRC  + ($toolRC * 2)" | bc -l`
done

gp2ngc --sort --premul $iC -i $tmpofn.1 --z-plunge -1 --z > $fnInside.ngc

##########
##########
##########

cat $fnInside.ngc $fnOutline.ngc > ig-fin.ngc

##########
##########
##########

rm -f $tmpfn $tmpofn $tmpofn.0 $tmpofn.1
