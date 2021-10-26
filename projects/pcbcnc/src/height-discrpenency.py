#!/usr/bin/python3

import re, sys, math

heights = {}

for line in sys.stdin:
  line = line.strip()
  if len(line)==0: continue
  a = line.split(" ")

  key = a[0] + ":" + a[1]

  if not (key in heights):
    heights[key] = []

  heights[key].append(float(a[2]))


for key in heights:
  _first = True
  _min = 0
  _max = 0
  for v in heights[key]:
    if _first:
      _min = v
      _max = v
      _first = False
    if v < _min : _min = v
    if v > _max : _max = v


  d = abs( _max - _min )

  print( key + " del:" + str(d) + " [min:" + str(_min) + ",max:" + str(_max) + "]")

