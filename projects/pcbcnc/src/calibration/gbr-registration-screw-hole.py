#!/usr/bin/python3
#
# License: CC0
#

import re, sys, math

G1_SPEED = 25
G0_SPEED = 800

# format float
#
def _s(x):
  return "{:.8f}".format(x)


def _paramf(argv, idx, default=0.0):
  if idx < len(argv):
    return float(argv[idx])
  return default

sx = _paramf(sys.argv, 1)
sy = _paramf(sys.argv, 2)
dx = _paramf(sys.argv, 3)
dy = _paramf(sys.argv, 4)

z_plunge = _paramf(sys.argv, 5, -6.0)
z_zero = _paramf(sys.argv, 6, -5)
z_up = _paramf(sys.argv, 7, -1.0)

print("G1 Z" + _s(z_up) + " F" + _s(G1_SPEED))

def goto_plunge_raise(xy, _up = z_up, _plunge = z_plunge, _zero=z_zero):
  print("G0 X" + _s(xy[0]) + " Y" + _s(xy[1]) + " F" + _s(G0_SPEED))
  print("G0 Z" + _s(_zero))
  print("G1 Z" + _s(_plunge) + " F" + _s(G1_SPEED))
  print("G1 Z" + _s(_zero) + " F" + _s(G1_SPEED))
  print("G0 Z" + _s(_up))


goto_plunge_raise([sx,sy])
goto_plunge_raise([sx + dx,sy])
goto_plunge_raise([sx + dx,sy + dy])
goto_plunge_raise([sx,sy + dy])


