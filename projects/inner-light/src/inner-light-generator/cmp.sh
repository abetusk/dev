#!/bin/bash

g++ -g inner-light-generator-config.cpp cfgtest.cpp -o cfgtest -lm
#g++ -O3 simplexnoise1234.c inner-light-generator.cpp inner-light-generator-config.cpp -o inner-light-generator -lm
g++ -O3 simplexnoise1234.c inner-light-generator.cpp inner-light-generator-config.cpp lodepng.cpp -o inner-light-generator -lm
