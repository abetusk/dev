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
L DIL20 P2
U 1 1 5213C820
P 1200 -500
F 0 "U0" H 1200 50 70 0000 C CNN
F 1 "l6234" V 1200 -500 70 0000 C CNN
        1    1200 -500
        1    0    0    -1  
$EndComp
$Comp
L CONN_7 P6
U 1 1 5213C820
P 1200 -1800
F 0 "in_en_g" V 1170 -1800 60 0000 C CNN
F 1 "Val**" V 1270 -1800 60 0000 C CNN
        1    1200 -1800
        0    -1   -1   0   
$EndComp
$Comp
L C C4
U 1 1 5213C820
P 3850 -350
F 0 "C3" H 3850 -250 40 0000 C CNN
F 1 ".22uf" H 3856 -435 40 0000 C CNN
        1    3850 -350
        1    0    0    -1  
$EndComp
$Comp
L DIODE_SOD-123FL_SOD-123FL U3
U 1 1 5213C820
P 3400 -900
F 0 "D1" H 3400 -900 0 0000 C CNN
F 1 "1n4148" H 3400 -900 0 0000 C CNN
        1    3400 -900
        1    0    0    -1  
$EndComp
NoConn ~ 2200 1250
$Comp
L CONN_2 P4
U 1 1 5213C820
P -700 400
F 0 "motpwr" V -750 400 40 0000 C CNN
F 1 "Val**" V -650 400 40 0000 C CNN
        1    -700 400 
        1    0    0    -1  
$EndComp
$Comp
L CONN_3 K1
U 1 1 5213C820
P 1250 750
F 0 "MOTOR" V 1200 750 50 0000 C CNN
F 1 "Val**" V 1300 750 40 0000 C CNN
        1    1250 750 
        0    1    1    0   
$EndComp
Wire Wire Line
      -1150 300 -1050 300
Wire Wire Line
      3850 -1500 3850 -900
$Comp
L C C3
U 1 1 5213C820
P 3150 -350
F 0 "C2" H 3150 -250 40 0000 C CNN
F 1 "10nf" H 3156 -435 40 0000 C CNN
        1    3150 -350
        1    0    0    -1  
$EndComp
$Comp
L DIODE_SOD-123FL_SOD-123FL U2
U 1 1 5213C820
P 2900 -900
F 0 "D0" H 2900 -900 0 0000 C CNN
F 1 "1n4148" H 2900 -900 0 0000 C CNN
        1    2900 -900
        1    0    0    -1  
$EndComp
$Comp
L ~GND #PWR1
U 1 1 5213C820
P 800 50
F 0 "#PWR1" H 800 50 30 
F 1 "~GND" H 800 -20 30 
        1    800  50  
        1    0    0    -1  
$EndComp
Wire Wire Line
      850 -50 800 -50
Wire Wire Line
      800 -50 800 50
$Comp
L ~GND #PWR2
U 1 1 5213C820
P 1600 50
F 0 "#PWR2" H 1600 50 30 
F 1 "~GND" H 1600 -20 30 
        1    1600 50  
        1    0    0    -1  
$EndComp
Wire Wire Line
      1550 -50 1600 -50
Wire Wire Line
      1600 -50 1600 50
$Comp
L VCC #PWR3
U 1 1 5213C820
P 550 -150
F 0 "#PWR3" H 550 -50 30 
F 1 "VCC" H 550 -50 30 
        1    550  -150
        1    0    0    -1  
$EndComp
Wire Wire Line
      550 -150 850 -150
$Comp
L VCC #PWR4
U 1 1 5213C820
P 1850 -150
F 0 "#PWR4" H 1850 -50 30 
F 1 "VCC" H 1850 -50 30 
        1    1850 -150
        1    0    0    -1  
$EndComp
Wire Wire Line
      1550 -150 1850 -150
$Comp
L ~GND #PWR5
U 1 1 5213C820
P 650 -950
F 0 "#PWR5" H 650 -950 30 
F 1 "~GND" H 650 -1020 30 
        1    650  -950
        1    0    0    -1  
$EndComp
Wire Wire Line
      650 -950 650 -1050
Wire Wire Line
      650 -1050 850 -1050
Wire Wire Line
      850 -1050 850 -950
$Comp
L ~GND #PWR6
U 1 1 5213C820
P 1800 -950
F 0 "#PWR6" H 1800 -950 30 
F 1 "~GND" H 1800 -1020 30 
        1    1800 -950
        1    0    0    -1  
$EndComp
Wire Wire Line
      1550 -950 1550 -1050
Wire Wire Line
      1550 -1050 1800 -1050
Wire Wire Line
      1800 -1050 1800 -950
Wire Wire Line
      -1150 200 -1150 300
$Comp
L VCC #PWR8
U 1 1 5213C820
P -1150 200
F 0 "#PWR8" H -1150 300 30 
F 1 "VCC" H -1150 300 30 
        1    -1150 200 
        1    0    0    -1  
$EndComp
$Comp
L ~GND #PWR14
U 1 1 5213C820
P -400 -550
F 0 "#PWR14" H -400 -550 30 
F 1 "~GND" H -400 -620 30 
        1    -400 -550
        1    0    0    -1  
$EndComp
Wire Wire Line
      850 -450 300 -450
Wire Wire Line
      300 -450 300 200
Wire Wire Line
      300 200 1350 200
Wire Wire Line
      1350 200 1350 400
Wire Wire Line
      850 -550 200 -550
