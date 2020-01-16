#!/usr/bin/python
#
# some common functions I use in GRBL
# grbl.setup()                          - setup connection.  can specify device, defaults to '/dev/ttyUSB0'
#                                                            can specify baud, defaults to 8600
# grbl.teardown()                       - explicitely closes the serial connection
# grbl.send_command( cmd )              - send cmd to GRBL
# grbl.get_position()                   - return (x, y, z) position
# grbl.get_var_position( v )            - get variable 'v' position, where v is 'x', 'y' or 'z'
# grbl.wait_for_var_position( v, pos )  - wait for axis 'v' to get within epsilon distance of 'pos'.
#                                         This call blocks until position is reached, sleeping for 'sleepy'
#                                         seconds at a time (sleepy can be subsecond).
#

import serial
import re
import math
import time


# default values 
#
device = "/dev/ttyUSB0"
baud = 115200
grbl_serial = None
sleepy = 0.05
var_epsilon = 0.005

verbose = False
#verbose = True

def setup( dev = device, b = baud ):
  global device 
  global baud
  global grbl_serial
  device = dev
  baud = b
  grbl_serial = serial.Serial( device, baud )

def teardown():
  global grbl_serial
  if grbl_serial:
    if verbose:
      print "tearing down connection"
    grbl_serial.close()

def send_initial_command( cmd ) :
  global grbl_serial
  global verbose
  if verbose:
    print "# sending initial command '" + cmd + "'"
  grbl_serial.write(cmd + "\n")
  grbl_out = grbl_serial.readline()

  ans = grbl_out
  if verbose:
    print "#  got :", grbl_out.strip(), ":"

  if ( re.search("^error:", grbl_out) ):
    return ans

  if ( re.search("^Grbl", grbl_out) or re.search("^\s*$", grbl_out) ):
    grbl_out = grbl_serial.readline()
    ans = grbl_out
    if verbose:
      print "#  got :", grbl_out.strip()

  if ( re.search("^\['", grbl_out) or re.search("^\s*$", grbl_out) ):
    grbl_out = grbl_serial.readline()
    ans = grbl_out
    if verbose:
      print "#  got :", grbl_out.strip()

  if verbose:
    print "#", grbl_out
  return ans

def send_command( cmd ) :
  global grbl_serial
  global verbose
  if verbose:
    print "# sending '" + cmd + "'"
  grbl_serial.write(cmd + "\n")
  grbl_out = grbl_serial.readline()

  ans = grbl_out
  if verbose:
    print "#  got :", grbl_out.strip(), ":"

  if ( re.search("^error:", grbl_out) ):
    return ans

  if ( re.search("^Grbl", grbl_out) or re.search("^\s*$", grbl_out) ):
    grbl_out = grbl_serial.readline()
    ans = grbl_out
    if verbose:
      print "#  got :", grbl_out.strip()

  if ( re.search("^\['", grbl_out) or re.search("^\s*$", grbl_out) ):
    grbl_out = grbl_serial.readline()
    ans = grbl_out
    if verbose:
      print "#  got :", grbl_out.strip()

  while ( not re.search("ok", grbl_out) ):
    grbl_out = grbl_serial.readline()
    if verbose:
      print "#  got:", grbl_out.strip()
    ans += grbl_out
    if ( re.search("^error:", grbl_out) ):
      return ans

  if verbose:
    print "#", grbl_out
  return ans

def get_position():
  global grbl_serial
  global verbose
  grbl_serial.write("?")
  grbl_out = grbl_serial.readline()

  m = re.search( "^<([^,]*),MPos:([^,]*),([^,]*),([^,]*),", grbl_out)
  if ( m ):
    if verbose:
      print "# matched", m.group(0)
    state = m.group(1)
    x = float(m.group(2))
    y = float(m.group(3))
    z = float(m.group(4))

    return x, y, z

  return None, None, None

def get_var_position( var_name ):
  global grbl_serial
  global verbose
  var_seen = 0
  var_pos = 0.0
  #grbl_serial.write("$?\n")
  grbl_serial.write("?")
  grbl_out = grbl_serial.readline()

  if verbose:
    print "#  get_var_position(", var_name, "): got :", grbl_out.strip()

  m = re.search( "^<([^,]*),MPos:([^,]*),([^,]*),([^,]*),", grbl_out)
  if ( m ):
    if verbose:
      print "# matched", m.group(0)
    state = m.group(1)
    x = float(m.group(2))
    y = float(m.group(3))
    z = float(m.group(4))

    if ( var_name == 'x') or ( var_name == 'X'):
      return x
    if ( var_name == 'y') or ( var_name == 'Y'):
      return y
    if ( var_name == 'z') or ( var_name == 'Z'):
      return z


def wait_for_var_position( var_name, var_val ):
  global grbl_serial
  global verbose
  global sleepy
  global var_epsilon
  cur_val = get_var_position( var_name )
  if verbose:
    print "#", str(var_val), " var_epsilon", str(var_epsilon), "cur_x", str(cur_val)
  while (math.fabs(var_val - cur_val) > var_epsilon):
    if verbose:
      print "# cur_val", str(cur_val), ", waiting for ", var_name, str(var_val)
    time.sleep(sleepy)
    cur_val = get_var_position( var_name )
  return cur_val

if __name__ == "__main__":
  import argparse
  parser = argparse.ArgumentParser(description='Send GRBL commands.')
  parser.add_argument("-B", "--baud", help="Set baud rate (default 9600)", nargs = 1, default=[baud], type=int)
  parser.add_argument("-D", "--device", help="Set device (default /dev/ttyUSB0)", nargs = 1, default=[device] )
  parser.add_argument("-v", "--verbose", help="Set verbose mode", default=verbose, action='store_true')
  parser.add_argument("command", help="Command to send GRBL", nargs="+" )

  args = parser.parse_args()

  if hasattr(args, 'baud'):
    baud = args.baud[0]
  if hasattr(args, 'device'):
    device = args.device[0]
  if hasattr(args, 'verbose'):
    verbose = args.verbose

  if verbose:
    print "baud:", baud
    print "device:", device

  setup(device, baud)

  print "setup done..."

  v = send_initial_command("")
  print "got", v

  for cmd in args.command:
    print "sending command", cmd
    print send_command(cmd)

  print "tearing down..."

  teardown()
