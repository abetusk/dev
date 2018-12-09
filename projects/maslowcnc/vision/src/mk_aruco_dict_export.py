#!/usr/bin/python

import sys
sys.path.insert(0, '/usr/local/python/cv2/python-2.7/')

import numpy as np

import cv2
import cv2.aruco as aruco


nbit = 4
nbits = nbit*nbit
nbytes = int( (nbits + 7) / 8 )

NAME = "DICT_" + str(nbit) + "X" + str(nbit) + "_250"

aruco_dict = aruco.Dictionary_get(aruco.DICT_4X4_250)
#aruco_dict = aruco.Dictionary_get(aruco.DICT_6X6_250)

bytesList = aruco_dict.bytesList

print "name", NAME
print "nbits", nbits

for idx in range(len(bytesList)):
  b_a = []
  b_idx, r, c = 0, 0, 0
  for b_idx in range(nbytes):
    cur_b = bytesList[idx][r][c]
    b_a.append(cur_b)
    c+=1
    if c == len(bytesList[idx][r]):
      r+=1
      c=0

  bitvec_str, idx = "", 0
  for bit_start in range(0, nbits, 8):

    bit_len = 8
    if (bit_start + 8) > nbits:
      bit_len = nbits - bit_start

    bitvec_str += format(b_a[idx], "0" + str(bit_len) + "b")
    idx+=1

  print bitvec_str


for idx in range(len(bytesList)):
  sz_str = str(nbit) + "x" + str(nbit)
  ofn = "aruco_" + sz_str + "/aruco_" + sz_str + "_" + str(idx) + ".png"
  z = aruco.drawMarker(aruco_dict, idx, 96)
  cv2.imwrite(ofn, z)

