#!/usr/bin/python
#
# taken from https://www.acmesystems.it/python_http
# CCY-BY-SA Sergio Tanzilli
#
from BaseHTTPServer import BaseHTTPRequestHandler,HTTPServer
from os import curdir, sep
import cgi
import tempfile
import os

PORT_NUMBER = 8080

BASE_DIR = "/tmp/"

IL_INI = BASE_DIR + "innerlight.ini"
IL_TESTLED = BASE_DIR + "ledtest.txt"
IL_LED = BASE_DIR + "innerlight.led"

ILG_EXE = "./inner-light-drive"

ILG_PID_FN = BASE_DIR + "inner-light-generator.pid"
ILD_PID_FN = BASE_DIR + "inner-light-drive.pid"

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

  #Handler for the POST requests
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
  
