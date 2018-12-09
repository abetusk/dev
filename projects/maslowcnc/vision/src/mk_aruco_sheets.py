#!/usr/bin/python
#
# window is about 70mm high
# maybe 150mm high
#

from PIL import Image
from PIL import ImageFont
from PIL import ImageDraw

import numpy as np
import math
import os
import sys

ctx = {
  "mm_per_in" : 25.40,
  "in_per_mm" : 1.0/25.4,
  #"h_in" : 17,
  #"w_in" : 11,
  #"h_mm" : 17 * 25.4,
  #"w_mm" : 11 * 25.4,
  "h_in" : 12*3,
  "w_in" : 12*8,
  "h_mm" : 12*3* 25.4,
  "w_mm" : 12*8* 25.4,
  "dpi" : 300.0,
  "dpmm" : 300.0 * (1.0/25.4),
#  "aruco_spacing_mm" : 20.0,
#  "aruco_width_mm" : 20.0,
#  "aruco_spacing_in" : 20.0 * (1.0/25.4),
#  "aruco_width_in" : 20 * (1.0/25.4),
  "aruco_spacing_mm" : 10.0,
  "aruco_width_mm" : 10.0,
  "aruco_spacing_in" : 10.0 * (1.0/25.4),
  "aruco_width_in" : 10 * (1.0/25.4),
  "mark_print" : True,
  "font" : "/home/abe/data/fonts/pixelated.ttf",
  "font_size" : 32,
  "x_offset" : 0,
  "y_offset" : 0
}

def setup_ctx_in(ctx, w_in, h_in):
  ctx["w_in"] = float(w_in)
  ctx["h_in"] = float(h_in)
  ctx["w_mm"] = ctx["w_in"] * ctx["mm_per_in"]
  ctx["h_mm"] = ctx["h_in"] * ctx["mm_per_in"]
  ctx["sheet_unit_width"] = int(ctx["dpi"]*ctx["w_in"])
  ctx["sheet_unit_height"] = int(ctx["dpi"]*ctx["h_in"])
  ctx["sheet_aruco_spacing"] = int(ctx["aruco_spacing_in"] * ctx["dpi"])
  ctx["sheet_aruco_width"] = int(ctx["aruco_width_in"] * ctx["dpi"])

#setup_ctx_in(ctx, 11, 17)

def load_aruco_dict(fn, aruco_dict):
  fp = open(fn, "r")

  n=0
  nbits=0
  hdr = ""
  hdr1 = ""
  line_count=0

  aruco_dict["data"] = []
  aruco_dict["img_data"] = []

  for line in fp:
    line = line.strip()
    line_count+=1
    if line_count==1:
      hdr = line
      fields = line.split(" ")
      aruco_dict["name"] = fields[1]
      continue
    if line_count==2:
      hdr1 = line
      fields = line.split(" ")
      nbits = int(fields[1])
      n = int(math.sqrt(nbits))
      aruco_dict["nbits"] = nbits
      aruco_dict["n"] = n
      aruco_dict["n_padded"] = n+2
      continue

    if n==0:
      print 'error, no nbits?'
      return

    onval = 255
    a = np.zeros((n+2,n+2)).astype(np.uint8)
    for pos in range(len(line)):
      y = (pos/n)+1
      x = (pos%n)+1
      if line[pos] == '1':
        a[y][x] = onval
    aruco_dict["data"].append(a)
    aruco_dict["img_data"].append( Image.fromarray(a) )

  fp.close()

  return aruco_dict

aruco_dict = {}
load_aruco_dict("/home/abe/data/vision/mip36h12.dict", aruco_dict)

#setup_ctx_in(ctx, 11, 17)
setup_ctx_in(ctx, 12*3, 12*8)
ctx["dict"] = aruco_dict

#print aruco_dict["data"][0]
#sys.exit(0)

#print aruco_dict
#sys.exit(0)

#z = np.zeros((50,32))

#mm_per_in = 25.40
#in_per_mm = 1.0/mm_per_in
#h_in = 17
#w_in = 11
#h_mm = h_in * mm_per_in
#w_mm = w_in * mm_per_in
#dpi = 300
#aruco_spacing_mm = 20
#aruco_width_mm = 20
#aruco_spacing_in = aruco_spacing_mm * in_per_mm
#aruco_width_in = aruco_width_mm * in_per_mm
#dpmm = dpi * in_per_mm

