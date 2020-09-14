#!/usr/bin/python
#
# simple inverse distance interpolation
#
# pcbcnc
# Copyright (C) 2020 abetusk
# 
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
# 
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Affero General Public License for more details.
# 
# You should have received a copy of the GNU Affero General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.
#

import sys
import os
import numpy
import random
import getopt
import re
import scipy
import numpy as np
from scipy.interpolate import griddata
import grbl
from termcolor import colored, cprint


#HEIGHT_MAP_COUNT = 5
HEIGHT_MAP_COUNT = 1
G1_SPEED = 5
G0_SPEED = 12

G1_SPEED_Z = 5
G0_SPEED_Z = 12

unit = "mm"
cur_x, cur_y, cur_z  = 0, 0, 0
z_pos = 'up'

DEFAULT_FEED_RATE = G1_SPEED
DEFAULT_SPEED_RATE = G0_SPEED


dry_run = False

# The copper layer is reported to be
# (https://www.amazon.com/gp/product/B01MCVLDDZ)
#
# 18 um ~ 0.000708661 inch
# so around 1 mil

z_threshold = 0.0
#z_plunge_inch = -0.004
z_plunge_inch = -0.0015
#z_plunge_inch = -0.002
z_plunge_mm = z_plunge_inch * 25.4

output = None
verbose = True

do_homing = True

def usage(ofp = sys.stdout):
  ofp.write( "\nDo a height probe, interploate GCode file then execute job\n")
  ofp.write( "\nusage:\n")
  ofp.write( "  -g <gcode file>     gcode file\n")
  ofp.write( "  [-m <height map>]   height map\n")
  ofp.write( "  [-O <out height>]   output height map file (default stdout)\n")
  ofp.write( "  [-D]                dry run (do not connect to GRBL)\n")
  ofp.write( "  [-z <threshold>]    z threshold (default to " + str(z_threshold) + ")\n")
  ofp.write( "  [-p <zplunge>]      amount under height sensed part to plunge (default " + str(z_plunge_mm) + "mm)\n")
  ofp.write( "  [-no-homing]        don't execute homing operation\n")
  ofp.write( "  [-h|--help]         help (this screen)\n")
  ofp.write( "\n")

gcode_file = None
height_map_file = None
out_height_map_file = None


try:
  opts, args = getopt.getopt(sys.argv[1:], "hm:g:z:Dp:O:", ["help", "output=", "no-homing"])
except getopt.GetoptError, err:
  print str(err)
  usage()
  sys.exit(2)


for o, a in opts:
  if o == "-g":
    gcode_file = a
  elif o in ("-h", "--help"):
    usage(sys.stdout)
    sys.exit(0)
  elif o == "-m":
    height_map_file = a
  elif o == "-z":
    z_threshold = float(a)
  elif o == "-p":
    z_plunge_mm = float(a)
  elif o == "-D":
    dry_run = True
  elif o == "-O":
    out_height_map_file = a
  elif o == "--no-homing":
    do_homing=False
  else:
    assert False, "unhandled option"

if gcode_file is None:
  sys.stderr.write("Provide gcode file\n")
  usage(sys.stderr)
  sys.exit(-1)

pnts = []
pnts_xy = []
pntz_z = []

def read_gcode_file(gcode_filename):
  cur_x = 0.0
  cur_y = 0.0

  xvalid = False
  yvalid = False

  res = {
    "lines":[],
    "status":"init",
    "error":"",
    "min_x":0.0,
    "min_y":0.0,
    "max_x":0.0,
    "max_y":0.0
  }
  lines = []
  with open(gcode_filename, "r") as gc:
    for line in gc:
      line = line.strip()
      line = line.rstrip('\n')
      res["lines"].append(line)

      m = re.match('^\s*(\(|;)', line)
      if m: continue

      m = re.match('.*[xX]\s*(-?\d+(\.\d+)?)', line)
      if m:
        cur_x = float(m.group(1))

        if not xvalid:
          res["min_x"] = cur_x
          res["max_x"] = cur_x
        xvalid = True
        if cur_x < res["min_x"]: res["min_x"] = cur_x
        if cur_x > res["max_x"]: res["max_x"] = cur_x

      m = re.match('.*[yY]\s*(-?\d+(\.\d+)?)', line)
      if m:
        cur_y = float(m.group(1))

        if not yvalid:
          res["min_y"] = cur_y
          res["max_y"] = cur_y
        yvalid = True
        if cur_y < res["min_y"]: res["min_y"] = cur_y
        if cur_y > res["max_y"]: res["max_y"] = cur_y

    res["status"] = "ok"
    return res

