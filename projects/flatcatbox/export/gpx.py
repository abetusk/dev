#!/usr/bin/python

import sys
import re

premul = 1
if len(sys.argv)> 1:
  premul = float(sys.argv[1])

print premul

for line in sys.stdin:

  line = line.strip()
  if len(line)==0 or line[0]=='#':
    if len(line)==0: print ""
    continue
  tok = re.split(r'\s+', line)

  coord = []
  for val in tok:
    coord.append( float(val)*premul )

  s = ""
  for idx in range(len(coord)):
    if idx>0: s += " "
    s += str(coord[idx])
  print s


