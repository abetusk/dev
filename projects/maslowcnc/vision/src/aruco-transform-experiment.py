#!/usr/bin/python

DEBUG=False

import sys
sys.path.insert(0, '/usr/local/python/cv2/python-2.7/')

import numpy as np
import cv2
import cv2.aruco as aruco

import math

## https://stackoverflow.com/a/34374437/4002265 by Mark Dickinson
##
def rotate(origin, point, angle):
    """
    Rotate a point counterclockwise by a given angle around a given origin.

    The angle should be given in radians.
    """
    ox, oy = origin
    px, py = point

    qx = ox + math.cos(angle) * (px - ox) - math.sin(angle) * (py - oy)
    qy = oy + math.sin(angle) * (px - ox) + math.cos(angle) * (py - oy)
    return [qx, qy]

print "# using DICT_4X4_250"

fn0 = "img/aruco_4x4_test.png"
fn1 = "img/aruco_4x4_test_r15_dx50_dy25.png"

origin = [0,0]

if len(sys.argv) > 1:
  fn0 = sys.argv[1]
  if len(sys.argv) > 2:
    fn1 = sys.argv[2]

print "# using", fn0, fn1
print "# origin (", origin[0], origin[1], ")"
img0 = cv2.imread(fn0)
img1 = cv2.imread(fn1)

if len(sys.argv) > 4:
  origin[0] = float(sys.argv[3])
  origin[1] = float(sys.argv[4])
else:
  origin[0] = img0.shape[1]/2
  origin[1] = img0.shape[0]/2

aruco_dict = aruco.Dictionary_get(aruco.DICT_4X4_250)
param = aruco.DetectorParameters_create()
corners0, ids0_all, rejectedImgPoints0 = aruco.detectMarkers(img0, aruco_dict, parameters=param)
corners1, ids1_all, rejectedImgPoints1 = aruco.detectMarkers(img1, aruco_dict, parameters=param)

uniq0_id, uniq1_id = {}, {}
id_freq0, id_freq1 = {}, {}
for idx in range(len(ids0_all)):
  arucoid = ids0_all[idx][0]
  if arucoid in id_freq0:
    id_freq0[arucoid]["freq"] += 1
    id_freq0[arucoid]["corner"].append(corners0[idx])
  else:
    id_freq0[arucoid] = { "freq":1, "corner": [ corners0[idx] ] }
for arucoid in id_freq0:
  if id_freq0[arucoid]["freq"] == 1:
    uniq0_id[arucoid] = id_freq0[arucoid]["corner"][0]

for idx in range(len(ids1_all)):
  arucoid = ids1_all[idx][0]
  if arucoid in id_freq1:
    id_freq1[arucoid]["freq"] += 1
    id_freq1[arucoid]["corner"].append(corners1[idx])
  else:
    id_freq1[arucoid] = { "freq":1, "corner": [ corners1[idx] ] }
for arucoid in id_freq1:
  if id_freq1[arucoid]["freq"] == 1:
    uniq1_id[arucoid] = id_freq1[arucoid]["corner"][0]

debug_corners = []
_debug_corners = []
debug_ids = []
_debug_ids = []

_pnt0, _pnt1 = [], []
tot_count=0
uniq_id_both = {}
for arucoid in uniq0_id:
  if arucoid in uniq1_id:
    uniq_id_both[arucoid] = { "src" : uniq0_id[arucoid], "dst" : uniq1_id[arucoid] }
    tot_count+=1

    _debug_corners.append( uniq0_id[arucoid] )
    _debug_ids.append([arucoid]);

    avg0, avg1 = [0.0,0.0], [0.0,0.0]
    for ii in range(4):
      avg0[0] += uniq0_id[arucoid][0][ii][0] 
      avg0[1] += uniq0_id[arucoid][0][ii][1] 
      avg1[0] += uniq1_id[arucoid][0][ii][0] 
      avg1[1] += uniq1_id[arucoid][0][ii][1] 
      _pnt0.append( [ uniq0_id[arucoid][0][ii][0], uniq0_id[arucoid][0][ii][1] ] )
      _pnt1.append( [ uniq1_id[arucoid][0][ii][0], uniq1_id[arucoid][0][ii][1] ] )

    avg0[0] /= 4.0
    avg0[1] /= 4.0

    avg1[0] /= 4.0
    avg1[1] /= 4.0

    if DEBUG:
      print arucoid, avg0, avg1

    _pnt0.append(avg0)
    _pnt1.append(avg1)

pnt0 = np.asarray(_pnt0, float)
pnt1 = np.asarray(_pnt1, float)

x = cv2.findHomography(pnt0, pnt1)
y = cv2.estimateAffinePartial2D(pnt0, pnt1, False)
z = cv2.estimateAffinePartial2D(pnt0, pnt1, True)

rad_ang = math.atan2(y[0][1][0], y[0][0][0])
calc_dxy = [ y[0][0][2], y[0][1][2] ]

print ""

print "homography estimated-angle:", math.atan2(x[0][1][0], x[0][0][0])*180.0/math.pi
print "homography estimated-del:", x[0][0][2], x[0][1][2]

print ""

print "affine partial 2d estimated-angle:", math.atan2(y[0][1][0], y[0][0][0])*180.0/math.pi
print "affine partial 2d estimated-del:", y[0][0][2], y[0][1][2]

print ""

print "affine partial 2d (true) estimated-angle:", math.atan2(z[0][1][0], z[0][0][0])*180.0/math.pi
print "affine-partial 2d (true) estimated-del:", z[0][0][2], z[0][1][2]

print ""


### DEBUG
### DEBUG
### DEBUG
if DEBUG:
  debug_corners = np.asarray( _debug_corners )
  debug_ids = np.asarray( _debug_ids)
  print debug_corners.shape, debug_ids.shape
  aruco.drawDetectedMarkers(img0, debug_corners, debug_ids)
  cv2.imshow('xxx', img0)
  cv2.waitKey(0)
  cv2.destroyAllWindows()
### DEBUG
### DEBUG
### DEBUG


dxy = rotate([0,0], origin, rad_ang)
#print "...", dxy

dxy[0] += calc_dxy[0]
dxy[1] += calc_dxy[1]

#print "...", dxy

print "final estimated d(x,y):", dxy[0] - origin[0], dxy[1] - origin[1]

sys.exit()
