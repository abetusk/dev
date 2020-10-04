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
L CONN_8 P3
U 1 1 5213C820
P -1450 -600
F 0 "enc" V -1500 -600 60 0000 C CNN
F 1 "as5600" V -1400 -600 60 0000 C CNN
        1    -1450 -600
        1    0    0    -1  
$EndComp
$Comp
L CP1 C7
U 1 1 5213C820
P -2350 -650
F 0 "C1" H -2300 -550 50 0000 C CNN
F 1 "1uF" H -2300 -750 50 0000 C CNN
        1    -2350 -650
        1    0    0    -1  
$EndComp
$Comp
L CP1 C6
U 1 1 5213C820
P -2800 -850
F 0 "C0" H -2750 -750 50 0000 C CNN
F 1 "100nF" H -2750 -950 50 0000 C CNN
        1    -2800 -850
        1    0    0    -1  
$EndComp
$Comp
L CONN_4 P2
U 1 1 5213C820
P -2000 750
F 0 "CONN" V -2050 750 50 0000 C CNN
F 1 "VGCD" V -1950 750 50 0000 C CNN
        1    -2000 750 
        0    1    1    0   
$EndComp
$Comp
L CONN_4 P1
U 1 1 5213C820
P -150 -650
F 0 "x" V -200 -650 50 0000 C CNN
F 1 "screw" V -100 -650 50 0000 C CNN
        1    -150 -650
        1    0    0    -1  
$EndComp
Wire Wire Line
      -1950 -350 -1950 -50
Wire Wire Line
      -1950 -600 -1950 -650
Wire Wire Line
      -1950 -650 -1800 -650
Wire Wire Line
      -2050 -450 -1800 -450
Wire Wire Line
      -1950 -50 -2150 -50
NoConn ~ -1800 -250
Wire Wire Line
      -1800 -350 -1950 -350
Wire Wire Line
      -1550 100 -1550 250
Wire Wire Line
      -1850 100 -1550 100
NoConn ~ -500 -500
NoConn ~ -500 -800
NoConn ~ -500 -700
NoConn ~ -500 -600
$Comp
L ~GND #PWR9
U 1 1 5213C820
P -1550 250
F 0 "#PWR9" H -1550 250 30 
F 1 "~GND" H -1550 180 30 
        1    -1550 250 
        1    0    0    -1  
$EndComp
NoConn ~ -1800 -750
NoConn ~ -1800 -550
Connection ~ -2150 -50
Wire Wire Line
      -2150 -50 -2150 400
Connection ~ -2050 -450
Wire Wire Line
      -2050 400 -2050 -450
$Comp
L VCC #PWR10
U 1 1 5213C820
P -1950 200
F 0 "#PWR10" H -1950 300 30 
F 1 "VCC" H -1950 300 30 
        1    -1950 200 
        1    0    0    -1  
$EndComp
Wire Wire Line
      -1950 200 -1950 400
Connection ~ -1850 100
Wire Wire Line
      -1850 100 -1850 400
$Comp
L VCC #PWR11
U 1 1 5213C820
P -1950 -1150
F 0 "#PWR11" H -1950 -1050 30 
F 1 "VCC" H -1950 -1050 30 
        1    -1950 -1150
        1    0    0    -1  
$EndComp
Wire Wire Line
      -1950 -1150 -1950 -950
Wire Wire Line
      -1950 -950 -1800 -950
$Comp
L ~GND #PWR12
U 1 1 5213C820
P -2350 -300
F 0 "#PWR12" H -2350 -300 30 
F 1 "~GND" H -2350 -370 30 
        1    -2350 -300
        1    0    0    -1  
$EndComp
Wire Wire Line
      -2350 -300 -2350 -450
Wire Wire Line
      -2350 -850 -1800 -850
$Comp
L VCC #PWR13
U 1 1 5213C820
P -2800 -1300
F 0 "#PWR13" H -2800 -1200 30 
F 1 "VCC" H -2800 -1200 30 
        1    -2800 -1300
        1    0    0    -1  
$EndComp
Wire Wire Line
      -2800 -1300 -2800 -1050
$Comp
L ~GND #PWR14
U 1 1 5213C820
P -2800 -500
F 0 "#PWR14" H -2800 -500 30 
F 1 "~GND" H -2800 -570 30 
        1    -2800 -500
        1    0    0    -1  
$EndComp
Wire Wire Line
      -2800 -650 -2800 -500
$Comp
L ~GND #PWR15
U 1 1 5213C820
P -1950 -600
F 0 "#PWR15" H -1950 -600 30 
F 1 "~GND" H -1950 -670 30 
        1    -1950 -600
        1    0    0    -1  
$EndComp
$EndSCHEMATC
