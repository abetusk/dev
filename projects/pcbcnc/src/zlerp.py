#!/usr/bin/python
#
# simple inverse distance interpolation
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

unit = "mm"
cur_x, cur_y, cur_z  = 0, 0, 0
z_pos = 'up'

z_plunge_inch = -0.003
z_plunge_mm = z_plunge_inch * 25.4

def usage():
  print "produce gcode from source gcode and height map by interpolating z co-ordinates from height map"
  print "usage:"
  print "  -g <gcode file>      gcode file"
  print "  -m <height map>      height map"
  print "  [-z <threshold>]     z threshold (default to 0)"
  print "  [-h|--help]          help (this screen)"
  print ""

gcode_file = None
height_map_file = None

z_threshold = 0.0

try:
  opts, args = getopt.getopt(sys.argv[1:], "m:g:z:", ["help", "output="])
except getopt.GetoptError, err:
  print str(err)
  usage()
  sys.exit(2)

output = None
verbose = False

for o, a in opts:
  if o == "-g":
    gcode_file = a
  elif o in ("-h", "--help"):
    usage()
    sys.exit()
  elif o == "-m":
    height_map_file = a
  elif o == "-z":
    z_threshold = float(a)
  else:
    assert False, "unhandled option"

if gcode_file is None or height_map_file is None:
  usage()
  sys.exit(-1)

pnts = []
pnts_xy = []
pntz_z = []

with open(height_map_file, "r") as fp:
  for line in fp:
    line = line.strip()
    if len(line)==0: continue
    if line[0] == '#': continue
    v = line.split()

    pnts.append( [ float(v[0]), float(v[1]), float(v[2]) ] )

pnts_xy = np.zeros(( len(pnts), 2))
pnts_z = np.zeros((len(pnts)))
for idx in range(len(pnts)):
  pnts_xy[ idx, 0 ] = pnts[idx][0]
  pnts_xy[ idx, 1 ] = pnts[idx][1]
  pnts_z[idx] = pnts[idx][2]

with open(gcode_file, "r") as gc:
  for line in gc:
    line = line.strip()
    is_move = 0

    l = line.rstrip('\n')

    # skip comments
    # assumes comments encased in parens all on one line 
    #
    m = re.match('^\s*(\(|;)', l)

    if m:
      print l
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

      print "( g_mode now", g_mode, ")"

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
      print "ERROR: g_mode not initialized"
      sys.exit(0)

    if not is_move:
      print l
      continue


    if (z_pos == 'up'):
      print "G" + str(g_mode), l
    elif (z_pos == 'down'):
      interpolated_z = griddata(pnts_xy, pnts_z, (cur_x, cur_y), method='linear')


      if unit == "inch":
        z_plunge = z_plunge_inch
      elif unit == "mm":
        z_plunge = z_plunge_mm
      else:
        print "ERROR: unit improperly set"
        sys.exit(0)

      interpolated_z += z_plunge

      x_f = float(cur_x)
      y_f = float(cur_y)

      print "G" + g_mode, "X{0:.8f}".format(x_f), "Y{0:.8f}".format(y_f), "Z{0:.8f}".format(interpolated_z)

