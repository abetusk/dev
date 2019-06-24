#!/usr/bin/python
#
# LICENSE: GPLv2 or later
#

## Monitor the two encoders for state changes.
## Note that encoder pitns (and the buttons on them)
## are pulled high, so they're actuall active low.
## The buxton state changes reflect active low states.
## No debouncing on buttons is done.
##

from RPi import GPIO
from time import sleep
import sys
import copy
import json

NSTEP = 20

# 'emitted' state comes after the '|'
# piflered from https://github.com/buxtronix/arduino/blob/master/libraries/Rotary/Rotary.cpp
#
encoder_state = {
  "step" : 0,
  "nstep" : NSTEP,
  "button" : 0,
  "state" : "start",
  "from" : {
    "start"     : { "to" : ["start",    "cw_begin", "ccw_begin",  "start" ] },

    "cw_begin"  : { "to" : ["cw_next",  "cw_begin", "start",      "start" ] },
    "cw_next"   : { "to" : ["cw_next",  "cw_begin", "cw_final",   "start" ] },
    "cw_final"  : { "to" : ["cw_next",  "start",    "cw_final",   "start" ] },

    "ccw_begin" : { "to" : ["ccw_next", "start",    "ccw_begin",  "start" ] },
    "ccw_next"  : { "to" : ["ccw_next", "ccw_final","ccw_begin",  "start" ] },
    "ccw_final" : { "to" : ["ccw_next", "ccw_final","start",      "start" ] }
  },
  "emit" : {
    "start" : { "to" : [ "", "", "", "" ] },

    "cw_begin": { "to" : ["", "", "", "" ]},
    "cw_next" : { "to" : ["", "", "", "" ] },
    "cw_final" : { "to" : ["", "", "", "cw" ] },

    "ccw_begin" : { "to" : ["", "" ,"", ""] },
    "ccw_next": { "to" : ["", "", "", "" ] },
    "ccw_final": { "to" : ["", "", "", "ccw"] }
  }
};

enc = [ copy.copy(encoder_state), copy.copy(encoder_state) ]

enc[0]["step"] = int(NSTEP/2)

io_0_a = 26
io_0_b = 19
io_0_pb = 13

## I think I fried an input pin, trying another group...
#io_1_a = 11
#io_1_b = 9
#io_1_pb = 10

io_1_a = 17
io_1_b = 27
io_1_pb = 22

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

def state_json_str(enc):
  jj = { "encoder" : [] }

  for i in range(len(enc)):
    o = { "step" : enc[i]["step"], "nstep" : enc[i]["nstep"], "button" : enc[i]["button"] }
    jj["encoder"].append( o )

  return json.dumps(jj)

json_str = state_json_str(enc)
print enc[0]["step"], enc[0]["button"], enc[1]["step"], enc[1]["button"], json_str
sys.stdout.flush()

hb_counter = 0
hb_beat = 1000
while True:

  print_update = False

  inp[0][0] = GPIO.input(io_0_a)
  inp[0][1] = GPIO.input(io_0_b)
  inp[0][2] = GPIO.input(io_0_pb)

  inp[1][0] = GPIO.input(io_1_a)
  inp[1][1] = GPIO.input(io_1_b)
  inp[1][2] = GPIO.input(io_1_pb)

  print inp

  pinX = inp[0][0] + 2*inp[0][1]
  pinY = inp[1][0] + 2*inp[1][1]

  s0 = enc[0]["state"]
  s1 = enc[1]["state"]

  ev0 = enc[0]["emit"][s0]["to"][pinX]
  ev1 = enc[1]["emit"][s1]["to"][pinY]

  pb0 = 1-inp[0][2]
  pb1 = 1-inp[1][2]

  if pb0 != enc[0]["button"] or pb1 != enc[1]["button"]:
    print_update = True

  enc[0]["button"] = pb0
  enc[1]["button"] = pb1

  if len(ev0) != 0:
    ds = 0
    if ev0 == "cw": ds = 1
    elif ev0 == "ccw": ds = enc[0]["nstep"] - 1
    enc[0]["step"] = ( enc[0]["step"] + ds ) % enc[0]["nstep"]

    print_update = True

  if len(ev1) != 0:
    ds = 0
    if ev1 == "cw": ds = 1
    elif ev1 == "ccw": ds = enc[1]["nstep"] - 1
    enc[1]["step"] = ( enc[1]["step"] + ds ) % enc[1]["nstep"]

    print_update = True

  if print_update:
    json_str = state_json_str(enc)
    print enc[0]["step"], enc[0]["button"], enc[1]["step"], enc[1]["button"], json_str
    sys.stdout.flush()

  enc[0]["state"] = enc[0]["from"][s0]["to"][pinX]
  enc[1]["state"] = enc[1]["from"][s1]["to"][pinY]

  if (hb_counter % hb_beat) == 0:
    json_str = state_json_str(enc)
    print "# heartbeat:", json_str
    print enc[0]["step"], enc[0]["button"], enc[1]["step"], enc[1]["button"], json_str
    sys.stdout.flush()
  hb_counter += 1

  inp_cpy(prv_inp, inp)
  sleep(0.005)

