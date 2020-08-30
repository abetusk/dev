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

def _printg(v, z_up = 10.0, z_down = 0.0):
  if len(v)==0: return
  print("G1 Z" + _s(z_up))
  print("G0 X" + _s(v[0][0]) + " Y" + _s(v[0][1]))
  print("G1 Z" + _s(z_down))
  for ii in range(len(v)):
    print( "G1 X" + _s(v[ii][0]) + " Y" + _s(v[ii][1]) )
  print("G1 Z" + _s(z_up))


def _s(x):
  return "{:.8f}".format(x)

_NX = 4
_NY = 4

cx = 0.0
cy = 0.0

pitch_x = 5.0
pitch_y = 5.0

hole_r = 1.0
out_r = 2.0

def isolation_hole():

  for _idx_x in range(_NX):
    for _idx_y in range(_NY):
      x = float(_idx_x) * pitch_x + cx
      y = float(_idx_y) * pitch_y + cy

      _printg(_circle(out_r, x, y))
      print()

      #_printv(_circle(hole_r, x, y))
      #print()

def drill_hole():

  z_up = 10.0

  z_c = z_up
  depth = -5.01
  delz = -0.5

  for _idx_x in range(_NX):
    for _idx_y in range(_NY):
      x = float(_idx_x) * pitch_x + cx
      y = float(_idx_y) * pitch_y + cy


      z_c = z_up
      for ii in range(int(depth/delz)):
        z_d = delz*float(ii)
        _printg(_circle(hole_r, x, y), z_c, z_d)
        print()

        z_c = z_d

def drill_outline():

  margin = out_r/2.0 + 3

  min_x = 0.0 - margin
  min_y = 0.0 - margin

  max_x = float(_NX-1) * pitch_x + 2*margin
  max_y = float(_NY-1) * pitch_y + 2*margin

  v = []
  v.append( [ min_x, min_y ] )
  v.append( [ max_x, min_y ] )
  v.append( [ max_x, max_y ] )
  v.append( [ min_y, max_y ] )
  v.append( [ min_x, min_y ] )


  z_up = 10.0

  z_c = z_up
  depth = -5.01
  delz = -0.5

  z_c = z_up
  for ii in range(int(depth/delz)):
    z_d = delz*float(ii)
    _printg(v, z_c, z_d)
    print()

    z_c = z_d


#isolation_hole()
#drill_hole()
#drill_outline()

