EESchema Schematic File Version 2
LIBS:power
LIBS:device
LIBS:transistors
LIBS:conn
LIBS:linear
LIBS:regul
LIBS:74xx
LIBS:cmos4000
LIBS:adc-dac
LIBS:memory
LIBS:xilinx
LIBS:special
LIBS:microcontrollers
LIBS:dsp
LIBS:microchip
LIBS:analog_switches
LIBS:motorola
LIBS:texas
LIBS:intel
LIBS:audio
LIBS:interface
LIBS:digital-audio
LIBS:philips
LIBS:display
LIBS:cypress
LIBS:siliconi
LIBS:opto
LIBS:atmel
LIBS:contrib
LIBS:valves
EELAYER 27 0
EELAYER END
$Descr A4 11693 8268
encoding utf-8
Sheet 1 1
Title ""
Date "30 nov 2013"
Rev ""
Comp ""
Comment1 ""
Comment2 ""
Comment3 ""
Comment4 ""
$EndDescr
$Comp
L ATTINY13-P IC1
U 1 1 5213C820
P -1950 350
F 0 "attiny13" H -1850 400 60 0000 C CNN
F 1 "VAL**" H -650 -400 60 0000 C CNN
        1    -1950 350 
        1    0    0    -1  
$EndComp
$Comp
L TRANSISTOR_BJT_NPN-SOT-23-BCE_SOT-23 U12
U 1 1 5213C820
P -1100 -400
F 0 "U12" H -1100 -400 0 
F 1 "TRANSISTOR_BJT_NPN-SOT-23-BCE_SOT-23" H -1100 -400 0 
        1    -1100 -400
        1    0    0    -1  
$EndComp
$Comp
L BATTERY_2032_BATT2032 U11
U 1 1 5213C820
P -2200 -1300
F 0 "bat" H -2200 -1300 0 0000 C CNN
F 1 "cr2032" H -2200 -1300 0 0000 C CNN
        1    -2200 -1300
        1    0    0    -1  
$EndComp
$Comp
L C C1
U 1 1 5213C820
P 550 -900
F 0 ".1mF" H 550 -800 40 0000 C CNN
F 1 "Val**" H 556 -985 40 0000 C CNN
        1    550  -900
        1    0    0    -1  
$EndComp
$Comp
L DIODE D2
U 1 1 5213C820
P 200 -900
F 0 "1n4148" H 200 -800 40 0000 C CNN
F 1 "Val**" H 200 -1000 40 0000 C CNN
        1    200  -900
        0    -1   -1   0   
$EndComp
$Comp
L CON_JST_2PIN-PTH_CON_JST_2PIN U6
U 1 1 5213C820
P -2800 -100
F 0 "ref**" H -2800 -100 0 0000 C CNN
F 1 "val**" H -2800 -100 0 0000 C CNN
        1    -2800 -100
        1    0    0    -1  
$EndComp
$Comp
L SW_SLIDE_SLIDE_SWITCH_SMD U5
U 1 1 5213C820
P -2400 -500
F 0 "ref**" H -2400 -500 0 0000 C CNN
F 1 "val**" H -2400 -500 0 0000 C CNN
        1    -2400 -500
        1    0    0    -1  
$EndComp
NoConn ~ -2150 950
Wire Wire Line
      -3000 0 -3000 150
$Comp
L ~GND #PWR13
U 1 1 5213C820
P -3000 150
F 0 "#PWR13" H -3000 150 30 
F 1 "~GND" H -3000 80 30 
        1    -3000 150 
        1    0    0    -1  
$EndComp
Wire Wire Line
      300 450 300 500
Wire Wire Line
      300 950 0 950
$Comp
L ~GND #PWR4
U 1 1 5213C820
P -1750 -1100
F 0 "#PWR4" H -1750 -1100 30 
F 1 "~GND" H -1750 -1170 30 
        1    -1750 -1100
        1    0    0    -1  
$EndComp
$Comp
L OPEN_HARDWARE_1 LOGO1
U 1 1 5213C820
P 950 850
F 0 "ref**" H 950 1125 60 0000 C CNN
F 1 "val**" H 950 625 60 0000 C CNN
        1    950  850 
        1    0    0    -1  
$EndComp
$Comp
L FIDUCIALTAB_FIDUCIALTAB U9
U 1 1 5213C820
P -3300 900
F 0 "ref" H -3300 900 0 0000 C CNN
F 1 "val" H -3300 900 0 0000 C CNN
        1    -3300 900 
        1    0    0    -1  
$EndComp
Wire Wire Line
      550 -600 200 -600
Text Label -3000 -700 0 40 ~ 0
pwr
Wire Wire Line
      -2800 0 -3000 0
Connection ~ -3000 -500
Wire Wire Line
      -2800 -100 -3000 -100
