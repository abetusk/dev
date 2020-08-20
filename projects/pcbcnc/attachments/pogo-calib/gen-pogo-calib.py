#!/usr/bin/python3
#
# License: CC0
#

import numpy as np
import sys
import math

fn = 50

f_slow = 150.0
f_fast = 800.0

#drill_r = 1.0/2.0
drill_r = 0.8/2.0

screw_dx = 50.0
screw_dy = 150.0
screw_r = 5.0/2.0

platform_dx = 50.0
platform_dy = 50.0
platform_r = 2.0/2.0

join_dx = 50.0
join_dy = 75.0
join_r = 2.0/2.0

join1_dx = 50.0
join1_dy = 125.0
join1_r = 2.0/2.0

pogo_dx = 80.0
pogo_dy = 150.0
pogo_r = 1.01/2.0

zup = 10.0

zparam = [ 0.0, -6.01, -drill_r ]

def _circle(r,cx=0,cy=0):
  _res = []

  for idx in range(fn):
    a = 2.0 * math.pi * float(idx)/float(fn)
    _c = math.cos(a)
    _s = math.sin(a)

    x = cx + _c*r
    y = cy + _s*r
    _res.append( [x,y] )

  return _res

def _square(dx, dy, cx=0, cy=0):
  _res = []

  _res.append([-dx/2.0 + cx, -dy/2.0 + cy])
  _res.append([-dx/2.0 + cx,  dy/2.0 + cy])
  _res.append([ dx/2.0 + cx,  dy/2.0 + cy])
  _res.append([ dx/2.0 + cx, -dy/2.0 + cy])
  #_res.append([-dx/2.0 + cx, -dy/2.0 + cy])
  return _res

def _pp(v):
  for xy in v:
    print( "{:.4f}".format(xy[0]), "{:.4f}".format(xy[1]))

def _gprint(v, zv, zup=1.0):

  if len(v) == 0: return

  print("G0 X" + "{:.4f}".format(v[0][0]) + " Y" + "{:.4f}".format(v[0][1]) + " F{:.4f}".format(f_fast)  )

  for z in np.arange(zv[0], zv[1], zv[2]):

    print("G1 Z" + "{:.4f}".format(z) + " F{:.4f}".format(f_slow) )
    for xy in v:
      print("G1 X" + "{:.4f}".format(xy[0]) + " Y" + "{:.4f}".format(xy[1]) + " F{:.4f}".format(f_slow) )
    print("G1 X" + "{:.4f}".format(v[0][0]) + " Y" + "{:.4f}".format(v[0][1]) + " F{:.4f}".format(f_slow) )

  print("G1 Z" + "{:.4f}".format(zup) + " F{:.4f}".format(f_fast) )

#####
#####
#####

## init to good 'up' z state
##
print("G90")
print("G21")
print("G1Z" + "{:.4f}".format(zup) +  " F{:.4f}".format(f_slow)  )


## m5 screw holes
##
print("G1Z" + "{:.4f}".format(zup) + " F{:.4f}".format(f_slow)  )
print("")
v = _circle( screw_r - drill_r, -screw_dx/2.0, -screw_dy/2.0 )
_gprint(v, zparam)

print("G1Z" + "{:.4f}".format(zup) + " F{:.4f}".format(f_slow)  )
print("")
v = _circle( screw_r - drill_r, screw_dx/2.0, -screw_dy/2.0 )
_gprint(v, zparam)

print("G1Z" + "{:.4f}".format(zup) + " F{:.4f}".format(f_slow)  )
print("")
v = _circle( screw_r - drill_r,  screw_dx/2.0,  screw_dy/2.0 )
_gprint(v, zparam)

print("G1Z" + "{:.4f}".format(zup) + " F{:.4f}".format(f_slow)  )
print("")
v = _circle( screw_r - drill_r, -screw_dx/2.0,  screw_dy/2.0 )
_gprint(v, zparam)

