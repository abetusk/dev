#!/bin/bash

ffmpeg -r 60 -f image2 -s 2048x1536 -i %04d.jpg -vcodec libx264 -crf 25 -pix_fmt yuv420p out.mp4
ffmpeg -i out.mp4 -filter:v "crop=1792:1280" cropped.mp4
