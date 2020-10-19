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

VERBOSITY_LEVEL = 3

#HEIGHT_MAP_COUNT = 5
HEIGHT_MAP_COUNT = 1
G1_SPEED = 25
G0_SPEED = 50

G1_SPEED_Z = 15
G0_SPEED_Z = 25

SPINDLE_SPEED = 1000.0

Z_SAFE = -1.0
#Z_UP = -10.0
Z_UP = -30.0
Z_MAX_DOWN = -40.0

Z_PROBE_SPEED = 1

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
z_plunge_inch = -0.004
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

  ofp.write( "  [-U <zup>]          when probing, height (NOT z-safe) (default" + str(Z_UP) + ")\n")
  ofp.write( "  [-L <maxzdown>]     max z probe depth (default " + str(Z_MAX_DOWN) + ")\n")
  ofp.write( "  [--zsafe <zsafe>]   safe z height (default " + str(Z_SAFE) + ")\n")
  ofp.write( "  [--zprobe-speed <zspeed>]   probe speed (default " + str(Z_PROBE_SPEED) + ")\n")

  ofp.write( "  [-z <threshold>]    z threshold (default to " + str(z_threshold) + ")\n")
  ofp.write( "  [-p <zplunge>]      amount under height sensed part to plunge (default " + str(z_plunge_mm) + "mm)\n")
  ofp.write( "  [-S <spindle>]      Spindle speed (default " + str(SPINDLE_SPEED) + ")\n")
  ofp.write( "  [--no-homing]       don't execute homing operation\n")
  ofp.write( "  [--heightmap-count <N>]   Do height map N times\n")
  ofp.write( "  [-h|--help]         help (this screen)\n")
  ofp.write( "\n")

gcode_file = None
height_map_file = None
out_height_map_file = None

try:
  opts, args = getopt.getopt(sys.argv[1:], "hm:g:z:Dp:O:S:U:L:", ["help", "output=", "no-homing", "heightmap-count=", "zsafe=", "zprobe-speed="])
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

  elif o == "-U":
    Z_UP = float(a)
  elif o == "-L":
    Z_MAX_DOWN = float(a)
  elif o == "--zsafe":
    Z_SAFE = float(a)
  elif o == "--zprobe-speed":
    Z_PROBE_SPEED = float(a)

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
  elif o == "-S":
    SPINDLE_SPEED = float(a)
  elif o == "--no-homing":
    do_homing=False
  elif o == "--heightmap-count":
    HEIGHT_MAP_COUNT = int(a)
  else:
    assert False, "unhandled option"

if HEIGHT_MAP_COUNT < 1:
  sys.stderr.write("height map count must be > 0")
  usage(sys.stderr)
  sys.exit(-1)

if gcode_file is None:
  sys.stderr.write("Provide gcode file\n")
  usage(sys.stderr)
  sys.exit(-1)

dry_run = False

# The copper layer is reported to be
# (https://www.amazon.com/gp/product/B01MCVLDDZ)
#
# 18 um ~ 0.000708661 inch
# so around 1 mil

if VERBOSITY_LEVEL > 2:
  print("# HEIGHT_MAP_COUNT:", HEIGHT_MAP_COUNT)
  print("# G1_SPEED:", G1_SPEED)
  print("# G0_SPEED:", G0_SPEED)

  print("# G1_SPEED_Z:", G1_SPEED_Z)
  print("# G0_SPEED_Z:", G0_SPEED_Z)

  print("# Z_SAFE:", Z_SAFE)
  print("# Z_UP:", Z_UP)
  print("# Z_MAX_DOWN:", Z_MAX_DOWN)

  print("# Z_PROBE_SPEED:", Z_PROBE_SPEED)

  print("# unit:", unit)
  print("# z_threshold:", z_threshold)
  print("# z_plunge_inch:", z_plunge_inch, ", z_plunge_mm:", z_plunge_mm)


pnts = []
pnts_xy = []
pntz_z = []

