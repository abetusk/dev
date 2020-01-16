#!/usr/bin/python

import sys
import grbl

run = True
verbose = True

z_ub = -5.0
z_lb = -8.0
fz = 1

xminmax = [-70.0, -15.0]
yminmax = [-70.0, -30.0]

dx = 10.0
dy = 10.0

if run:
  grbl.setup()

  grbl.send_initial_command("")

  if verbose: print "# homing..."
  x = grbl.send_command("$H")
  if verbose: print "# got:", x

  if verbose: print "# moving z to:", z_ub
  x = grbl.send_command("g0 z" + str(z_ub))
  if verbose: print "# got:", x
  var = grbl.wait_for_var_position('z', z_ub)
  if verbose: print "# got:", var

pnts = []
_y = yminmax[0]
while _y <= yminmax[1]:
  _x = xminmax[0]
  while _x <= xminmax[1]:
    pnts.append( [_x, _y] )
    _x += dx
  pnts.append( [xminmax[1], _y] )
  _y += dy

_y = yminmax[1]
_x = xminmax[0]
while _x <= xminmax[1]:
  pnts.append( [_x, _y] )
  _x += dx

for idx in range(len(pnts)):

  if verbose: print "# grid:", pnts[idx][0], pnts[idx][1]
  if run:

    x = grbl.send_command("g0 z" + str(z_ub))
    var = grbl.wait_for_var_position('z', z_ub)

    x = grbl.send_command("g0 x" + str(pnts[idx][0]) + " y" + str(pnts[idx][1]))
    var = grbl.wait_for_var_position('x', pnts[idx][0])
    var = grbl.wait_for_var_position('y', pnts[idx][1])

    if verbose: print "# height probe:", pnts[idx][0], pnts[idx][1], z_lb, fz
    x = grbl.send_command("g38.2 z" + str(z_lb) + " f" + str(fz))
    #if verbose: print "# got:", 
    lines = x.split("\n")
    vals = lines[0].split(":")[1].split(",")
    print "#", lines[0]
    print vals[0], vals[1], vals[2]

    sys.stdout.flush()

if run:

  x = grbl.send_command("g0 z" + str(z_ub))
  if verbose: print "# got:", x

  if verbose: print "# tearing down connection..."
  grbl.teardown()