print "dpi:", ctx["dpi"], "dpmm:", ctx["dpmm"], "dots per aruco glyph:", ctx["dpmm"]*ctx["aruco_width_mm"]
print "size in(", ctx["w_in"], ctx["h_in"], ")","mm(", ctx["w_mm"], ctx["h_mm"],")"

print "aruco spacing:", ctx["aruco_spacing_in"], "in,", ctx["aruco_spacing_mm"], "mm"
print "aruco width:", ctx["aruco_width_in"], "in, ", ctx["aruco_width_mm"], "mm"

#ctx["sheet_unit_width"] = int(ctx["dpi"]*ctx["w_in"])
#ctx["sheet_unit_height"] = int(ctx["dpi"]*ctx["h_in"])
#ctx["sheet_aruco_spacing"] = int(ctx["aruco_spacing_in"] * ctx["dpi"])
#ctx["sheet_aruco_width"] = int(ctx["aruco_width_in"] * ctx["dpi"])

print ctx["sheet_unit_width"], ctx["sheet_unit_height"], ctx["sheet_aruco_spacing"], ctx["sheet_aruco_width"]

def plop_aruco_img(img_array, x, y, ctx, aruco_idx):
  sz = ctx["sheet_aruco_width"], ctx["sheet_aruco_width"]
  img_src = aruco_dict["img_data"][aruco_idx]
  img = img_src.resize(sz)
  pix = np.array(img).reshape(sz)
  for yy in range(ctx["sheet_aruco_width"]):
    for xx in range(ctx["sheet_aruco_width"]):
      imx = ctx["sheet_aruco_spacing"] + x + xx
      imy = ctx["sheet_aruco_spacing"] + y + yy
      if (imx < ctx["sheet_unit_width"]) and (imy < ctx["sheet_unit_height"]) and (imx >= 0) and (imy >= 0):
        img_array[imy][imx] = pix[yy][xx]

def plop_aruco_img_spacing(img_array, x, y, spacing, ctx, aruco_idx):
  sz = ctx["sheet_aruco_width"], ctx["sheet_aruco_width"]
  img_src = aruco_dict["img_data"][aruco_idx]
  img = img_src.resize(sz)
  pix = np.array(img).reshape(sz)
  for yy in range(ctx["sheet_aruco_width"]):
    for xx in range(ctx["sheet_aruco_width"]):
      imx = spacing[0] + x + xx
      imy = spacing[1] + y + yy
      if (imx < ctx["sheet_unit_width"]) and (imy < ctx["sheet_unit_height"]) and (imx >= 0) and (imy >= 0):
        img_array[imy][imx] = pix[yy][xx]


## simple
##
def make_aruco_image(out_fn, ctx, aruco_idx):

  img_array = np.zeros((ctx["sheet_unit_height"], ctx["sheet_unit_width"])).astype(np.uint8)
  for y in range(int(ctx["sheet_unit_height"])):
    for x in range(ctx["sheet_unit_width"]):
      img_array[y][x] = 255

  idx = [0,0]

  sp = ctx["sheet_aruco_spacing"]
  dw = ctx["sheet_aruco_width"]

  #for y in range(0, ctx["sheet_unit_height"], ctx["sheet_aruco_spacing"] + ctx["sheet_aruco_width"]):
  for y in range(0, ctx["sheet_unit_height"] - (sp+dw) , sp+dw):
    idx[0] = 0
    #for x in range(0, ctx["sheet_unit_width"], ctx["sheet_aruco_spacing"] + ctx["sheet_aruco_width"]):
    for x in range(0, ctx["sheet_unit_width"] - (sp+dw), sp+dw):


      plop_aruco_img(img_array, x, y, ctx, aruco_idx)

      idx[0] += 1
    idx[1] += 1

  img_pil = Image.fromarray(img_array)
  img_pil.save(out_fn)