def read_gcode_file(gcode_filename):
  cur_x = 0.0
  cur_y = 0.0

  xvalid = False
  yvalid = False

  res = {
    "lines":[], "status":"init",
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

      if VERBOSITY_LEVEL > 2:
        print("# z_plunge {0:.8f}".format(z_plunge) + " (" + str(unit) + "), zlerp: {0:.8f}".format(interpolated_z))

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
    height_pnts.append([])
    for line in fp:
      line = line.strip()
      if len(line)==0: continue
      if line[0] == '#': continue
      v = line.split()

      pnts.append( [ float(v[0]), float(v[1]), float(v[2]) ] )
      height_pnts[0].append( [ float(v[0]), float(v[1]), float(v[2]) ] )

  if not dry_run:

    if do_homing:
      if verbose: print "# homing..."
      x = grbl.send_command("$H")
      if verbose: print "# got:", x

    sx = height_pnts[0][0][0]
    sy = height_pnts[0][0][1]

    start_line = "G0 X{:.8f} Y{:.8f}".format(float(sx), float(sy))
    #start_line = "G0 X{:.8f}".format(sx) + " Y{:.8f}".format(sy)
    r = grbl.send_command(start_line)

else:

  grid_margin = 1.0

  #z_safe = -1.0
  #z_ub = -1.0
  #z_lb = -20.0

  z_safe = Z_SAFE
  z_ub = Z_UP
  z_lb = Z_MAX_DOWN

  fz = Z_PROBE_SPEED

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
    x = grbl.send_command("G1 Z" + str(z_safe) + " F" + str(G1_SPEED_Z))
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

  if verbose: print "# moving z to:", z_safe
  x = grbl.send_command("G1 Z" + str(z_safe) + " F" + str(G1_SPEED_Z))
  var = grbl.wait_for_var_position('z', z_safe)
  if verbose: print "# got:", var
  x = grbl.send_command("G0 X" + str(_pntsxy[0][0]) + " Y" + str(_pntsxy[0][1]) + " F" + str(G0_SPEED))
  var = grbl.wait_for_var_position('x', _pntsxy[0][0])
  var = grbl.wait_for_var_position('y', _pntsxy[0][1])

  for height_run in range(HEIGHT_MAP_COUNT):
    height_pnts.append([])

    for idx in range(len(_pntsxy)):

      if verbose: print "# grid:", _pntsxy[idx][0], _pntsxy[idx][1]
      if not dry_run:

        x = grbl.send_command("G1 Z" + str(z_ub) + " F" + str(G1_SPEED_Z))
        var = grbl.wait_for_var_position('z', z_ub)

        x = grbl.send_command("G0 X" + str(_pntsxy[idx][0]) + " Y" + str(_pntsxy[idx][1]) + " F" + str(G0_SPEED) )
        var = grbl.wait_for_var_position('x', _pntsxy[idx][0])
        var = grbl.wait_for_var_position('y', _pntsxy[idx][1])

        if verbose: print "# height probe:", _pntsxy[idx][0], _pntsxy[idx][1], z_lb, fz
        x = grbl.send_command("g38.2 z" + str(z_lb) + " f" + str(fz))
        lines = x.split("\n")
        vals = lines[0].split(":")[1].split(",")
        height_pnts[height_run].append( [ float(vals[0]), float(vals[1]), float(vals[2]) ] )

        x = grbl.send_command("G1 Z" + str(z_ub) + " F" + str(G1_SPEED_Z))
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

  for hidx in range(len(height_pnts)):
    pnts_z[idx] += height_pnts[hidx][idx][2]
  pnts_z[idx] /= float(len(height_pnts))

if verbose:
  for idx in range(len(pnts)):
    print "( pnts_z", idx, pnts_xy[idx, 0], pnts_xy[idx, 1], pnts_z[idx], ")"

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

  grbl.send_command( "M3 S{:.8f}".format(SPINDLE_SPEED) )

  cur_line = 0
  tot_lines = len(_gc_lerp_lines)

  for line in _gc_lerp_lines:
    line = line.strip()
    if len(line)==0: continue
    if line[0] == '#': continue
    if line[0] == '(': continue

    print("## sending:", line)
    sys.stdout.flush()
    r = grbl.send_command(line)
    print "### got:", r, "(", cur_line, "/", tot_lines, ")"
    sys.stdout.flush()

    cur_line+=1

  grbl.send_command("M5 S0")

 