## m2 platform holes
##
print("G1Z" + "{:.4f}".format(zup) + " F{:.4f}".format(f_slow)  )
print("")
v = _circle( platform_r - drill_r, -platform_dx/2.0, -platform_dy/2.0 )
_gprint(v, zparam)

print("G1Z" + "{:.4f}".format(zup) + " F{:.4f}".format(f_slow)  )
print("")
v = _circle( platform_r - drill_r, -platform_dx/2.0,  platform_dy/2.0 )
_gprint(v, zparam)

print("G1Z" + "{:.4f}".format(zup) + " F{:.4f}".format(f_slow)  )
print("")
v = _circle( platform_r - drill_r,  platform_dx/2.0,  platform_dy/2.0 )
_gprint(v, zparam)

print("G1Z" + "{:.4f}".format(zup) + " F{:.4f}".format(f_slow)  )
print("")
v = _circle( platform_r - drill_r, platform_dx/2.0,  -platform_dy/2.0 )
_gprint(v, zparam)

## m2 join holes
##
print("G1Z" + "{:.4f}".format(zup) + " F{:.4f}".format(f_slow)  )
print("")
v = _circle( join_r - drill_r, -join_dx/2.0, -join_dy/2.0 )
_gprint(v, zparam)

print("G1Z" + "{:.4f}".format(zup) + " F{:.4f}".format(f_slow)  )
print("")
v = _circle( join_r - drill_r, -join_dx/2.0,  join_dy/2.0 )
_gprint(v, zparam)

print("G1Z" + "{:.4f}".format(zup) + " F{:.4f}".format(f_slow)  )
print("")
v = _circle( join_r - drill_r,  join_dx/2.0,  join_dy/2.0 )
_gprint(v, zparam)

print("G1Z" + "{:.4f}".format(zup) + " F{:.4f}".format(f_slow)  )
print("")
v = _circle( join_r - drill_r, join_dx/2.0,  -join_dy/2.0 )
_gprint(v, zparam)

## m2 join1 holes
##
print("G1Z" + "{:.4f}".format(zup) + " F{:.4f}".format(f_slow)  )
print("")
v = _circle( join1_r - drill_r, -join1_dx/2.0, -join1_dy/2.0 )
_gprint(v, zparam)

print("G1Z" + "{:.4f}".format(zup) + " F{:.4f}".format(f_slow)  )
print("")
v = _circle( join1_r - drill_r, -join1_dx/2.0,  join1_dy/2.0 )
_gprint(v, zparam)

print("G1Z" + "{:.4f}".format(zup) + " F{:.4f}".format(f_slow)  )
print("")
v = _circle( join1_r - drill_r,  join1_dx/2.0,  join1_dy/2.0 )
_gprint(v, zparam)

print("G1Z" + "{:.4f}".format(zup) + " F{:.4f}".format(f_slow)  )
print("")
v = _circle( join1_r - drill_r, join1_dx/2.0,  -join1_dy/2.0 )
_gprint(v, zparam)


## pogo holes
##
print("G1Z" + "{:.4f}".format(zup) + " F{:.4f}".format(f_slow)  )
print("")
v = _circle( pogo_r - drill_r, -pogo_dx/2.0, 0.0)
_gprint(v, zparam)

print("G1Z" + "{:.4f}".format(zup) + " F{:.4f}".format(f_slow)  )
print("")
v = _circle( pogo_r - drill_r,  pogo_dx/2.0, 0.0)
_gprint(v, zparam)

print("G1Z" + "{:.4f}".format(zup) + " F{:.4f}".format(f_slow)  )
print("")
v = _circle( pogo_r - drill_r,  0.0, pogo_dy/2.0)
_gprint(v, zparam)

print("G1Z" + "{:.4f}".format(zup) + " F{:.4f}".format(f_slow)  )
print("")
v = _circle( pogo_r - drill_r,  0.0, -pogo_dy/2.0)
_gprint(v, zparam)

## no outline
##

## go back to good 'up' state
##
print("G1Z" + "{:.4f}".format(zup) + " F{:.4f}".format(f_slow)  )


