#!/usr/bin/python

from RPi import GPIO
from time import sleep


io_0_a = 26
io_0_b = 19
io_0_pb = 13

io_1_a = 11
io_1_b = 9
io_1_pb = 10

## GPI.BCM is 'broadcom' or the 'jumbled' numbering
## GPI.BOARD is the pinout as it appears on the board itself (in order)

GPIO.setmode(GPIO.BCM)

GPIO.setup(io_0_a,  GPIO.IN, pull_up_down=GPIO.PUD_UP)
GPIO.setup(io_0_b,  GPIO.IN, pull_up_down=GPIO.PUD_UP)
GPIO.setup(io_0_pb, GPIO.IN, pull_up_down=GPIO.PUD_UP)

GPIO.setup(io_1_a,  GPIO.IN, pull_up_down=GPIO.PUD_UP)
GPIO.setup(io_1_b,  GPIO.IN, pull_up_down=GPIO.PUD_UP)
GPIO.setup(io_1_pb, GPIO.IN, pull_up_down=GPIO.PUD_UP)

inp = [ [0,0,0], [0,0,0] ]
prv_inp = [ [0,0,0], [0,0,0] ]

def inp_diff(x, y):
  for _i in range(2):
    for _j in range(3):
      if x[_i][_j] != y[_i][_j]: return True
  return False

def inp_cpy(dst, src):
  for _i in range(2):
    for _j in range(3):
      dst[_i][_j] = src[_i][_j]


hb_counter = 0
hb_beat = 1000
while True:

  inp[0][0] = GPIO.input(io_0_a)
  inp[0][1] = GPIO.input(io_0_b)
  inp[0][2] = GPIO.input(io_0_pb)

  inp[1][0] = GPIO.input(io_1_a)
  inp[1][1] = GPIO.input(io_1_b)
  inp[1][2] = GPIO.input(io_1_pb)

  if inp_diff(inp, prv_inp):
    print inp[0][0], inp[0][1], inp[0][2], inp[1][0], inp[1][1], inp[1][2]

  if (hb_counter % hb_beat) == 0:
    print "heartbeat"
  hb_counter += 1

  inp_cpy(prv_inp, inp)
  sleep(0.005)

