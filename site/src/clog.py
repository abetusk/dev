#!/usr/bin/python3
#
# License: CC0
#
# To the extent possible under law, the person who associated CC0 with
# this project has waived all copyright and related or neighboring rights
# to this project.
# 
# You should have received a copy of the CC0 legalcode along with this
# work.  If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.
#

import sys
import math

for line in sys.stdin:
  xy = line.strip().split(" ")
  if len(xy) != 2: continue
  a = float(xy[0])
  b = float(xy[1])

  r = math.sqrt(a*a + b*b)
  lr = 0
  if math.fabs(r) > 0:
    lr = math.log(r)
  theta = math.atan2(b,a)
  #if lr<=0: continue;
  print(lr,theta)

