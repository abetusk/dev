#!/usr/bin/python

from PIL import Image
import numpy as np

## https://www-eng-x.llnl.gov/documents/tests/tiff.html
im = Image.open('a_image.tif')
#im.show()

imarray = np.array(im)

print imarray.shape
print imarray.size



out_img = Image.fromarray(imarray)