Wire Wire Line
      200 -550 200 300
Wire Wire Line
      200 300 1250 300
Wire Wire Line
      1250 300 1250 400
Wire Wire Line
      1150 400 1150 150
Wire Wire Line
      1150 150 2100 150
Wire Wire Line
      2100 150 2100 -450
Wire Wire Line
      2100 -450 1550 -450
$Comp
L ~GND #PWR7
U 1 1 5213C820
P -1150 600
F 0 "#PWR7" H -1150 600 30 
F 1 "~GND" H -1150 530 30 
        1    -1150 600 
        1    0    0    -1  
$EndComp
Wire Wire Line
      -1050 500 -1150 500
Wire Wire Line
      -1150 500 -1150 600
NoConn ~ 1550 -850
NoConn ~ 850 -850
Wire Wire Line
      850 -350 400 -350
Wire Wire Line
      400 -350 400 -1450
Wire Wire Line
      400 -1450 900 -1450
Wire Wire Line
      850 -250 650 -250
Wire Wire Line
      650 -250 650 -600
Wire Wire Line
      650 -600 450 -600
Wire Wire Line
      450 -600 450 -1400
Wire Wire Line
      450 -1400 1000 -1400
Wire Wire Line
      1000 -1400 1000 -1450
Wire Wire Line
      850 -650 500 -650
Wire Wire Line
      500 -650 500 -1350
Wire Wire Line
      500 -1350 1100 -1350
Wire Wire Line
      1100 -1350 1100 -1450
Wire Wire Line
      850 -750 550 -750
Wire Wire Line
      550 -750 550 -1300
Wire Wire Line
      550 -1300 1200 -1300
Wire Wire Line
      1200 -1300 1200 -1450
Wire Wire Line
      1550 -350 1650 -350
Wire Wire Line
      1650 -350 1650 -1300
Wire Wire Line
      1650 -1300 1300 -1300
Wire Wire Line
      1300 -1300 1300 -1450
Wire Wire Line
      1550 -250 1700 -250
Wire Wire Line
      1700 -250 1700 -1350
Wire Wire Line
      1700 -1350 1400 -1350
Wire Wire Line
      1400 -1350 1400 -1450
$Comp
L ~GND #PWR9
U 1 1 5213C820
P 1800 -1400
F 0 "#PWR9" H 1800 -1400 30 
F 1 "~GND" H 1800 -1470 30 
        1    1800 -1400
        1    0    0    -1  
$EndComp
Wire Wire Line
      1500 -1450 1800 -1450
Wire Wire Line
      1800 -1450 1800 -1400
$Comp
L VCC #PWR10
U 1 1 5213C820
P 2450 -1100
F 0 "#PWR10" H 2450 -1000 30 
F 1 "VCC" H 2450 -1000 30 
        1    2450 -1100
        1    0    0    -1  
$EndComp
NoConn ~ 2200 1150
NoConn ~ 2200 1050
NoConn ~ 2200 950
Wire Wire Line
      3000 -900 3300 -900
Connection ~ 3150 -900
Wire Wire Line
      3150 -550 3150 -900
Wire Wire Line
      3500 -900 3850 -900
Wire Wire Line
      3850 -900 3850 -550
Wire Wire Line
      1550 -650 2200 -650
Wire Wire Line
      2200 -650 2200 100
Wire Wire Line
      2200 100 3150 100
Wire Wire Line
      3150 100 3150 -150
$Comp
L ~GND #PWR11
U 1 1 5213C820
P 2450 0
F 0 "#PWR11" H 2450 0 30 
F 1 "~GND" H 2450 -70 30 
        1    2450 0   
        1    0    0    -1  
$EndComp
$Comp
L ~GND #PWR12
U 1 1 5213C820
P 3850 -150
F 0 "#PWR12" H 3850 -150 30 
F 1 "~GND" H 3850 -220 30 
        1    3850 -150
        1    0    0    -1  
$EndComp
Connection ~ 3850 -900
Wire Wire Line
      1550 -750 2200 -750
Wire Wire Line
      2200 -750 2200 -1500
Wire Wire Line
      2200 -1500 3850 -1500
$Comp
L C C6
U 1 1 5213C820
P -400 -750
F 0 "c0" H -400 -650 40 0000 C CNN
F 1 ".1uf" H -394 -835 40 0000 C CNN
        1    -400 -750
        1    0    0    -1  
$EndComp
$Comp
L VCC #PWR13
U 1 1 5213C820
P -400 -950
F 0 "#PWR13" H -400 -850 30 
F 1 "VCC" H -400 -850 30 
        1    -400 -950
        1    0    0    -1  
$EndComp
$Comp
L CONN_4 P3
U 1 1 5213C820
P 2550 1100
F 0 "" V 2450 1400 50 0000 C CNN
F 1 "screw" V 2550 1100 50 0000 C CNN
        1    2550 1100
        1    0    0    -1  
$EndComp
Wire Wire Line
      2450 -1100 2450 -900
Wire Wire Line
      2450 -900 2800 -900
$Comp
L C C7
U 1 1 5213C820
P 2450 -250
F 0 "C1" H 2450 -150 40 
F 1 "1uf" H 2456 -335 40 
        1    2450 -250
        1    0    0    -1  
$EndComp
Wire Wire Line
      1550 -550 2450 -550
Wire Wire Line
      2450 -550 2450 -450
Wire Wire Line
      2450 -50 2450 0
$EndSCHEMATC
