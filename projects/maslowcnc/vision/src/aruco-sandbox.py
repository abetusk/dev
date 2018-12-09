#!/usr/bin/python

import os
import sys
#sys.path.insert(0, '/usr/local/python/cv2')
sys.path.insert(0, '/usr/local/python/cv2/python-2.7/')

import numpy as np
import cv2

print cv2.__version__

import cv2.aruco as aruco

aruco_dict = aruco.Dictionary_get(aruco.DICT_6X6_250)
print aruco.DICT_6X6_250

test_dict = aruco.Dictionary_create(250, 6)
print test_dict.bytesList
sys.exit()


help(aruco)
sys.exit()

test_dict = aruco.custom_dictionary(250, 6)
print test_dict.bytesList
sys.exit()


#x = aruco.custom_dictionary_from(250, 36, "/home/abe/data/vision/mip36h12.dict")
#print x

#help(aruco_dict)

nbits=36

tail_fmt = "0" + str(8 + nbits - 8*5) + "b"
byte_stride = 5

def test_byte_print():

  s = ""
  #ar = [30, 61, 216, 42, 6]
  ar = [14, 251, 163, 137, 1]
  for x in range(len(ar)):
    if x == (len(ar)-1):
      s += format(ar[x], tail_fmt)
    else:
      s += format(ar[x], "08b")

  ll=""
  for idx,v in enumerate(s):
    if (idx>0) and  ((idx%6)==0):
      print ll
      ll = ""
    ll += v

  print ll

  sys.exit()


print len(aruco_dict.bytesList)
#print aruco_dict.bytesList
for d in range(len(aruco_dict.bytesList)):
  tot_s = ""

  flat_a = []
  for a in range(len(aruco_dict.bytesList[d])):
    for b in range(len(aruco_dict.bytesList[d][a])):
      flat_a.append(aruco_dict.bytesList[d][a][b])

  for base in range(0, len(flat_a), byte_stride):
    s=""
    for offset in range(byte_stride):
      if offset == (byte_stride-1):
        s += format(flat_a[base+offset], tail_fmt)
      else:
        s += format(flat_a[base+offset], "08b")

    ll=""
    for idx,v in enumerate(s):
      if (idx>0) and  ((idx%6)==0):
        print ll
        ll = ""
      ll += v

    print ll
    print ""

  print "----"


  print ""

#help(aruco)

sys.exit()

print "---"

print aruco_dict

for aruco_id in range(0,250):
  print ">>>", aruco_id
  img = aruco.drawMarker(aruco_dict, aruco_id, 64)
  cv2.imwrite( "dict_img/" + str(aruco_id) + ".jpg", img)