Wire Wire Line
      -3000 -100 -3000 -500
Wire Wire Line
      -2150 450 -2450 450
NoConn ~ -2150 850
Text Label -3300 800 0 40 ~ 0
art
$Comp
L FIDUCIALTAB_FIDUCIALTAB U10
U 1 1 5213C820
P -2750 900
F 0 "" H -2750 900 0 0000 C CNN
F 1 "" H -2750 900 0 0000 C CNN
        1    -2750 900 
        1    0    0    -1  
$EndComp
Text Label -2750 800 0 40 ~ 0
edge
Text Label -2450 450 0 40 ~ 0
mtr_sig
$Comp
L CON_JST_2PIN-PTH_CON_JST_2PIN U7
U 1 1 5213C820
P -350 -950
F 0 "ref**" H -350 -950 0 0000 C CNN
F 1 "val**" H -350 -950 0 0000 C CNN
        1    -350 -950
        1    0    0    -1  
$EndComp
$Comp
L VCC #PWR8
U 1 1 5213C820
P -700 -1250
F 0 "#PWR8" H -700 -1150 30 
F 1 "VCC" H -700 -1150 30 
        1    -700 -1250
        1    0    0    -1  
$EndComp
Wire Wire Line
      -700 -1250 -700 -950
Wire Wire Line
      -700 -950 -350 -950
Wire Wire Line
      -350 -850 -1000 -850
Wire Wire Line
      -1000 -850 -1000 -600
Connection ~ -600 -950
Wire Wire Line
      -600 -950 -600 -1250
Wire Wire Line
      -600 -1250 200 -1250
Wire Wire Line
      200 -1250 200 -1100
Connection ~ 200 -1250
Wire Wire Line
      550 -1100 550 -1250
Wire Wire Line
      550 -1250 200 -1250
Connection ~ -600 -850
Wire Wire Line
      -600 -850 -600 -600
Wire Wire Line
      -600 -600 200 -600
Wire Wire Line
      200 -600 200 -700
Connection ~ 200 -600
Wire Wire Line
      550 -700 550 -600
Text Label -2700 -1750 0 40 ~ 0
pwr
NoConn ~ -2150 550
NoConn ~ -2150 650
NoConn ~ -2150 750
Text Label -2450 50 0 40 ~ 0
pwr_conn
Text Label -200 -1400 0 40 ~ 0
motor
$Comp
L ~GND #PWR9
U 1 1 5213C820
P -1000 -50
F 0 "#PWR9" H -1000 -50 30 
F 1 "~GND" H -1000 -120 30 
        1    -1000 -50 
        1    0    0    -1  
$EndComp
Wire Wire Line
      -1000 -200 -1000 -50
Wire Wire Line
      -1200 -400 -1600 -400
Text Label -1600 -400 0 40 ~ 0
mtr_sig
$Comp
L VCC #PWR10
U 1 1 5213C820
P 0 250
F 0 "#PWR10" H 0 350 30 
F 1 "VCC" H 0 350 30 
        1    0    250 
        1    0    0    -1  
$EndComp
Wire Wire Line
      -150 450 0 450
Wire Wire Line
      0 450 0 250
$Comp
L ~GND #PWR11
U 1 1 5213C820
P 0 1100
F 0 "#PWR11" H 0 1100 30 
F 1 "~GND" H 0 1030 30 
        1    0    1100
        1    0    0    -1  
$EndComp
Wire Wire Line
      -150 950 0 950
Wire Wire Line
      0 950 0 1100
$Comp
L C C2
U 1 1 5213C820
P 300 700
F 0 "C2" H 300 800 40 
F 1 "C" H 306 615 40 
        1    300  700 
        1    0    0    -1  
$EndComp
Connection ~ 0 450
Wire Wire Line
      -2700 -500 -3000 -500
Wire Wire Line
      -3000 -500 -3000 -700
Connection ~ 0 950
$Comp
L VCC #PWR12
U 1 1 5213C820
P -2200 -800
F 0 "#PWR12" H -2200 -700 30 
F 1 "VCC" H -2200 -700 30 
        1    -2200 -800
        1    0    0    -1  
$EndComp
Wire Wire Line
      300 900 300 950
Wire Wire Line
      0 450 300 450
Wire Wire Line
      -1900 -1300 -1750 -1300
Wire Wire Line
      -1750 -1300 -1750 -1100
Wire Wire Line
      -2500 -1400 -2700 -1400
Wire Wire Line
      -2700 -1400 -2700 -1750
Connection ~ -2700 -1400
Wire Wire Line
      -2500 -1200 -2700 -1200
Wire Wire Line
      -2700 -1200 -2700 -1400
Wire Wire Line
      -2300 -600 -2200 -600
Wire Wire Line
      -2200 -600 -2200 -800
$EndSCHEMATC