## simple
##
def make_aruco_image_i(out_fn, ctx, aruco_idxs):

  img_array = np.zeros((ctx["sheet_unit_height"], ctx["sheet_unit_width"])).astype(np.uint8)
  for y in range(int(ctx["sheet_unit_height"])):
    for x in range(ctx["sheet_unit_width"]):
      img_array[y][x] = 255

  idx = [0,0]

  n_idx = len(aruco_idxs)

  if n_idx<1: return False

  h = ctx["sheet_unit_height"]
  w = ctx["sheet_unit_width"]
  sp = ctx["sheet_aruco_spacing"]
  dw = ctx["sheet_aruco_width"]

  ds = sp+dw

  max_y_idx = int( float(h - 2*ds) / float(ds) )
  max_x_idx = int( float(w - 2*ds) / float(ds) )

  #print "##", h, w, sp, dw, ds, max_y_idx, max_x_idx

  #for y in range(0, ctx["sheet_unit_height"], ctx["sheet_aruco_spacing"] + ctx["sheet_aruco_width"]):
  for y in range(0, h-2*ds, ds):
    idx[0] = 0
    #for x in range(0, ctx["sheet_unit_width"], ctx["sheet_aruco_spacing"] + ctx["sheet_aruco_width"]):
    for x in range(0, w-2*ds, ds):

      aruco_idx = aruco_idxs[0]
      if (idx[0] == 0) and (idx[1] == 0):
        aruco_idx = aruco_idxs[0]
      elif (idx[0] == idx[1]):
        aruco_idx = aruco_idxs[1%n_idx]
      elif (idx[0] == 0):
        aruco_idx = aruco_idxs[2%n_idx]
      elif (idx[1] == 0):
        aruco_idx = aruco_idxs[3%n_idx]
      elif (idx[0] == max_y_idx):
        aruco_idx = aruco_idxs[4%n_idx]
      elif (idx[1] == max_x_idx):
        aruco_idx = aruco_idxs[5%n_idx]
      else:
        if n_idx > 6:
          aruco_idx = aruco_idxs[ ((idx[0]*idx[1])%(n_idx-6)) + 6]

          #print ">>>", aruco_idx, idx

        else:
          aruco_idx = aruco_idxs[(idx[0]*idx[1])%(n_idx)]


      plop_aruco_img(img_array, x, y, ctx, aruco_idx)

      idx[0] += 1
    idx[1] += 1

  img_pil = Image.fromarray(img_array)
  img_pil.save(out_fn)

  return True


## upper left corener
## [ ul, up, left, mid, up_tri, low_tri ]
##
def make_aruco_image_ul(out_fn, ctx, aruco_idxs):

  img_array = np.zeros((ctx["sheet_unit_height"], ctx["sheet_unit_width"])).astype(np.uint8)
  for y in range(int(ctx["sheet_unit_height"])):
    for x in range(ctx["sheet_unit_width"]):
      img_array[y][x] = 255

  idx = [0,0]

  x_offset = ctx["x_offset"]
  y_offset = ctx["y_offset"]

  for y in range(0, ctx["sheet_unit_height"], ctx["sheet_aruco_spacing"] + ctx["sheet_aruco_width"]):
    idx[0] = 0
    for x in range(0, ctx["sheet_unit_width"], ctx["sheet_aruco_spacing"] + ctx["sheet_aruco_width"]):

      aruco_idx=-1
      if (idx[0] == 0) and (idx[1] == 0):
        aruco_idx = aruco_idxs[0]
      elif (idx[1]==0):
        aruco_idx = aruco_idxs[1]
      elif (idx[0]==0):
        aruco_idx = aruco_idxs[2]
      elif (idx[0]==idx[1]):
        aruco_idx = aruco_idxs[3]
      elif (idx[0]>idx[1]):
        aruco_idx = aruco_idxs[4]
      else:
        aruco_idx = aruco_idxs[5]

      plop_aruco_img(img_array, x + x_offset, y + y_offset, ctx, aruco_idx)

      idx[0] += 1
    idx[1] += 1

  img_pil = Image.fromarray(img_array)

  if ctx["mark_print"]:
    draw = ImageDraw.Draw(img_pil)
    font = ImageFont.truetype(ctx["font"],ctx["font_size"])
    draw.text(( ctx["font_size"], ctx["font_size"] ), "ul: " + " ".join(map(str,aruco_idxs)), (128), font=font)

  img_pil.save(out_fn)

