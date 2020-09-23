#!/usr/bin/python3

xy_points  = [ [-90.0, -199.0], [-90.0, -119.0], [0.0, -119.0], [0.0, -199.0] ]


print("G1 Z-1 F25")
print("M3 S1000")

for xy in xy_points:

  print("G1 Z-1 F25")
  print("G0 X" + str(xy[0]) + " Y" + str(xy[1]) + " F25")

  for z in range(1, 26):
    print("G1 Z-" + str(z+1) +  " F25")
    print("G1 Z-" + str(z) + " F25")

  print("G1 Z-1 F25")


print("M5")
