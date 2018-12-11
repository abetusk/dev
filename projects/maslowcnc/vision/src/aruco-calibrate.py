#!/usr/bin/python

# right now only a test program to show usage on a single input image
#

import sys
sys.path.insert(0, '/usr/local/python/cv2/python-2.7/')

import numpy as np
import cv2
import cv2.aruco as aruco

print "# using DICT_4X4_250"

img = False
if len(sys.argv) == 1:
  img = cv2.imread("img/aruco_4x4_test.png")
else:
  print "#using", sys.argv[1]
  img = cv2.imread(sys.argv[1])


aruco_dict = aruco.Dictionary_get(aruco.DICT_4X4_250)
param = aruco.DetectorParameters_create()
corners, ids, rejectedImgPoints = aruco.detectMarkers(img, aruco_dict, parameters=param)
print corners
print ids

aruco.drawDetectedMarkers(img, corners, ids)
#aruco.drawDetectedMarkers(img, rejectedImgPoints, borderColor=(100, 0, 240))

cv2.imshow('xxx', img)
cv2.waitKey(0)
cv2.destroyAllWindows()