## upper right
## [ ur, up, right, mid, up_tri, low_tri ]
##
def make_aruco_image_ur(out_fn, ctx, aruco_idxs):

  img_array = np.zeros((ctx["sheet_unit_height"], ctx["sheet_unit_width"])).astype(np.uint8)
  for y in range(int(ctx["sheet_unit_height"])):
    for x in range(ctx["sheet_unit_width"]):
      img_array[y][x] = 255

  idx = [0,0]

  x_offset = ctx["x_offset"]
  y_offset = ctx["y_offset"]

  chunk = ctx["sheet_aruco_spacing"] + ctx["sheet_aruco_width"]

  for y in range(0, ctx["sheet_unit_height"], chunk):
    idx[0] = 0
    #for x in range(0, ctx["sheet_unit_width"], ctx["sheet_aruco_spacing"] + ctx["sheet_aruco_width"]):
    for x in range(ctx["sheet_unit_width"] - chunk, -chunk, -chunk):

      aruco_idx=-1
      if (idx[0] == 0) and (idx[1] == 0):
        aruco_idx = aruco_idxs[0]
      elif (idx[1]==0):
        aruco_idx = aruco_idxs[1]
      elif (idx[0]==0):
        aruco_idx = aruco_idxs[2]
      elif (idx[0]==idx[1]):
        aruco_idx = aruco_idxs[3]
      elif (idx[0]>idx[1]):
        aruco_idx = aruco_idxs[4]
      else:
        aruco_idx = aruco_idxs[5]

      plop_aruco_img_spacing(img_array, x + x_offset, y + y_offset, [0,ctx["sheet_aruco_spacing"]], ctx, aruco_idx)

      idx[0] += 1
    idx[1] += 1

  img_pil = Image.fromarray(img_array)

  if ctx["mark_print"]:
    draw = ImageDraw.Draw(img_pil)
    font = ImageFont.truetype(ctx["font"],ctx["font_size"])
    draw.text(( ctx["font_size"], ctx["font_size"] ), "ur: " + " ".join(map(str,aruco_idxs)), (128), font=font)


  img_pil.save(out_fn)

## lower right
## [ lr, down, right, mid, up_tri, low_tri ]
##
def make_aruco_image_lr(out_fn, ctx, aruco_idxs):

  img_array = np.zeros((ctx["sheet_unit_height"], ctx["sheet_unit_width"])).astype(np.uint8)
  for y in range(int(ctx["sheet_unit_height"])):
    for x in range(ctx["sheet_unit_width"]):
      img_array[y][x] = 255

  idx = [0,0]

  x_offset = ctx["x_offset"]
  y_offset = ctx["y_offset"]

  chunk = ctx["sheet_aruco_spacing"] + ctx["sheet_aruco_width"]

  for y in range(ctx["sheet_unit_height"] - chunk, -chunk, -chunk):
    idx[0] = 0
    #for x in range(0, ctx["sheet_unit_width"], ctx["sheet_aruco_spacing"] + ctx["sheet_aruco_width"]):
    for x in range(ctx["sheet_unit_width"] - chunk, -chunk, -chunk):

      aruco_idx=-1
      if (idx[0] == 0) and (idx[1] == 0):
        aruco_idx = aruco_idxs[0]
      elif (idx[1]==0):
        aruco_idx = aruco_idxs[1]
      elif (idx[0]==0):
        aruco_idx = aruco_idxs[2]
      elif (idx[0]==idx[1]):
        aruco_idx = aruco_idxs[3]
      elif (idx[0]>idx[1]):
        aruco_idx = aruco_idxs[4]
      else:
        aruco_idx = aruco_idxs[5]

      plop_aruco_img_spacing(img_array, x + x_offset, y + y_offset, [0,0], ctx, aruco_idx)

      idx[0] += 1
    idx[1] += 1

  img_pil = Image.fromarray(img_array)

  if ctx["mark_print"]:
    draw = ImageDraw.Draw(img_pil)
    font = ImageFont.truetype(ctx["font"],ctx["font_size"])
    draw.text(( ctx["sheet_unit_width"] - 20*ctx["font_size"], ctx["sheet_unit_height"] - 2*ctx["font_size"]), "lr: " + " ".join(map(str,aruco_idxs)), (128), font=font)


  img_pil.save(out_fn)


