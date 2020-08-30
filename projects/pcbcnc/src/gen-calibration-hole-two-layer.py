#!/usr/bin/python3
#
# License: CC0
#

import sys
import math
import random

START = [0.0, 0.0]
NSTRIPE = 5
del_range_mm = [0.2, 1.0, 0.05]

def _circle(r,cx=0.0, cy=0.0, n=32):
  v = []
  for ii in range(n):
    a = 2.0 * math.pi * (float(ii) / float(n))
    v.append( [r*math.cos(a) + cx, r*math.sin(a)  + cy] )
  v.append([cx + r,cy])
  return v

def _printv(v):
  for ii in range(len(v)):
    print( _s(v[ii][0]), _s(v[ii][1]) )

def _s(x):
  return "{:.8f}".format(x)

_NX = 10
_NY = 10

cx = 0.0
cy = 0.0

pitch_x = 5.0
pitch_y = 5.0

hole_r = 1.0
out_r = 2.0

for _idx_x in range(_NX):
  for _idx_y in range(_NY):
    x = float(_idx_x) * pitch_x + cx
    y = float(_idx_y) * pitch_y + cy

    _printv(_circle(out_r, x, y))
    print()

    _printv(_circle(hole_r, x, y))
    print()


