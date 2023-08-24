#!/bin/bash


for fn in `ls data/lwp-d*_i1000.gp | sort -V` ; do
  d=`echo "$fn" | sed 's/.*d\([0-9][0-9]*\)_i.*/\1/'`
  n=`wc -l $fn | cut -f 1 -d' '`
  nz=`grep -i -P ' 0\.e' $fn | wc -l | cut -f1 -d' '`
  p=` echo "$nz / $n" | bc -l`
  echo $d $p
done
