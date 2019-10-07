#!/usr/bin/python
#
# taken from https://www.acmesystems.it/python_http
# CY-BY-SA Sergio Tanzilli
#
from BaseHTTPServer import BaseHTTPRequestHandler,HTTPServer
from os import curdir, sep
import cgi
import tempfile
import os
import json
import getopt
import sys

INNER_LIGHT_WEB_VERSION = "0.1.0"

PORT_NUMBER = 8080

BASE_DIR = "/tmp/"

IL_INI = BASE_DIR + "innerlight.ini"
IL_TESTLED = BASE_DIR + "ledtest.txt"
IL_LED = BASE_DIR + "innerlight.led"

ILG_EXE = BASE_DIR + "inner-light-drive"

ILG_PID_FN = BASE_DIR + "inner-light-generator.pid"
ILD_PID_FN = BASE_DIR + "inner-light-drive.pid"

DEFAULT_CFG = BASE_DIR + "default-innerlight.ini"

opt_short = "hVP:g:d:T:c:L:D:"
opt_long = ["help", "version", "port", "pidgenerator", "piddriver", "test", "config", "led", "defaultcfg"]

def show_version():
  print INNER_LIGHT_WEB_VERSION

def show_help():
  print "usage:  inner-light-web.py [-h] [-V] [-c config] [-g pidgenerator] [-d piddriver]  [-P port] [-T testled]";
  print ""
  print "  -c config        config file (default", IL_INI, ")"
  print "  -D defconfig     default config file (default", DEFAULT_CFG, ")"
  print "  -g pidgenerator  pid file for generator (defaut", ILG_PID_FN, ")"
  print "  -d piddriver     pid file for driver (defaut", ILD_PID_FN, ")"
  print "  -T testled       testled file (default", IL_TESTLED, ")"
  print "  -L led           LED file (default", IL_LED,  ")"
  print "  -P port          listen port (default", PORT_NUMBER, ")"
  print "  -h               help (this screen)"
  print "  -V               print version and exit"

try:
  arg,val = getopt.getopt(sys.argv[1:], opt_short, opt_long)
except getopt.error as err:
  print (str(err))
  sys.exit(-1)

for x in arg:
  p = x[0]
  v = x[1]

  if p == "-h":
    show_help()
    sys.exit(0)
  elif p == "-c":
    IL_INI = v
  elif p == "-D":
    DEFAULT_CFG = v
  elif p == "-L":
    IL_LED = v
  elif p == "-T":
    IL_TESTLED = v
  elif p == "-g":
    ILG_PID_FN = v
  elif p == "-d":
    ILD_PID_FN = v
  elif p == "-V":
    show_version()
    sys.exit(0)
  elif p == "-P":
    PORT_NUMBER = int(v)

def debug_print():
  print "ini:", IL_INI
  print "cfg:", DEFAULT_CFG
  print "led:", IL_LED
  print "test:", IL_TESTLED
  print "gpid", ILG_PID_FN
  print "dpid", ILD_PID_FN
  print "port", PORT_NUMBER

debug_print()

def resetcfg():
  global IL_INI

  print "resetcfg:", IL_INI

  tmpfd,tmpname = tempfile.mkstemp()
  try:
    with os.fdopen(tmpfd, "w") as tmpfp:
      with open(DEFAULT_CFG) as fp:
        tmpfp.write( fp.read() )
      tmpfp.flush()
    os.rename(tmpname, IL_INI)
  finally:
    pass


def restartproc():
  os.system("/bin/kill $( cat " + str(ILG_PID_FN) + " )")
  os.system("/usr/bin/sudo /bin/kill $( cat " + str(ILD_PID_FN) + " )")

def rebootmachine():
  os.system("/sbin/shutdown -r now")


def writeledtest(data):
  tmpfd,tmpname = tempfile.mkstemp()

  print "....write led test", data

  try:
    with os.fdopen(tmpfd, "w") as tmpfp:
      for x in data:
        tmpfp.write( "#" + x + "\n" + "\n".join(str(data[x]).split(":")) + "\n" )
      tmpfp.flush()
    os.rename(tmpname, IL_TESTLED)
  finally:
    pass

  os.system("/bin/kill -SIGHUP $( cat " + str(ILG_PID_FN) + " )" )

def writeini(data):

  print "writeini:", IL_INI

  tmpfd,tmpname = tempfile.mkstemp()
  try:
    with os.fdopen(tmpfd, "w") as tmpfp:
      for x in data:
        tmpfp.write( str(x) + "=" + str(data[x]) + "\n" )
      tmpfp.flush()
    os.rename(tmpname, IL_INI)
  finally:
    pass

  os.system("/bin/kill -SIGHUP $( cat " + str(ILG_PID_FN) + " )" )