## lower left
## [ ll, down, left, mid, up_tri, low_tri ]
##
def make_aruco_image_ll(out_fn, ctx, aruco_idxs):

  img_array = np.zeros((ctx["sheet_unit_height"], ctx["sheet_unit_width"])).astype(np.uint8)
  for y in range(int(ctx["sheet_unit_height"])):
    for x in range(ctx["sheet_unit_width"]):
      img_array[y][x] = 255

  idx = [0,0]

  x_offset = ctx["x_offset"]
  y_offset = ctx["y_offset"]

  chunk = ctx["sheet_aruco_spacing"] + ctx["sheet_aruco_width"]
  sp = ctx["sheet_aruco_spacing"]

  for y in range(ctx["sheet_unit_height"] - chunk, -chunk, -chunk):
    idx[0] = 0
    #for x in range(0, ctx["sheet_unit_width"], ctx["sheet_aruco_spacing"] + ctx["sheet_aruco_width"]):
    for x in range(0, ctx["sheet_unit_width"], chunk):

      aruco_idx=-1
      if (idx[0] == 0) and (idx[1] == 0):
        aruco_idx = aruco_idxs[0]
      elif (idx[1]==0):
        aruco_idx = aruco_idxs[1]
      elif (idx[0]==0):
        aruco_idx = aruco_idxs[2]
      elif (idx[0]==idx[1]):
        aruco_idx = aruco_idxs[3]
      elif (idx[0]>idx[1]):
        aruco_idx = aruco_idxs[4]
      else:
        aruco_idx = aruco_idxs[5]

      plop_aruco_img_spacing(img_array, x + x_offset, y + y_offset, [sp,0], ctx, aruco_idx)

      idx[0] += 1
    idx[1] += 1

  img_pil = Image.fromarray(img_array)

  if ctx["mark_print"]:
    draw = ImageDraw.Draw(img_pil)
    font = ImageFont.truetype(ctx["font"],ctx["font_size"])
    draw.text(( ctx["font_size"], ctx["sheet_unit_height"] - 2*ctx["font_size"]), "ll: " + " ".join(map(str,aruco_idxs)), (128), font=font)


  img_pil.save(out_fn)


## upper
## [ up, under ]
def make_aruco_image_up(out_fn, ctx, aruco_idxs):

  img_array = np.zeros((ctx["sheet_unit_height"], ctx["sheet_unit_width"])).astype(np.uint8)
  for y in range(int(ctx["sheet_unit_height"])):
    for x in range(ctx["sheet_unit_width"]):
      img_array[y][x] = 255

  idx = [0,0]

  x_offset = ctx["x_offset"]
  y_offset = ctx["y_offset"]

  chunk = ctx["sheet_aruco_spacing"] + ctx["sheet_aruco_width"]
  sp = ctx["sheet_aruco_spacing"]

  x_offset = sp/2

  for y in range(0, ctx["sheet_unit_height"], chunk):
    idx[0] = 0
    for x in range(0, ctx["sheet_unit_width"], chunk):

      aruco_idx=-1
      if (idx[1]==0):
        aruco_idx = aruco_idxs[0]
      else:
        aruco_idx = aruco_idxs[1]

      plop_aruco_img_spacing(img_array, x + x_offset, y + y_offset, [0,sp], ctx, aruco_idx)

      idx[0] += 1
    idx[1] += 1

  img_pil = Image.fromarray(img_array)

  if ctx["mark_print"]:
    draw = ImageDraw.Draw(img_pil)
    font = ImageFont.truetype(ctx["font"],ctx["font_size"])
    draw.text(( ctx["font_size"], ctx["font_size"]), "up: " + " ".join(map(str,aruco_idxs)), (128), font=font)


  img_pil.save(out_fn)

