#!/bin/bash

#g++ -I./include  main.cpp ./SoundTouch/BPMDetect.cpp ./SoundTouch/FIFOSampleBuffer.cpp ./SoundTouch/PeakFinder.cpp -o beatsrv-main
#gcc beatsrv.c -o beatsrv -lfftw3 -lm

gcc -O3 beatsrv_s16le.c -o beatsrv_s16le -lfftw3 -lm


