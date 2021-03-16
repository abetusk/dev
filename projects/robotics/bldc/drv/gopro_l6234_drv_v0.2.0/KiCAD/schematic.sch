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
P 1450 -1800
F 0 "in_en_g" V 1420 -1800 60 0000 C CNN
F 1 "Val**" V 1520 -1800 60 0000 C CNN
        1    1450 -1800
        1    0    0    -1  
$EndComp
$Comp
L C C4
U 1 1 5213C820
P 3500 -1650
F 0 "C3" H 3500 -1550 40 0000 C CNN
F 1 ".22uf" H 3506 -1735 40 0000 C CNN
        1    3500 -1650
        0    -1   -1   0   
$EndComp
$Comp
L DIODE_SOD-123FL_SOD-123FL U3
U 1 1 5213C820
P 3200 -1200
F 0 "D1" H 3200 -1200 0 0000 C CNN
F 1 "1n4148" H 3200 -1200 0 0000 C CNN
        1    3200 -1200
        0    -1   -1   0   
$EndComp
NoConn ~ 2200 1250
$Comp
L CONN_2 P4
U 1 1 5213C820
P -300 -50
F 0 "motpwr" V -350 -50 40 0000 C CNN
F 1 "Val**" V -250 -50 40 0000 C CNN
        1    -300 -50 
        1    0    0    -1  
$EndComp
$Comp
L CONN_3 K1
U 1 1 5213C820
P 1500 650
F 0 "MOTOR" V 1450 650 50 0000 C CNN
F 1 "Val**" V 1550 650 40 0000 C CNN
        1    1500 650 
        1    0    0    -1  
$EndComp
Wire Wire Line
      -750 -150 -650 -150
Text Label 800 550 0 40 ~ 0
OUT1
$Comp
L C C3
U 1 1 5213C820
P 2750 -950
F 0 "C2" H 2750 -850 40 0000 C CNN
F 1 "10nf" H 2756 -1035 40 0000 C CNN
        1    2750 -950
        0    1    1    0   
$EndComp
$Comp
L DIODE_SOD-123FL_SOD-123FL U2
U 1 1 5213C820
P 3200 -700
F 0 "D0" H 3200 -700 0 0000 C CNN
F 1 "1n4148" H 3200 -700 0 0000 C CNN
        1    3200 -700
        0    -1   -1   0   
$EndComp
$Comp
L ~GND #PWR1
U 1 1 5213C820
P 850 -50
F 0 "#PWR1" H 850 -50 30 
F 1 "~GND" H 850 -120 30 
        1    850  -50 
        0    1    1    0   
$EndComp
Wire Wire Line
      1100 -1800 800 -1800
Wire Wire Line
      1100 -1700 800 -1700
$Comp
L ~GND #PWR2
U 1 1 5213C820
P 1550 -50
F 0 "#PWR2" H 1550 -50 30 
F 1 "~GND" H 1550 -120 30 
        1    1550 -50 
        0    -1   -1   0   
$EndComp
Wire Wire Line
      1100 -2100 800 -2100
Wire Wire Line
      1100 -2000 800 -2000
$Comp
L VCC #PWR3
U 1 1 5213C820
P 850 -150
F 0 "#PWR3" H 850 -50 30 
F 1 "VCC" H 850 -50 30 
        1    850  -150
        0    -1   -1   0   
$EndComp
Wire Wire Line
      1100 -1600 800 -1600
$Comp
L VCC #PWR4
U 1 1 5213C820
P 1550 -150
F 0 "#PWR4" H 1550 -50 30 
F 1 "VCC" H 1550 -50 30 
        1    1550 -150
        0    1    1    0   
$EndComp
Wire Wire Line
      1100 -1900 800 -1900
$Comp
L ~GND #PWR5
U 1 1 5213C820
P 850 -950
F 0 "#PWR5" H 850 -950 30 
F 1 "~GND" H 850 -1020 30 
        1    850  -950
        0    1    1    0   
$EndComp
Text Label 800 -1900 0 40 ~ 0
IN2
Text Label 800 -1700 0 40 ~ 0
IN3
Text Label 800 -2100 0 40 ~ 0
IN1
$Comp
L ~GND #PWR6
U 1 1 5213C820
P 1550 -950
F 0 "#PWR6" H 1550 -950 30 
F 1 "~GND" H 1550 -1020 30 
        1    1550 -950
        0    -1   -1   0   
$EndComp
Text Label 800 -1800 0 40 ~ 0
EN2
Text Label 800 -1600 0 40 ~ 0
EN3
Text Label 800 -2000 0 40 ~ 0
EN1
Wire Wire Line
      -750 -250 -750 -150
$Comp
L VCC #PWR8
U 1 1 5213C820
P -750 -250
F 0 "#PWR8" H -750 -150 30 
F 1 "VCC" H -750 -150 30 
        1    -750 -250
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
$Comp
L C C7
U 1 1 5213C820
P 2550 0
F 0 "C1" H 2550 100 40 
F 1 "1uf" H 2556 -85 40 
        1    2550 0   
        1    0    0    -1  
$EndComp
Wire Wire Line
      3200 -1650 2850 -1650
Connection ~ 3200 -1650
$Comp
L C C6
U 1 1 5213C820
P -400 -750
F 0 "c0" H -400 -650 40 0000 C CNN
F 1 ".1uf" H -394 -835 40 0000 C CNN
        1    -400 -750
        1    0    0    -1  
