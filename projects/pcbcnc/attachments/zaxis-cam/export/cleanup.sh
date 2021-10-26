#!/bin/bash

fn="$1"
export RAPIDSPEED=8100
export CUTSPEED=200

if [[ "$fn" == "" ]] ; then
  echo "provide file"
  exit 1
fi

b=`basename $fn .svg`

svg2ngc $fn

echo "G0 F$RAPIDSPEED" > ${b}-cleaned.ngc
echo "G1 F$CUTSPEED" >> ${b}-cleaned.ngc

ngc_translate -f ${b}.ngc -x 15 -y 15 -S -U | \
  sed 's/F800/ F'$CUTSPEED'/g' | \
  sed 's/S/ S/g' >> ${b}-cleaned.ngc

mv ${b}-cleaned.ngc ${b}.ngc

#cat ${b}-cleaned.ngc | \
#  sed 's/F'$CUTSPEED'/F200/g' | \
#  sed 's/S1.0/S0.4/g' > ${b}.ngc


