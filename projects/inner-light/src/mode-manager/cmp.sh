#!/bin/bash

gcc rando-inp.c -o rando-inp
gcc rando-inp-encoder.c -o rando-inp-encoder
#g++ -O3 mode-manager.cpp RGBConverter.cpp -o mode-manager
g++ -O3 mode-manager.cpp -o mode-manager
