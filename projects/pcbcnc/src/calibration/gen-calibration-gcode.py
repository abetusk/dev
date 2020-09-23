#!/usr/bin/python
#

import sys
import math
import random

START = [0.0, 0.0]
NSTRIPE = 5
del_range_mm = [0.2, 1.0, 0.05]


def gen_pattern( start_xy, nstripe, w, zup=1.0, zdown=-1.0, alg="in-order"):

  dl = 2*(nstripe+1)*w
  ds = float(nstripe-1)*w

  print "G0 Z" + str(zup)
  print "G0 X" + str(start_xy[0]) + " Y" + str(start_xy[1])
  print "G1 Z" + str(zdown)

  _x = start_xy[0] + dl
  _y = start_xy[1]
  print "G1 X" + str(_x) + " Y" + str(_y)

  _x = start_xy[0] + dl
  _y = start_xy[1] + dl
  print "G1 X" + str(_x) + " Y" + str(_y)

  _x = start_xy[0]
  _y = start_xy[1] + dl
  print "G1 X" + str(_x) + " Y" + str(_y)

  _x = start_xy[0]
  _y = start_xy[1]
  print "G1 X" + str(_x) + " Y" + str(_y)

  #

  print "G0 Z" + str(zup)

  _x = start_xy[0] + dl/2
  _y = start_xy[1]
  print "G0 X" + str(_x) + " Y" + str(_y)
  print "G1 Z" + str(zdown)
  _x = start_xy[0] + dl/2
  _y = start_xy[1] + dl
  print "G1 X" + str(_x) + " Y" + str(_y)

  #

  print "G0 Z" + str(zup)

  _x = start_xy[0]
  _y = start_xy[1] + dl/2
  print "G0 X" + str(_x) + " Y" + str(_y)
  print "G1 Z" + str(zdown)
  _x = start_xy[0] + dl
  _y = start_xy[1] + dl/2
  print "G1 X" + str(_x) + " Y" + str(_y)

  print "G0 Z" + str(zup)

  ###

  calib_lines = []

  # lower left
  #
  for idx in range(nstripe):
    _line = []

    _x = start_xy[0] + w + float(idx)*w
    _y = start_xy[1] + w
    _line.append([ _x, _y])

    _x = start_xy[0] + w + float(idx)*w
    _y = start_xy[1] + w + ds
    _line.append([ _x, _y])

    calib_lines.append(_line)

  # lower right
  #
  for idx in range(nstripe):
    _line = []

    _x = start_xy[0] + (ds + 3*w)
    _y = start_xy[1] + w + float(idx)*w
    _line.append([ _x, _y])

    _x = start_xy[0] + (ds + 3*w) + ds
    _y = start_xy[1] + w + float(idx)*w
    _line.append([ _x, _y])

    calib_lines.append(_line)

  # upper left
  #
  for idx in range(nstripe):
    _line = []

    _x = start_xy[0] + w
    _y = (ds + 3*w) + start_xy[1] + float(idx)*w
    _line.append([ _x, _y])

    _x = start_xy[0] + w + ds
    _y = (ds + 3*w) + start_xy[1] + float(idx)*w 
    _line.append([ _x, _y])

    calib_lines.append(_line)

  # upper right
  #
  for idx in range(nstripe):
    _line = []

    _x = (ds + 2*w) + start_xy[0] + w + float(idx)*w
    _y = (ds + 2*w) + start_xy[1] + w
    _line.append([ _x, _y])

    _x = (ds + 2*w) + start_xy[0] + w + float(idx)*w
    _y = (ds + 2*w) + start_xy[1] + w + ds
    _line.append([ _x, _y])

    calib_lines.append(_line)

  if alg == "in-order":
    pass
  elif alg == "random":
    perm = []
    n = len(calib_lines)
    for idx in range(n):
      perm.append(idx)
    for idx in range(n):
      _i = random.randrange(idx,n)
      _t = perm[idx]
      perm[idx] = perm[_i]
      perm[_i] = _t

    _res = []
    for idx in range(n):
      _res.append(calib_lines[perm[idx]])

    calib_lines = _res

  for idx in range(len(calib_lines)):

    _line = calib_lines[idx]

    print "G0 Z" + str(zup)

    _x = _line[0][0]
    _y = _line[0][1]
    print "G0 X" + str(_x) + " Y" + str(_y)
    print "G1 Z" + str(zdown)

    _x = _line[1][0]
    _y = _line[1][1]
    _line.append([ _x, _y])
    print "G1 X" + str(_x) + " Y" + str(_y)


  print "G0 Z" + str(zup)

m = int( math.ceil((del_range_mm[1] - del_range_mm[0]) / (del_range_mm[2])) )

v = int( math.ceil(math.sqrt(m)) )

n_x = v
n_y = int( math.ceil(m / v))

_fx = 0.0
_fy = 0.0

_idx_x = 0
_idx_y = 0
for idx in range(m):
  if (idx>0) and ((idx%v)==0):
    _idx_y += 1
    _idx_x = 0
    _fx = 0.0
  #print _idx_x, _idx_y
  _idx_x += 1

  w = del_range_mm[0] + del_range_mm[2]*idx
  #dl = 2.0*((float(NSTRIPE)+3.0) * w)
  dl = 2.0*((float(NSTRIPE)+2.0) * w)

  gen_pattern( [ START[0] + _fx, START[1] + _fy ], NSTRIPE, w, 1, -1, "random")


  #print w, dl, _fx, _fy

  _fx += dl
  if ((idx+1)%v)==0:
    _fy += dl