def interpolate_gcode(gcode, pnts_xy, pnts_z, _feed=DEFAULT_FEED_RATE, _speed=DEFAULT_SPEED_RATE):
  unit = "mm"
  cur_x, cur_y, cur_z  = 0, 0, 0
  z_pos = 'up'
  z_pos_prv = z_pos

  z_threshold = 0.0

  lines = []

  z_leeway = 1
  z_ub = pnts_z[0]

  g1_feed = _feed
  g0_feed = _speed

  for idx in range(len(pnts_z)):
    if z_ub < pnts_z[idx]: z_ub = pnts_z[idx]
  z_ub += z_leeway

  for line in gcode["lines"]:
    line = line.strip()
    is_move = 0

    l = line.rstrip('\n')

    # skip comments
    # assumes comments encased in parens all on one line 
    #
    m = re.match('^\s*(\(|;)', l)

    if m:
      lines.append(l)
      continue

    m = re.match('^\s*[gG]\s*(0*\d*)([^\d]|$)', l)
    if m:
      tmp_mode = m.group(1)
      if re.match('^0*20$', tmp_mode):
        unit = "inch"
      elif re.match('^0*21$', tmp_mode):
        unit = "mm"

    m = re.match('^\s*[gG]\s*(0*[01])[^\d](.*)', l)

    if m:
      g_mode = m.group(1)
      l = m.group(2)

    m = re.match('.*[xX]\s*(-?\d+(\.\d+)?)', l)
    if m:
      is_move = 1
      cur_x = m.group(1)

    m = re.match('.*[yY]\s*(-?\d+(\.\d+)?)', l)
    if m:
      is_move = 1
      cur_y = m.group(1)

    m = re.match('.*[zZ]\s*(-?\d+(\.\d+)?)', l)
    if m:
      is_move = 1
      cur_z = m.group(1)

      if ( float(cur_z) >= z_threshold ):
        z_pos = 'up'
      else:
        z_pos = 'down'

    if is_move and (not g_mode):
      return None

    if not is_move:
      lines.append(l)
      continue

    if (z_pos == 'up'):
      #lines.append("G" + str(g_mode) + " Z{0:.8f}".format(z_ub))
      lines.append("G1 Z{0:.8f}".format(z_ub) + " F{0:.8f}".format(g1_feed))
    elif (z_pos == 'down'):

      interpolated_z = griddata(pnts_xy, pnts_z, (cur_x, cur_y), method='linear')

      if np.isnan(interpolated_z):
        sys.stderr.write("ERROR: NaN at "  + str(cur_x) + " " + str(cur_y))
        sys.stdout.write("ERROR: NaN at "  + str(cur_x) + " " + str(cur_y))
        sys.stderr.flush()
        sys.stdout.flush()
        sys.exit(-5)

      if unit == "inch":
        z_plunge = z_plunge_inch
      elif unit == "mm":
        z_plunge = z_plunge_mm
      else:
        #print "ERROR: unit improperly set"
        return None

      interpolated_z += z_plunge

      x_f = float(cur_x)
      y_f = float(cur_y)

      if z_pos_prv == "up":
        lines.append("G0 X{0:.8f}".format(x_f) + " Y{0:.8f}".format(y_f) +  " Z{0:.8f}".format(z_ub) + " F{0:.8f}".format(g0_feed))

      #print "G" + g_mode, "X{0:.8f}".format(x_f), "Y{0:.8f}".format(y_f), "Z{0:.8f}".format(interpolated_z)
      #lines.append("G" + str(g_mode) +  " X{0:.8f}".format(x_f) + " Y{0:.8f}".format(y_f) +  " Z{0:.8f}".format(interpolated_z))
      lines.append("G" + str(g_mode) +  " X{0:.8f}".format(x_f) + " Y{0:.8f}".format(y_f) +  " Z{0:.8f}".format(interpolated_z) + " F{0:.8f}".format(g1_feed))

    z_pos_prv = z_pos

  return lines

_gc = read_gcode_file(gcode_file)

#pnts = []
height_pnts = []

if not dry_run:
  grbl.setup("/dev/ttyUSB0")
  grbl.send_initial_command("")

if height_map_file is not None:
  with open(height_map_file, "r") as fp:
    for line in fp:
      line = line.strip()
      if len(line)==0: continue
      if line[0] == '#': continue
      v = line.split()

      pnts.append( [ float(v[0]), float(v[1]), float(v[2]) ] )