def ledreset():
  n_led = -1
  with open(IL_INI) as fp:
    for line in fp:
      line = line.strip()
      if len(line) == 0: continue
      if line[0] == '#': continue
      kv = line.split("=")
      if len(kv) != 2: continue
      if kv[0] == "count_led":
        n_led = int(kv[1])
        break
  if (n_led < 0) or (n_led > 1000):
    print "ledreset: n_led is out of range:", n_led, ", ignoring"
    return

  print "ledreset: creating new LED file", IL_LED, "(" + str(n_led) + ")"

  os.system("/bin/rm -f " + IL_LED)
  os.system( ILG_EXE + " -n " + str(n_led) + " -C -L " + IL_LED )
  os.system("/bin/kill -SIGHUP $( cat " + str(ILG_PID_FN) + " )" )
  os.system("/bin/kill -SIGHUP $( cat " + str(ILD_PID_FN) + " )" )


def configreq():
  dat = {}

  print "configreq:", IL_INI

  with open(IL_INI) as fp:
    for line in fp:
      print line
      line = line.strip();
      if len(line)==0: continue
      if line[0] == '#': continue
      kv = line.split("=")
      if len(kv) != 2: continue

      dat[kv[0]] = kv[1]
  return dat

#This class will handles any incoming request from
#the browser 
class myHandler(BaseHTTPRequestHandler):
  
  #Handler for the GET requests
  def do_GET(self):
    if self.path=="/":
      self.path="/index.html"

    try:
      #Check the file extension required and
      #set the right mime type

      sendReply = False
      if self.path.endswith(".html"):
        mimetype='text/html'
        sendReply = True
      if self.path.endswith(".jpg"):
        mimetype='image/jpg'
        sendReply = True
      if self.path.endswith(".png"):
        mimetype='image/png'
        sendReply = True
      if self.path.endswith(".gif"):
        mimetype='image/gif'
        sendReply = True
      if self.path.endswith(".js"):
        mimetype='application/x-javascript'
        sendReply = True
        print "???", mimetype
      if self.path.endswith(".css"):
        mimetype='text/css'
        sendReply = True
      if self.path.endswith(".ico"):
        mimetype='image/x-icon'
        sendReply = True

      if sendReply == True:

        #Open the static file requested and send it
        #
        f = open(curdir + sep + self.path) 
        self.send_response(200)
        self.send_header('Content-type',mimetype)
        self.end_headers()
        self.wfile.write(f.read())
        f.close()
      return

    except IOError:
      self.send_error(404,'File Not Found: %s' % self.path)

  # Handler for the POST requests
  #
  def do_POST(self):
    if self.path=="/ledtest":

      form = cgi.FieldStorage(
        fp=self.rfile, 
        headers=self.headers,
        environ={'REQUEST_METHOD':'POST',
                     'CONTENT_TYPE':self.headers['Content-Type'],
      })

      data = {}
      for x in form:
        data[ str(x) ] = str(form[x].value)

      writeledtest(data)

      self.send_response(200)
      self.end_headers()
      self.wfile.write("ok")
      return

    if self.path=="/config":

      dat = configreq()
      dat_str = json.dumps(dat)

      self.send_response(200)
      self.end_headers()
      self.wfile.write(dat_str)
      pass

    if self.path=="/req":
      form = cgi.FieldStorage(
        fp=self.rfile, 
        headers=self.headers,
        environ={'REQUEST_METHOD':'POST',
                     'CONTENT_TYPE':self.headers['Content-Type'],
      })

      data = {}
      for x in form:
        data[ str(x) ] = str(form[x].value)
        if x == "palette":
          color_a = str(form[x].value).split(",")
          for idx in range(len(color_a)):
            data[ "color" + str(idx) ] = color_a[idx]
        if x == "ledmap":
          ledmap = str(form[x].value).split(",")
          for idx in range(len(ledmap)):
            data[ "map" + str(idx) ] = ledmap[idx]

      print data

      writeini(data)

      self.send_response(200)
      self.end_headers()
      self.wfile.write("ok")
      return      

    if self.path=="/ledreset":
      ledreset()

      self.send_response(200)
      self.end_headers()
      self.wfile.write("ok")
      return

    if self.path=="/reset":
      print "reset..."

      resetcfg()

      self.send_response(200)
      self.end_headers()
      self.wfile.write("ok")
      pass

    if self.path=="/restart":
      print "restart..."

      restartproc()

      self.send_response(200)
      self.end_headers()
      self.wfile.write("ok")
      pass

    if self.path=="/reboot":
      print "reboot..."

      rebootmachine()

      self.send_response(200)
      self.end_headers()
      self.wfile.write("ok")
      pass


try:

  # Create a web server and define the handler to manage the
  # incoming request
  #
  server = HTTPServer(('', PORT_NUMBER), myHandler)
  print 'Started httpserver on port ' , PORT_NUMBER
  
  # Wait forever for incoming htto requests
  #
  server.serve_forever()

except KeyboardInterrupt:
  print '^C received, shutting down the web server'
  server.socket.close()
  