## upper
## [ down , under ]
def make_aruco_image_down(out_fn, ctx, aruco_idxs):

  img_array = np.zeros((ctx["sheet_unit_height"], ctx["sheet_unit_width"])).astype(np.uint8)
  for y in range(int(ctx["sheet_unit_height"])):
    for x in range(ctx["sheet_unit_width"]):
      img_array[y][x] = 255

  idx = [0,0]

  x_offset = ctx["x_offset"]
  y_offset = ctx["y_offset"]

  chunk = ctx["sheet_aruco_spacing"] + ctx["sheet_aruco_width"]
  sp = ctx["sheet_aruco_spacing"]

  x_offset = sp/2

  for y in range(ctx["sheet_unit_height"]-chunk, -chunk, -chunk):
    idx[0] = 0
    for x in range(0, ctx["sheet_unit_width"], chunk):

      aruco_idx=-1
      if (idx[1]==0):
        aruco_idx = aruco_idxs[0]
      else:
        aruco_idx = aruco_idxs[1]

      plop_aruco_img_spacing(img_array, x + x_offset, y + y_offset, [0,0], ctx, aruco_idx)

      idx[0] += 1
    idx[1] += 1

  img_pil = Image.fromarray(img_array)

  if ctx["mark_print"]:
    draw = ImageDraw.Draw(img_pil)
    font = ImageFont.truetype(ctx["font"],ctx["font_size"])
    draw.text(( ctx["font_size"], ctx["sheet_unit_height"] - 2*ctx["font_size"]), "down: " + " ".join(map(str,aruco_idxs)), (128), font=font)


  img_pil.save(out_fn)

## left
## [ left, under ]
def make_aruco_image_left(out_fn, ctx, aruco_idxs):

  img_array = np.zeros((ctx["sheet_unit_height"], ctx["sheet_unit_width"])).astype(np.uint8)
  for y in range(int(ctx["sheet_unit_height"])):
    for x in range(ctx["sheet_unit_width"]):
      img_array[y][x] = 255

  idx = [0,0]

  x_offset = ctx["x_offset"]
  y_offset = ctx["y_offset"]

  chunk = ctx["sheet_aruco_spacing"] + ctx["sheet_aruco_width"]
  sp = ctx["sheet_aruco_spacing"]

  y_offset = sp/2

  for y in range(0, ctx["sheet_unit_height"], chunk):
    idx[0] = 0
    for x in range(0, ctx["sheet_unit_width"], chunk):

      aruco_idx=-1
      if (idx[0]==0):
        aruco_idx = aruco_idxs[0]
      else:
        aruco_idx = aruco_idxs[1]

      plop_aruco_img_spacing(img_array, x + x_offset, y + y_offset, [sp,0], ctx, aruco_idx)

      idx[0] += 1
    idx[1] += 1

  img_pil = Image.fromarray(img_array)

  if ctx["mark_print"]:
    draw = ImageDraw.Draw(img_pil)
    font = ImageFont.truetype(ctx["font"],ctx["font_size"])
    draw.text(( ctx["font_size"], ctx["font_size"]), "left: " + " ".join(map(str,aruco_idxs)), (128), font=font)


  img_pil.save(out_fn)

## left
## [ left, under ]
def make_aruco_image_right(out_fn, ctx, aruco_idxs):

  img_array = np.zeros((ctx["sheet_unit_height"], ctx["sheet_unit_width"])).astype(np.uint8)
  for y in range(int(ctx["sheet_unit_height"])):
    for x in range(ctx["sheet_unit_width"]):
      img_array[y][x] = 255

  idx = [0,0]

  x_offset = ctx["x_offset"]
  y_offset = ctx["y_offset"]

  chunk = ctx["sheet_aruco_spacing"] + ctx["sheet_aruco_width"]
  sp = ctx["sheet_aruco_spacing"]

  y_offset = sp/2

  for y in range(0, ctx["sheet_unit_height"], chunk):
    idx[0] = 0
    for x in range(ctx["sheet_unit_width"]-chunk, -chunk, -chunk):

      aruco_idx=-1
      if (idx[0]==0):
        aruco_idx = aruco_idxs[0]
      else:
        aruco_idx = aruco_idxs[1]

      plop_aruco_img_spacing(img_array, x + x_offset, y + y_offset, [0,0], ctx, aruco_idx)

      idx[0] += 1
    idx[1] += 1

  img_pil = Image.fromarray(img_array)

  if ctx["mark_print"]:
    draw = ImageDraw.Draw(img_pil)
    font = ImageFont.truetype(ctx["font"],ctx["font_size"])
    draw.text(( ctx["font_size"], ctx["font_size"]), "right: " + " ".join(map(str,aruco_idxs)), (128), font=font)


  img_pil.save(out_fn)

