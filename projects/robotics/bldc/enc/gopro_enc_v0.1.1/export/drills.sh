#!/bin/bash


tfn=`mktemp`

./gbr-simple-drill.py --z-zero 0 --z-up 5 --z-down -3 -r 0.4 -f ../gerber/board.drl > board-cuts.ngc

gbr2ngc -P --no-comment ../gerber/board-Edge_Cuts.gbr > $tfn

#echo "G1 Z1" >> board-cuts.ngc

clipcli -F -x 100000  -s $tfn -O 1 -t union -X .000254 | \
  gp2ngc --z-raise 5 --z-plunge -3 --z-step -0.4 >> board-cuts.ngc


rm $tfn