$EndComp
Wire Wire Line
      2550 200 2550 250
Wire Wire Line
      2550 -300 2550 -200
Text Label 1800 -550 0 40 ~ 0
VREF
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
      2950 -950 3200 -950
Text Label 2350 -950 0 40 ~ 0
VCP
Wire Wire Line
      2550 -950 2350 -950
$Comp
L ~GND #PWR7
U 1 1 5213C820
P -750 150
F 0 "#PWR7" H -750 150 30 
F 1 "~GND" H -750 80 30 
        1    -750 150 
        1    0    0    -1  
$EndComp
Wire Wire Line
      -650 50 -750 50
Wire Wire Line
      -750 50 -750 150
NoConn ~ 1550 -850
NoConn ~ 850 -850
Wire Wire Line
      3200 -1650 3300 -1650
Wire Wire Line
      1150 750 800 750
Wire Wire Line
      850 -1500 850 -1400
$Comp
L VCC #PWR15
U 1 1 5213C820
P 3600 -550
F 0 "#PWR15" H 3600 -450 30 
F 1 "VCC" H 3600 -450 30 
        1    3600 -550
        1    0    0    -1  
$EndComp
Connection ~ 3200 -950
Text Label 150 -550 0 40 ~ 0
OUT2
Wire Wire Line
      1150 650 800 650
Wire Wire Line
      1100 -1500 850 -1500
Text Label 150 -650 0 40 ~ 0
IN2
Wire Wire Line
      850 -550 150 -550
Text Label 150 -450 0 40 ~ 0
OUT1
Text Label 150 -750 0 40 ~ 0
EN2
Text Label 150 -250 0 40 ~ 0
EN1
Wire Wire Line
      850 -450 150 -450
Wire Wire Line
      1150 550 800 550
Text Label 150 -350 0 40 ~ 0
IN1
Text Label 1800 -750 0 40 ~ 0
VBOOT
$Comp
L ~GND #PWR12
U 1 1 5213C820
P 3700 -1400
F 0 "#PWR12" H 3700 -1400 30 
F 1 "~GND" H 3700 -1470 30 
        1    3700 -1400
        1    0    0    -1  
$EndComp
Text Label 800 650 0 40 ~ 0
OUT2
Wire Wire Line
      1550 -750 1800 -750
Wire Wire Line
      1550 -250 1800 -250
Wire Wire Line
      1550 -450 1800 -450
$Comp
L ~GND #PWR11
U 1 1 5213C820
P 2550 250
F 0 "#PWR11" H 2550 250 30 
F 1 "~GND" H 2550 180 30 
        1    2550 250 
        1    0    0    -1  
$EndComp
Wire Wire Line
      1550 -350 1800 -350
Wire Wire Line
      850 -650 150 -650
$Comp
L ~GND #PWR9
U 1 1 5213C820
P 850 -1400
F 0 "#PWR9" H 850 -1400 30 
F 1 "~GND" H 850 -1470 30 
        1    850  -1400
        1    0    0    -1  
$EndComp
Wire Wire Line
      850 -750 150 -750
Text Label 1800 -250 0 40 ~ 0
EN3
Text Label 2850 -1650 0 40 ~ 0
VBOOT
NoConn ~ 2200 1150
NoConn ~ 2200 1050
NoConn ~ 2200 950
Wire Wire Line
      3200 -800 3200 -1100
Wire Wire Line
      1550 -650 1800 -650
Text Label 1800 -650 0 40 ~ 0
VCP
Wire Wire Line
      3200 -1300 3200 -1650
Text Label 800 750 0 40 ~ 0
OUT3
Text Label 2550 -300 0 40 ~ 0
VREF
Wire Wire Line
      1550 -550 1800 -550
Text Label 1800 -450 0 40 ~ 0
OUT3
Wire Wire Line
      850 -250 150 -250
Text Label 1800 -350 0 40 ~ 0
IN3
Wire Wire Line
      850 -350 150 -350
Wire Wire Line
      3200 -600 3200 -400
Wire Wire Line
      3200 -400 3600 -400
Wire Wire Line
      3600 -400 3600 -550
Wire Wire Line
      3700 -1650 3700 -1400
$Comp
L OPEN_HARDWARE_1 LOGO1
U 1 1 5213C820
P 3400 1050
F 0 "ref**" H 3400 1325 60 0000 C CNN
F 1 "val**" H 3400 825 60 0000 C CNN
        1    3400 1050
        1    0    0    -1  
$EndComp
$Comp
L CP1 C8
U 1 1 5213C820
P -1050 -750
F 0 "100mf" H -1000 -650 50 0000 C CNN
F 1 "C***" H -1000 -850 50 0000 C CNN
        1    -1050 -750
        1    0    0    -1  
$EndComp
$Comp
L VCC #PWR16
U 1 1 5213C820
P -1050 -950
F 0 "#PWR16" H -1050 -850 30 
F 1 "VCC" H -1050 -850 30 
        1    -1050 -950
        1    0    0    -1  
$EndComp
$Comp
L ~GND #PWR17
U 1 1 5213C820
P -1050 -550
F 0 "#PWR17" H -1050 -550 30 
F 1 "~GND" H -1050 -620 30 
        1    -1050 -550
        1    0    0    -1  
$EndComp
$EndSCHEMATC
