#!/usr/bin/python
#
# taken from https://www.acmesystems.it/python_http
# CCY-BY-SA Sergio Tanzilli
#
from BaseHTTPServer import BaseHTTPRequestHandler,HTTPServer
from os import curdir, sep
import cgi

PORT_NUMBER = 8080

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

        print "wtf??", mimetype

        #Open the static file requested and send it
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
    if self.path=="/req":
      form = cgi.FieldStorage(
        fp=self.rfile, 
        headers=self.headers,
        environ={'REQUEST_METHOD':'POST',
                     'CONTENT_TYPE':self.headers['Content-Type'],
      })

      for x in form:
        print "form:", x

      #print "Your name is: %s" % form["your_name"].value
      self.send_response(200)
      self.end_headers()
      #self.wfile.write("Thanks %s !" % form["your_name"].value)
      self.wfile.write("ok")
      return      
      
      
try:
  #Create a web server and define the handler to manage the
  #incoming request
  server = HTTPServer(('', PORT_NUMBER), myHandler)
  print 'Started httpserver on port ' , PORT_NUMBER
  
  #Wait forever for incoming htto requests
  server.serve_forever()

except KeyboardInterrupt:
  print '^C received, shutting down the web server'
  server.socket.close()
  
