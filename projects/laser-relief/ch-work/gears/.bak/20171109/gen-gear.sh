#!/bin/bash
#

diam_base_mm=`expr 140 + 40`

hole_diam=4

## teeth for base and driver gear
##
## t_base = round( diam_base_mm * pi / pitch )
##
t_base=71
t_base_driver=30

diam_inner_mm=40
diam_outer_mm=120

## teeth for gears that sit on the
## base
##
## t_inner = round( diam_inner_mm * pi / pitch )
##
t_inner=16
t_outer=47

## circular pitch (in mm)
##
pitch=8

## gear codes
##
gear1=1
gear2=2
gear1gear2=3

involute-gear-generator \
  --circularPitch $pitch  \
  --pressureAnge 20 \
  --clearance 0.05 \
  --backlash 0.05 \
  --profileShift 0 \
  --wheel1ToothCount $t_base \
  --wheel1CenterHoleDiameter $hole_diam  \
  #--wheel2ToothCount $t_base_driver \
  #--wheel2CenterHoleDiameter $hole_diam  \
  --showOption $gear1 \
  --qualityOption 30 \
  -o base_driver.dxf

involute-gear-generator \
  --circularPitch $pitch  \
  --pressureAnge 20 \
  --clearance 0.05 \
  --backlash 0.05 \
  --profileShift 0 \
  --wheel1ToothCount $t_base_driver \
  --wheel1CenterHoleDiameter $hole_diam  \
  --showOption $gear1 \
  --qualityOption 30 \
  -o driver.dxf

involute-gear-generator \
  --circularPitch $pitch \
  --pressureAnge 20 \
  --clearance 0.05 \
  --backlash 0.05 \
  --profileShift 0 \
  --wheel1ToothCount $t_inner \
  --wheel1CenterHoleDiameter $hole_diam \
  --wheel2ToothCount $t_outer \
  --wheel2CenterHoleDiameter $hole_diam \
  --showOption $gear1gear2 \
  --qualityOption 30 \
  -o inner_outer.dxf


