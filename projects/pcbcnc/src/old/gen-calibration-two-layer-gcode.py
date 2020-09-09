#!/usr/bin/python3
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

def left_bottom_half_circle( inner_r, outer_r, hole_r = -1.0, cx = 0.0, cy = 0.0 ):

  if hole_r < 0.0: hole_r = (outer_r - inner_r) / 4.0
  w = outer_r - inner_r
  n = 100

  start_a = math.pi / 2.0
  del_a = math.pi

  for ii in range(n):
    da = del_a * float(ii) / float(n-1)
    a = start_a + da
    x = inner_r * math.cos( a ) + cx
    y = inner_r * math.sin( a ) + cy
    print( _s(x), _s(y) )

  print( _s(0.0 + cx), _s(-inner_r + cy) )
  print( _s(w + cx), _s(-inner_r + cy) )
  print( _s(w + cx), _s(-outer_r + cy) )
  print( _s(0.0 + cx), _s(-outer_r + cy) )

  for ii in range(n):
    da = del_a * (1.0 - (float(ii) / float(n-1)))
    a = start_a + da
    x = outer_r * math.cos( a ) + cx
    y = outer_r * math.sin( a ) + cy
    print( _s(x), _s(y) )
  print()

  print( _s(0.0 + cx), _s(outer_r + cy) )
  print( _s(0.0 + cx), _s(inner_r + cy) )

  print()

  hole_cx = w/2.0
  hole_cy = -inner_r - ((outer_r  - inner_r) / 2.0)

  for ii in range(n):
    _x = hole_cx + hole_r*math.cos(2.0 * math.pi * float(ii) / float(n-1)) + cx
    _y = hole_cy + hole_r*math.sin(2.0 * math.pi * float(ii) / float(n-1)) + cy
    print( _s(_x), _s(_y) )
  print()


def right_top_half_circle( inner_r, outer_r, hole_r = -1.0, cx = 0.0, cy = 0.0 ):

  if hole_r < 0.0: hole_r = (outer_r - inner_r) / 4.0
  w = outer_r - inner_r
  n = 100

  start_a = -math.pi / 2.0
  del_a = math.pi

  for ii in range(n):
    da = del_a * float(ii) / float(n-1)
    a = start_a + da
    x = inner_r * math.cos( a ) + cx
    y = inner_r * math.sin( a ) + cy
    print( _s(x), _s(y) )

  print( _s(0.0 + cx), _s(inner_r + cy) )
  print( _s(-w + cx), _s(inner_r + cy) )
  print( _s(-w + cx), _s(outer_r + cy) )
  print( _s(0.0 + cx), _s(outer_r + cy) )

  for ii in range(n):
    da = del_a * (1.0 - (float(ii) / float(n-1)))
    a = start_a + da
    x = outer_r * math.cos( a ) + cx
    y = outer_r * math.sin( a ) + cy
    print( _s(x), _s(y) )
  print()

  print( _s(0.0 + cx), _s(-inner_r + cy) )
  print( _s(0.0 + cx), _s(-outer_r + cy) )
  print()

  hole_cx = cx - w/2.0
  hole_cy = cy + inner_r + ((outer_r  - inner_r) / 2.0)

  for ii in range(n):
    _x = hole_cx + hole_r*math.cos(2.0 * math.pi * float(ii) / float(n-1))
    _y = hole_cy + hole_r*math.sin(2.0 * math.pi * float(ii) / float(n-1))
    print( _s(_x), _s(_y) )
  print()


def cross_circle( r_ring, n_ring , w_space, cx=0, cy=0):
  #w = r

  del_a = math.pi

  _n = 32
  #w = 1.5
  w = w_space

  inner_r_prev = 0
  outer_r_prev = 0

  delr = r_ring + w_space
  delr = 1.5 + r_ring

  for _ring in range(n_ring):

    start_a = math.pi/2.0
    tx = -w/2
    ty = 0
    #inner_r = w/2.0 + w*float(_ring)
    #outer_r = w/2.0 + w*float(_ring) + r_ring
    inner_r = 1.0 + delr*float(_ring)
    outer_r = 1.0 + delr*float(_ring) + r_ring

    # left middle line
    #
    if _ring > 0:
      print( _s(tx), _s(ty + outer_r_prev ))

    # left inner circle
    #
    for ii in range(_n):
      da = del_a * float(ii) / float(_n-1)
      a = start_a + da
      x = inner_r * math.cos( a ) + tx
      y = inner_r * math.sin( a ) + ty
      print( _s(x), _s(y) )
    if _ring == 0:
      print( _s(tx), _s(ty+inner_r))
    else:
      print( _s(tx), _s(ty - outer_r_prev ))
    print()

    # left outer circle
    #
    start_a = -math.pi/2.0
    for ii in range(_n):
      da = -del_a * float(ii) / float(_n-1)
      a = start_a + da
      x = outer_r * math.cos( a ) + tx
      y = outer_r * math.sin( a ) + ty
      print( _s(x), _s(y) )
    #if (_ring > 0) and ((_ring+1) < _n):
    #  print( _s(tx), _s(ty + inner_r) )
    print()

    ###
    ###
    tx = w/2
    ty = 0

    # right middle line
    #
    if _ring > 0:
      print( _s(tx), _s(ty - outer_r_prev ))

    # right inner cirlce
    #
    #inner_r = w/2.0 + w*float(_ring)
    #inner_r = w*float(_ring)
    #inner_r = delr*float(_ring)
    for ii in range(_n):
      da = del_a * float(ii) / float(_n-1)
      a = start_a + da
      x = inner_r * math.cos( a ) + tx
      y = inner_r * math.sin( a ) + ty
      print( _s(x), _s(y) )
    if _ring == 0:
      print( _s(tx), _s(ty-inner_r))
    else:
      print( _s(tx), _s(ty + outer_r_prev ))
    print()
    print()

    # right outer circle
    #
    start_a = math.pi/2.0
    for ii in range(_n):
      da = -del_a * float(ii) / float(_n-1)
      a = start_a + da
      x = outer_r * math.cos( a ) + tx
      y = outer_r * math.sin( a ) + ty
      print( _s(x), _s(y) )
    #if (_ring > 0) and ((_ring+1) < _n):
    #  print( _s(tx), _s(ty + inner_r) )
    print()

    inner_r_prev = inner_r
    outer_r_prev = outer_r

    if _ring == (n_ring-1):
      print( _s(-w/2), _s(outer_r) )
      print( _s( w/2), _s(outer_r) )
      print()
      print( _s(-w/2), _s(-outer_r) )
      print( _s( w/2), _s(-outer_r) )
      print()

  hole_r = 0.25
  for _ring in range(n_ring):
    sx = 0.0
    #sy = w/2.0 + w*float(_ring) + r_ring/2
    #sy = w*float(_ring) + r_ring/2
    sy = 1.0 + delr*float(_ring) + r_ring/2.0
    v = _circle(hole_r, sx,sy)
    _printv(v)
    print()

    v = _circle(hole_r, sx,-sy)
    _printv(v)
    print()

_N = 8

r_ring = 3.0
#w = 3.0
r = 1.0
delr = 1.5
dr = delr * r_ring

cross_circle(r_ring, _N,  r_ring)
#sys.exit()

for ii in range(_N):


  left_bottom_half_circle(r, r+r_ring, 0.25, -r_ring/2.0)
  right_top_half_circle(r, r+r_ring, 0.25, r_ring/2.0)

  r += dr
