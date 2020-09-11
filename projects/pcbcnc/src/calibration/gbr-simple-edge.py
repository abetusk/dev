#!/usr/bin/python3
#
# License: CC0
#

import os, re, sys, math

MAX_ITER = 100
REMOVE_DUPLICATES = True
UNITS_SRC = "inch"
UNITS_DST = "mm"

# inch to mm
#
def _i2m(inch):
  return float(inch)*25.4

# mm to inch
#
def _m2i(mm):
  return float(mm)/25.4

# convert src unit to destination unit
#
def _u(x):
  _x = float(x)
  if UNITS_SRC != UNITS_DST:
    if UNITS_DST == "mm":
      _x = _i2m(_x)
    elif UNITS_DST == "inch":
      _x = _m2i(_x)
  return _x

# mm to units
#
def _m2u(x):
  if UNITS_DST == "mm":
    return float(x)
  else:
    return _m2i(float(x))

# inch to units
#
def _i2u(x):
  if UNITS_DST == "inch":
    return float(x)
  else:
    return _i2m(float(x))

# format float
#
def _s(x):
  return "{:.8f}".format(x)


Z_UP = _m2u(10)
Z_DOWN = _m2u(-2.5)
Z_STEP = _m2u(-0.4)
Z_ZERO = _m2u(0.0)

G0_SPEED = _m2u(800)
G1_SPEED = _m2u(50)

HOLE_R = _m2u(1.0/2.0)

TOOL_R = _m2u(0.8/2.0 )
fn = sys.argv[1]



fn = sys.argv[1]

f = [1.0, 1.0]

raw_coord = []
raw_icoord = []

with open(fn) as fp:
  for line in fp:

    m = re.match('%MO(..)\*%', line)
    if m:
      if m.group(1) == 'IN':
        UNITS_SRC = "inch"
      elif m.group(1) == 'MM':
        UNITS_SRC = 'mm'

    m = re.match('%FSLAX(\d)(\d)Y(\d)(\d)\*%', line)
    if m:
      f[0] = math.pow(10, -float(m.group(2)))
      f[1] = math.pow(10, -float(m.group(4)))

    m = re.match('^ *[gG]0?1X(\-?\d+)Y(\-?\d+)D\d+\*$', line)
    if m:
      ipos = [ int(m.group(1)), int(m.group(2)) ]
      fpos = [ _u(f[0] * float(ipos[0])), _u(f[1] * float(ipos[1])) ]

      if REMOVE_DUPLICATES:
        n = len(raw_icoord)
        if n>0:
          if (raw_icoord[n-1][0] == ipos[0]) and (raw_icoord[n-1][1] == ipos[1]):
            continue
      raw_icoord.append(ipos)
      raw_coord.append(fpos)


prv_z = Z_UP
cur_z = Z_UP

print("G0 Z" + _s(Z_UP))

print("G0 X" + _s(raw_coord[0][0]) + " Y" + _s(raw_coord[0][1]) + " F" + _s(G1_SPEED))

cur_z = Z_ZERO
print("G0 Z" + _s(cur_z) + " F" + _s(G0_SPEED))

while cur_z >= Z_DOWN:

  for idx,xy in enumerate(raw_coord):
    if idx==0:
      print("G1 Z" + _s(cur_z) + " F" + _s(G1_SPEED))
    print("G1 X" + _s(xy[0]) + " Y" + _s(xy[1]) + " F" + _s(G1_SPEED))

  prv_z = cur_z
  cur_z += Z_STEP