## mid
## [ left ]
def make_aruco_image_mid(out_fn, ctx, aruco_idxs):

  img_array = np.zeros((ctx["sheet_unit_height"], ctx["sheet_unit_width"])).astype(np.uint8)
  for y in range(int(ctx["sheet_unit_height"])):
    for x in range(ctx["sheet_unit_width"]):
      img_array[y][x] = 255

  idx = [0,0]

  x_offset = ctx["x_offset"]
  y_offset = ctx["y_offset"]

  chunk = ctx["sheet_aruco_spacing"] + ctx["sheet_aruco_width"]
  sp = ctx["sheet_aruco_spacing"]

  x_offset = sp/2
  y_offset = sp/2

  for y in range(0, ctx["sheet_unit_height"], chunk):
    idx[0] = 0
    for x in range(ctx["sheet_unit_width"]-chunk, -chunk, -chunk):

      aruco_idx=aruco_idxs[0]
      plop_aruco_img_spacing(img_array, x + x_offset, y + y_offset, [0,0], ctx, aruco_idx)

      idx[0] += 1
    idx[1] += 1

  img_pil = Image.fromarray(img_array)

  if ctx["mark_print"]:
    draw = ImageDraw.Draw(img_pil)
    font = ImageFont.truetype(ctx["font"],ctx["font_size"])
    draw.text(( ctx["font_size"], ctx["font_size"]), "mid: " + " ".join(map(str,aruco_idxs)), (128), font=font)


  img_pil.save(out_fn)


def create_11x17():
  #make_aruco_image("out0.tif", ctx, 1)
  ##
  ## 9 top/bottom, 2 on top/bottom side corner, side 7 top/bottom
  ## 3 side, 1 left/right middle
  ## 7 middle
  ## 
  base_idx=0
  idxs = range(base_idx,base_idx+6)
  base_idx+=len(idxs)
  make_aruco_image_ul("img/ul.tif", ctx, idxs)

  print ">>>>", base_idx

  idxs = range(base_idx,base_idx+6)
  base_idx+=len(idxs)
  make_aruco_image_ur("img/ur.tif", ctx, idxs)

  print ">>>>", base_idx

  idxs = range(base_idx,base_idx+6)
  base_idx+=len(idxs)
  make_aruco_image_lr("img/lr.tif", ctx, idxs)

  print ">>>>", base_idx

  idxs = range(base_idx,base_idx+6)
  base_idx+=len(idxs)
  make_aruco_image_ll("img/ll.tif", ctx, idxs)


  for zz in range(7):
    print ">>>>", zz, base_idx
    idxs = range(base_idx,base_idx+2)
    base_idx+=2
    make_aruco_image_up("img/up" + str(zz) + ".tif", ctx, idxs)

    print ">>>>  ", base_idx

    idxs = range(base_idx,base_idx+2)
    base_idx+=2
    make_aruco_image_down("img/down" + str(zz) + ".tif", ctx, idxs)

    print ">>>>  ", base_idx
    
    idxs = range(base_idx,base_idx+2)
    base_idx+=2
    make_aruco_image_mid("img/mid" + str(zz) + ".tif", ctx, idxs)

  print ">>>>", base_idx

  idxs = range(base_idx,base_idx+2)
  base_idx+=2
  make_aruco_image_left("img/left.tif", ctx, idxs)

  print ">>>>", base_idx

  idxs = range(base_idx,base_idx+2)
  base_idx+=2
  make_aruco_image_right("img/right.tif", ctx, idxs)

  print ">>>>", base_idx


base_idx=0
#idxs = range(base_idx,base_idx+6)
idxs = range(0,250)
base_idx+=len(idxs)
make_aruco_image_i("img/aruco0.tif", ctx, idxs)

