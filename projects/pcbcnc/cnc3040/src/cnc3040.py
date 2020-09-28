#!/usr/bin/python
#
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

DEFAULT_FEED_RATE = 60
DEFAULT_DEVICE = "/dev/ttyACM0"

unit = "mm"
cur_x, cur_y, cur_z  = 0, 0, 0
z_pos = 'up'

dry_run = False

z_threshold = 0.0
z_plunge_inch = -0.004
z_plunge_mm = z_plunge_inch * 25.4

s_val = 8000.0
grbl_spindle = False

tty_device = DEFAULT_DEVICE

output = None
verbose = True

def usage(ofp = sys.stdout):
  ofp.write( "\nDo a height probe, interploate GCode file then execute job\n")
  ofp.write( "\nusage:\n")
  ofp.write( "  -g <gcode file>     gcode file\n")
  ofp.write( "  [-m <height map>]   height map\n")
  ofp.write( "  [-O <out height>]   output height map file (default stdout)\n")
  ofp.write( "  [-D]                dry run (do not connect to GRBL)\n")
  ofp.write( "  [-S <S>]            Set S value\n")
  ofp.write( "  [-z <threshold>]    z threshold (default to " + str(z_threshold) + ")\n")
  ofp.write( "  [-p <zplunge>]      amount under height sensed part to plunge (default " + str(z_plunge_mm) + "mm)\n")
  ofp.write( "  [-T <device>]       use <device>\n")
  ofp.write( "  [--grbl-spindle]    Use M03/M05 for spindle control\n")
  ofp.write( "  [-h|--help]         help (this screen)\n")
  ofp.write( "\n")

gcode_file = None
height_map_file = None
out_height_map_file = None

try:
  opts, args = getopt.getopt(sys.argv[1:], "hm:g:z:Dp:O:T:S:", ["help", "output=", "grbl-spindle", "tty="])
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
  elif o == "-T":
    tty_device = a
  elif o == "-S":
    s_val = float(a)
  elif o == "--grbl-spindle":
    grbl_spindle = True
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

def interpolate_gcode(gcode, pnts_xy, pnts_z, _feed=DEFAULT_FEED_RATE):
  unit = "mm"
  cur_x, cur_y, cur_z  = 0, 0, 0
  z_pos = 'up'
  z_pos_prv = z_pos

  z_threshold = 0.0
  z_plunge_inch = -0.006
  z_plunge_mm = z_plunge_inch * 25.4

  lines = []

  z_leeway = 1
  z_ub = pnts_z[0]

  g1_feed = _feed

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
      lines.append("G" + str(g_mode) + " Z{0:.8f}".format(z_ub))
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
        lines.append("G0 X{0:.8f}".format(x_f) + " Y{0:.8f}".format(y_f) +  " Z{0:.8f}".format(z_ub))

      #print "G" + g_mode, "X{0:.8f}".format(x_f), "Y{0:.8f}".format(y_f), "Z{0:.8f}".format(interpolated_z)
      #lines.append("G" + str(g_mode) +  " X{0:.8f}".format(x_f) + " Y{0:.8f}".format(y_f) +  " Z{0:.8f}".format(interpolated_z))
      lines.append("G" + str(g_mode) +  " X{0:.8f}".format(x_f) + " Y{0:.8f}".format(y_f) +  " Z{0:.8f}".format(interpolated_z) + " F{0:.8f}".format(g1_feed))

    z_pos_prv = z_pos

  return lines

_gc = read_gcode_file(gcode_file)


pnts = []

if not dry_run:
  grbl.setup(tty_device)
  grbl.send_initial_command("")

sys.stdout.write("\n#### ")
cprint("READY TO CUT, REMOVE PROBE AND PRESS ENTER TO CONTINUE", "red", attrs=['blink'])
sys.stdout.flush()
sys.stdin.readline()

if not dry_run:

  grbl.send_command("G1Z5F50")

  if grbl_spindle:
    grbl.send_command("S" + str(s_val))
    grbl.send_command("M03")
  else:
    grbl.send_command("M42")

  for line in _gc["lines"]:

    line = line.strip()
    if len(line)==0: continue
    if line[0] == '#': continue
    if line[0] == '(': continue

    print("## sending:", line)
    sys.stdout.flush()
    r = grbl.send_command(line)
    print "### got:", r
    sys.stdout.flush()

  if grbl_spindle:
    grbl.send_command("M05")
  else:
    grbl.send_command("M43")