else:

  #if dry_run:
  #  sys.stderr.write("cannot probe height when in dry run (provide height map file if you want to test this)\n")
  #  sys.exit(-1)

  grid_margin = 1.0

  #z_ub = -3.0
  z_safe = -1.0

  # works?
  z_ub = -15.0

  #testing
  #z_ub = -10.0

  z_lb = -25.0
  fz = 1

  xminmax = [ _gc["min_x"] - grid_margin, _gc["max_x"] + grid_margin]
  yminmax = [ _gc["min_y"] - grid_margin, _gc["max_y"] + grid_margin]

  dx = 10.0
  dy = 10.0

  if not dry_run:

    if do_homing:
      if verbose: print "# homing..."
      x = grbl.send_command("$H")
      if verbose: print "# got:", x

    if verbose: print "# moving z to:", z_ub
    x = grbl.send_command("g0 z" + str(z_safe) + " f" + str(G1_SPEED_Z))
    if verbose: print "# got:", x
    var = grbl.wait_for_var_position('z', z_safe)
    if verbose: print "# got:", var

  _pntsxy = []
  _y = yminmax[0]
  while _y <= yminmax[1]:
    _x = xminmax[0]
    while _x <= xminmax[1]:
      _pntsxy.append( [_x, _y] )
      _x += dx
    _pntsxy.append( [xminmax[1], _y] )
    _y += dy

  _y = yminmax[1]
  _x = xminmax[0]
  while _x <= xminmax[1]:
    _pntsxy.append( [_x, _y] )
    _x += dx
  _pntsxy.append( [xminmax[1], _y] )

  #for idx in range(len(_pntsxy)):
  #  print _pntsxy[idx][0], _pntsxy[idx][1]
  #sys.exit(1)

  if verbose: print "# moving z to:", z_safe
  x = grbl.send_command("g0 z" + str(z_safe) + " f" + str(G1_SPEED_Z))
  var = grbl.wait_for_var_position('z', z_safe)
  if verbose: print "# got:", var
  x = grbl.send_command("g0 x" + str(_pntsxy[0][0]) + " y" + str(_pntsxy[0][1]) + " f" + str(G1_SPEED))
  var = grbl.wait_for_var_position('x', _pntsxy[0][0])
  var = grbl.wait_for_var_position('y', _pntsxy[0][1])

  for height_run in range(HEIGHT_MAP_COUNT):
    height_pnts.append([])

    for idx in range(len(_pntsxy)):

      if verbose: print "# grid:", _pntsxy[idx][0], _pntsxy[idx][1]
      if not dry_run:

        x = grbl.send_command("g1 z" + str(z_ub) + " f" + str(G1_SPEED_Z))
        var = grbl.wait_for_var_position('z', z_ub)

        x = grbl.send_command("g0 x" + str(_pntsxy[idx][0]) + " y" + str(_pntsxy[idx][1]))
        var = grbl.wait_for_var_position('x', _pntsxy[idx][0])
        var = grbl.wait_for_var_position('y', _pntsxy[idx][1])

        if verbose: print "# height probe:", _pntsxy[idx][0], _pntsxy[idx][1], z_lb, fz
        x = grbl.send_command("g38.2 z" + str(z_lb) + " f" + str(fz))
        lines = x.split("\n")
        vals = lines[0].split(":")[1].split(",")
        height_pnts[height_run].append( [ float(vals[0]), float(vals[1]), float(vals[2]) ] )

        x = grbl.send_command("g1 z" + str(z_ub) + " f" + str(G1_SPEED_Z))
        if verbose: print "# got:", x

for h in range(len(height_pnts)):
  _pnts = height_pnts[h]
  for _p in _pnts:
    print "( grid["+ str(h) + "]:", _p[0], _p[1], _p[2], ")"

if out_height_map_file is not None:

  print "# writing height to", out_height_map_file
  with open(out_height_map_file, "w") as fp:

    for h in range(len(height_pnts)):
      _pnts = height_pnts[h]
      for _p in _pnts:
        fp.write("{:.8f} {:.8f} {:.8f}\n".format(_p[0], _p[1], _p[2]))
      fp.write("\n")

pnts = height_pnts[0]

pnts_xy = np.zeros(( len(pnts), 2))
pnts_z = np.zeros((len(pnts)))
for idx in range(len(pnts)):
  pnts_xy[ idx, 0 ] = pnts[idx][0]
  pnts_xy[ idx, 1 ] = pnts[idx][1]
  pnts_z[idx] = pnts[idx][2]

_gc_lerp_lines = interpolate_gcode(_gc, pnts_xy, pnts_z)

if verbose:
  print "( minmax", _gc["min_x"], _gc["max_x"], _gc["min_y"], _gc["max_y"], ")"
  for l in _gc_lerp_lines:
    #print "(lerp:", l, ")"
    line = l.strip()
    print line

sys.stdout.write("\n#### ")
cprint("READY TO CUT, REMOVE PROBE AND PRESS ENTER TO CONTINUE", "red", attrs=['blink'])
sys.stdout.flush()
sys.stdin.readline()

if not dry_run:

  grbl.send_command("M3 S1000")

  for line in _gc_lerp_lines:
    line = line.strip()
    if len(line)==0: continue
    if line[0] == '#': continue
    if line[0] == '(': continue

    print("## sending:", line)
    sys.stdout.flush()
    r = grbl.send_command(line)
    print "### got:", r
    sys.stdout.flush()

  grbl.send_command("M5 S0")


