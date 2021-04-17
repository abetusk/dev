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
P -900 -500
F 0 "enc" V -950 -500 60 0000 C CNN
F 1 "as5600" V -850 -500 60 0000 C CNN
        1    -900 -500
        1    0    0    -1  
$EndComp
$Comp
L CP1 C7
U 1 1 5213C820
P -1800 -550
F 0 "C1e" H -1750 -450 50 0000 C CNN
F 1 "1uF" H -1750 -650 50 0000 C CNN
        1    -1800 -550
        1    0    0    -1  
$EndComp
$Comp
L CP1 C6
U 1 1 5213C820
P -2250 -750
F 0 "C0e" H -2200 -650 50 0000 C CNN
F 1 "100nF" H -2200 -850 50 0000 C CNN
        1    -2250 -750
        1    0    0    -1  
$EndComp
Text Label -1400 -350 2 40 ~ 0
sda
$Comp
L CONN_4 P1
U 1 1 5213C820
P 700 1800
F 0 "x" V 650 1800 50 0000 C CNN
F 1 "screw" V 750 1800 50 0000 C CNN
        1    700  1800
        1    0    0    -1  
$EndComp
$Comp
L ~GND #PWR27
U 1 1 5213C820
P 4350 -1100
F 0 "#PWR27" H 4350 -1100 30 
F 1 "~GND" H 4350 -1170 30 
        1    4350 -1100
        1    0    0    -1  
$EndComp
Wire Wire Line
      -1400 -500 -1400 -550
Wire Wire Line
      -1400 -550 -1250 -550
Wire Wire Line
      4350 -1200 4350 -1100
Wire Wire Line
      4400 -1200 4350 -1200
NoConn ~ -1250 -150
Wire Wire Line
      4350 -1400 4400 -1400
Text Label -1400 -250 2 40 ~ 0
scl
Wire Wire Line
      -1250 -250 -1400 -250
NoConn ~ 350 1950
NoConn ~ 350 1650
NoConn ~ 350 1750
NoConn ~ 350 1850
Wire Wire Line
      -1250 -350 -1400 -350
NoConn ~ -1250 -650
NoConn ~ -1250 -450
Wire Wire Line
      4350 -1500 4350 -1400
Text Label 1750 -1700 2 40 ~ 0
EN3
$Comp
L CONN_2 P10
U 1 1 5213C820
P 4750 -1300
F 0 "mupwr" V 4700 -1300 40 
F 1 "atmega_pwr" V 4800 -1300 40 
        1    4750 -1300
        1    0    0    -1  
$EndComp
$Comp
L CONN_3 K5
U 1 1 5213C820
P 2100 -1800
F 0 "moto_en" V 2050 -1800 50 
F 1 "moto_en" V 2250 -1800 40 
        1    2100 -1800
        1    0    0    -1  
$EndComp
$Comp
L CONN_4 P9
U 1 1 5213C820
P 2100 -2550
F 0 "moto_in" V 2050 -2550 50 
F 1 "moto_in" V 2250 -2550 50 
        1    2100 -2550
        1    0    0    -1  
$EndComp
Text Label 4800 1700 2 40 ~ 0
gnd
Wire Wire Line
      4900 1700 4800 1700
Connection ~ 4900 1700
$Comp
L VCC #PWR11
U 1 1 5213C820
P -1400 -1050
F 0 "#PWR11" H -1400 -950 30 
F 1 "VCC" H -1400 -950 30 
        1    -1400 -1050
        1    0    0    -1  
$EndComp
Wire Wire Line
      -1400 -1050 -1400 -850
Wire Wire Line
      -1400 -850 -1250 -850
$Comp
L ~GND #PWR12
U 1 1 5213C820
P -1800 -200
F 0 "#PWR12" H -1800 -200 30 
F 1 "~GND" H -1800 -270 30 
        1    -1800 -200
        1    0    0    -1  
$EndComp
Wire Wire Line
      -1800 -200 -1800 -350
Wire Wire Line
      -1800 -750 -1250 -750
$Comp
L VCC #PWR13
U 1 1 5213C820
P -2250 -1200
F 0 "#PWR13" H -2250 -1100 30 
F 1 "VCC" H -2250 -1100 30 
        1    -2250 -1200
        1    0    0    -1  
$EndComp
Wire Wire Line
      -2250 -1200 -2250 -950
$Comp
L ~GND #PWR14
U 1 1 5213C820
P -2250 -400
F 0 "#PWR14" H -2250 -400 30 
F 1 "~GND" H -2250 -470 30 
        1    -2250 -400
        1    0    0    -1  
$EndComp
Wire Wire Line
      -2250 -550 -2250 -400
$Comp
L ~GND #PWR15
U 1 1 5213C820
P -1400 -500
F 0 "#PWR15" H -1400 -500 30 
F 1 "~GND" H -1400 -570 30 
        1    -1400 -500
        1    0    0    -1  
$EndComp
$Comp
L DIL20 P2
U 1 1 5213C820
P 1200 -500
F 0 "U0" H 1200 50 70 0000 C CNN
F 1 "l6234" V 1200 -500 70 0000 C CNN
        1    1200 -500
        1    0    0    -1  
$EndComp
Text Label 4800 -500 2 40 ~ 0
vcc
$Comp
L C C4
U 1 1 5213C820
P 2850 -1200
F 0 "C3" H 2850 -1100 40 0000 C CNN
F 1 ".22uf" H 2856 -1285 40 0000 C CNN
        1    2850 -1200
        1    0    0    -1  
$EndComp
$Comp
L DIODE_SOD-123FL_SOD-123FL U3
U 1 1 5213C820
P 2850 -1700
F 0 "D1" H 2850 -1700 0 0000 C CNN
F 1 "1n4148" H 2850 -1700 0 0000 C CNN
        1    2850 -1700
        0    1    1    0   
$EndComp
NoConn ~ 1000 1950
$Comp
L CONN_2 P4
U 1 1 5213C820
P 900 -1450
F 0 "motpwr" V 850 -1450 40 0000 C CNN
F 1 "Val**" V 950 -1450 40 0000 C CNN
        1    900  -1450
        1    0    0    -1  
$EndComp
$Comp
L CONN_3 K1
U 1 1 5213C820
P 1100 500
F 0 "MOTOR" V 1050 500 50 0000 C CNN
F 1 "Val**" V 1150 500 40 0000 C CNN
        1    1100 500 
        1    0    0    -1  
$EndComp
Wire Wire Line
      450 -1550 550 -1550
Text Label 400 400 0 40 ~ 0
OUT1
$Comp
L C C3
U 1 1 5213C820
P 3200 -1850
F 0 "C2" H 3200 -1750 40 0000 C CNN
F 1 "10nf" H 3206 -1935 40 0000 C CNN
        1    3200 -1850
        0    -1   -1   0   
$EndComp
$Comp
L DIODE_SOD-123FL_SOD-123FL U2
U 1 1 5213C820
P 2850 -2000
F 0 "D0" H 2850 -2000 0 0000 C CNN
F 1 "1n4148" H 2850 -2000 0 0000 C CNN
        1    2850 -2000
        0    1    1    0   
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
      4900 -500 4800 -500
Connection ~ 4900 -500
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
      2850 -1400 2850 -1500
Connection ~ 2850 -1500
Text Label 450 -1650 2 40 ~ 0
moto_vcc
Wire Wire Line
      2850 -1900 2850 -1800
Text Label 1750 -1800 2 40 ~ 0
EN2
NoConn ~ 6900 550
$Comp
L ~GND #PWR5
U 1 1 5213C820
P 850 -950
F 0 "#PWR5" H 850 -950 30 
F 1 "~GND" H 850 -1020 30 
        1    850  -950
        0    1    1    0   
$EndComp
NoConn ~ 6900 450
NoConn ~ 6900 -400
Text Label 7050 1050 0 40 ~ 0
rst
$Comp
L ~GND #PWR6
U 1 1 5213C820
P 1550 -950
F 0 "#PWR6" H 1550 -950 30 
F 1 "~GND" H 1550 -1020 30 
        1    1550 -950
        0    -1   -1   0   
$EndComp
Wire Wire Line
      6900 1050 7050 1050
Text Label 7050 100 0 40 ~ 0
sck
Text Label 7050 0 0 40 ~ 0
miso
Wire Wire Line
      450 -1650 450 -1550
$Comp
L VCC #PWR29
U 1 1 5213C820
P 4350 -1500
F 0 "#PWR29" H 4350 -1400 30 
F 1 "VCC" H 4350 -1400 30 
        1    4350 -1500
        1    0    0    -1  
$EndComp
$Comp
L ~GND #PWR14
U 1 1 5213C820
P 2250 -350
F 0 "#PWR14" H 2250 -350 30 
F 1 "~GND" H 2250 -420 30 
        1    2250 -350
        1    0    0    -1  
$EndComp
$Comp
L C C7
U 1 1 5213C820
P 0 200
F 0 "C1m" H 0 300 40 
F 1 "1uf" H 6 115 40 
        1    0    200 
        1    0    0    -1  
$EndComp
Wire Wire Line
      2850 -1500 3000 -1500
Wire Wire Line
      2850 -1600 2850 -1500
$Comp
L C C6
U 1 1 5213C820
P 2250 -550
F 0 "c0" H 2250 -450 40 0000 C CNN
F 1 ".1uf" H 2256 -635 40 0000 C CNN
        1    2250 -550
        1    0    0    -1  
$EndComp
Wire Wire Line
      0 400 0 450
Wire Wire Line
      0 -100 0 0
Text Label 1800 -550 0 40 ~ 0
VREF
$Comp
L ~GND #PWR28
U 1 1 5213C820
P 1650 -2300
F 0 "#PWR28" H 1650 -2300 30 
F 1 "~GND" H 1650 -2370 30 
        1    1650 -2300
        1    0    0    -1  
$EndComp
Text Label 2550 2350 0 40 ~ 0
2021-04-11
Wire Wire Line
      2850 -2200 2850 -2100
Text Label 3600 -1850 2 40 ~ 0
VCP
Wire Wire Line
      3400 -1850 3600 -1850
$Comp
L ~GND #PWR7
U 1 1 5213C820
P 450 -1250
F 0 "#PWR7" H 450 -1250 30 
F 1 "~GND" H 450 -1320 30 
        1    450  -1250
        1    0    0    -1  
$EndComp
Wire Wire Line
      550 -1350 450 -1350
Wire Wire Line
      450 -1350 450 -1250
$Comp
L R R1
U 1 1 5213C820
P 1550 500
F 0 "r_1ohm" V 1450 500 40 0000 C CNN
F 1 "Val**" V 1557 501 40 0000 C CNN
        1    1550 500 
        1    0    0    -1  
$EndComp
Text Label 1550 250 0 40 ~ 0
sense
Wire Wire Line
      2850 -1850 3000 -1850
Wire Wire Line
      750 600 400 600
Wire Wire Line
      6900 100 7050 100
Text Label 2250 -150 0 40 ~ 0
moto_vcc
NoConn ~ 6900 750
Text Label 150 -550 0 40 ~ 0
OUT2
Wire Wire Line
      750 500 400 500
Wire Wire Line
      6900 0 7050 0
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
      750 400 400 400
Text Label 150 -350 0 40 ~ 0
IN1
Text Label 1800 -750 0 40 ~ 0
VBOOT
$Comp
L ~GND #PWR12
U 1 1 5213C820
P 2850 -900
F 0 "#PWR12" H 2850 -900 30 
F 1 "~GND" H 2850 -970 30 
        1    2850 -900
        1    0    0    -1  
$EndComp
Text Label 400 500 0 40 ~ 0
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
P 0 450
F 0 "#PWR11" H 0 450 30 
F 1 "~GND" H 0 380 30 
        1    0    450 
        1    0    0    -1  
$EndComp
Wire Wire Line
      1550 -350 1800 -350
Wire Wire Line
      850 -650 150 -650
Text Label 7550 -100 0 40 ~ 0
mosi
Wire Wire Line
      850 -750 150 -750
Text Label 1800 -250 0 40 ~ 0
EN3
Text Label 3000 -1500 0 40 ~ 0
VBOOT
NoConn ~ 1000 1850
NoConn ~ 1000 1750
NoConn ~ 1000 1650
NoConn ~ 6900 650
Wire Wire Line
      1550 -650 1800 -650
Text Label 1800 -650 0 40 ~ 0
VCP
Connection ~ 2850 -1850
Text Label 400 600 0 40 ~ 0
OUT3
Text Label 0 -100 0 40 ~ 0
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
NoConn ~ 6900 1400
NoConn ~ 6900 1600
NoConn ~ 6900 1500
Wire Wire Line
      2850 -1000 2850 -900
$Comp
L OPEN_HARDWARE_1 LOGO1
U 1 1 5213C820
P 2600 1950
F 0 "ref**" H 2600 2225 60 0000 C CNN
F 1 "val**" H 2600 1725 60 0000 C CNN
        1    2600 1950
        1    0    0    -1  
$EndComp
$Comp
L CP1 C8
U 1 1 5213C820
P 2250 50
F 0 "100mf" H 2300 150 50 0000 C CNN
F 1 "C***" H 2300 -50 50 0000 C CNN
        1    2250 50  
        1    0    0    -1  
$EndComp
Text Label 2250 -750 0 40 ~ 0
moto_vcc
$Comp
L ~GND #PWR17
U 1 1 5213C820
P 2250 250
F 0 "#PWR17" H 2250 250 30 
F 1 "~GND" H 2250 180 30 
        1    2250 250 
        1    0    0    -1  
$EndComp
Text Label 1550 -150 0 40 ~ 0
moto_vcc
Text Label 1550 -850 0 40 ~ 0
sense
Text Label 850 -850 2 40 ~ 0
sense
$Comp
L ~GND #PWR18
U 1 1 5213C820
P 1550 850
F 0 "#PWR18" H 1550 850 30 
F 1 "~GND" H 1550 780 30 
        1    1550 850 
        1    0    0    -1  
$EndComp
Wire Wire Line
      1550 750 1550 850
Text Label 850 -150 2 40 ~ 0
moto_vcc
Text Label 1750 -1900 2 40 ~ 0
EN1
$Comp
L ATMEGA168A-A IC3
U 1 1 5213C820
P 5900 700
F 0 "TQFP32" H 5150 1950 40 0000 C CNN
F 1 "atmega328" H 6300 -700 40 0000 C CNN
        1    5900 700 
        1    0    0    -1  
$EndComp
$Comp
L CRYSTALTC38H_TC38H U8
U 1 1 5213C820
P 7500 250
F 0 ">NAME" H 7500 250 0 0000 C CNN
F 1 ">VALUE" H 7500 250 0 0000 C CNN
        1    7500 250 
        0    1    1    0   
$EndComp
$Comp
L CONN_4 P8
U 1 1 5213C820
P 1350 1800
F 0 "" V 1300 1800 50 0000 C CNN
F 1 "" V 1400 1800 50 0000 C CNN
        1    1350 1800
        1    0    0    -1  
$EndComp
$Comp
L VCC #PWR19
U 1 1 5213C820
P 4900 -550
F 0 "#PWR19" H 4900 -450 30 
F 1 "VCC" H 4900 -450 30 
        1    4900 -550
        1    0    0    -1  
$EndComp
$Comp
L CON_HEADER_PRG_AVR_ICSP-SMD_M2X3_SMD U7
U 1 1 5213C820
P 5900 -1300
F 0 ">NAME" H 5900 -1300 0 0000 C CNN
F 1 "val**" H 5900 -1300 0 0000 C CNN
        1    5900 -1300
        1    0    0    -1  
$EndComp
$Comp
L C C9
U 1 1 5213C820
P 4200 -150
F 0 "C9" H 4200 -50 40 0000 C CNN
F 1 "4.7uF" H 4206 -235 40 0000 C CNN
        1    4200 -150
        1    0    0    -1  
$EndComp
Wire Wire Line
      6900 200 7150 200
Wire Wire Line
      7150 200 7150 150
Wire Wire Line
      7150 150 7500 150
Wire Wire Line
      6900 300 7150 300
Wire Wire Line
      7150 300 7150 350
Wire Wire Line
      7150 350 7500 350
$Comp
L C C10
U 1 1 5213C820
P 8100 150
F 0 "C10" H 8100 250 40 
F 1 "22pF" H 8106 65 40 
        1    8100 150 
        0    -1   -1   0   
$EndComp
$Comp
L C C11
U 1 1 5213C820
P 8100 350
F 0 "C11" H 8100 450 40 
F 1 "22pF" H 8106 265 40 
        1    8100 350 
        0    -1   -1   0   
$EndComp
Connection ~ 7500 150
Wire Wire Line
      7500 150 7900 150
Connection ~ 7500 350
Wire Wire Line
      7500 350 7900 350
Wire Wire Line
      8300 150 8450 150
Wire Wire Line
      8450 150 8450 500
Connection ~ 8450 350
Wire Wire Line
      8300 350 8450 350
$Comp
L ~GND #PWR20
U 1 1 5213C820
P 8450 500
F 0 "#PWR20" H 8450 500 30 
F 1 "~GND" H 8450 430 30 
        1    8450 500 
        1    0    0    -1  
$EndComp
Wire Wire Line
      5000 -400 4900 -400
Wire Wire Line
      4900 -400 4900 -550
Connection ~ 4900 -400
Wire Wire Line
      5000 -300 4900 -300
Wire Wire Line
      4900 -300 4900 -400
$Comp
L C C12
U 1 1 5213C820
P 4500 -150
F 0 "C12" H 4500 -50 40 
F 1 "100nF" H 4506 -235 40 
        1    4500 -150
        1    0    0    -1  
$EndComp
Wire Wire Line
      4200 -350 4350 -350
Wire Wire Line
      4350 -350 4350 -550
Connection ~ 4350 -350
Wire Wire Line
      4500 -350 4350 -350
Wire Wire Line
      4200 50 4500 50
Connection ~ 4350 50
Wire Wire Line
      4350 50 4350 200
$Comp
L ~GND #PWR21
U 1 1 5213C820
P 4350 200
F 0 "#PWR21" H 4350 200 30 
F 1 "~GND" H 4350 130 30 
        1    4350 200 
        1    0    0    -1  
$EndComp
$Comp
L VCC #PWR22
U 1 1 5213C820
P 4350 -550
F 0 "#PWR22" H 4350 -450 30 
F 1 "VCC" H 4350 -450 30 
        1    4350 -550
        1    0    0    -1  
$EndComp
$Comp
L CONN_3 K2
U 1 1 5213C820
P 8000 -1050
F 0 "ser" V 7950 -1050 50 
F 1 "serial" V 8050 -1050 40 
        1    8000 -1050
        1    0    0    -1  
$EndComp
$Comp
L CONN_3 K3
U 1 1 5213C820
P 8000 -500
F 0 "i2c" V 7950 -500 50 
F 1 "i2c" V 8050 -500 40 
        1    8000 -500
        1    0    0    -1  
$EndComp
Wire Wire Line
      7650 -400 7600 -400
Wire Wire Line
      7600 -400 7600 -250
$Comp
L ~GND #PWR23
U 1 1 5213C820
P 7600 -800
F 0 "#PWR23" H 7600 -800 30 
F 1 "~GND" H 7600 -870 30 
        1    7600 -800
        1    0    0    -1  
$EndComp
Wire Wire Line
      7600 -950 7600 -800
$Comp
L ~GND #PWR24
U 1 1 5213C820
P 7600 -250
F 0 "#PWR24" H 7600 -250 30 
F 1 "~GND" H 7600 -320 30 
        1    7600 -250
        1    0    0    -1  
$EndComp
Wire Wire Line
      7600 -950 7650 -950
Text Label 7600 -600 2 40 ~ 0
sda
Text Label 7600 -500 2 40 ~ 0
scl
Text Label 7600 -1150 2 40 ~ 0
rx
Text Label 7600 -1050 2 40 ~ 0
tx
Wire Wire Line
      6900 -300 7050 -300
Wire Wire Line
      6900 850 7050 850
Wire Wire Line
      6900 950 7050 950
Wire Wire Line
      7600 -600 7650 -600
Wire Wire Line
      7600 -500 7650 -500
Wire Wire Line
      7600 -1050 7650 -1050
Wire Wire Line
      7600 -1150 7650 -1150
Wire Wire Line
      6900 1200 7050 1200
Wire Wire Line
      6900 1300 7050 1300
Text Label 7050 850 0 40 ~ 0
sda
Text Label 7050 950 0 40 ~ 0
scl
Text Label 7050 1200 0 40 ~ 0
rx
Text Label 7050 1300 0 40 ~ 0
tx
Wire Wire Line
      5000 1700 4900 1700
Wire Wire Line
      4900 1700 4900 2100
Connection ~ 4900 1900
Wire Wire Line
      5000 1900 4900 1900
Connection ~ 4900 1800
Wire Wire Line
      5000 1800 4900 1800
$Comp
L ~GND #PWR25
U 1 1 5213C820
P 4900 2100
F 0 "#PWR25" H 4900 2100 30 
F 1 "~GND" H 4900 2030 30 
        1    4900 2100
        1    0    0    -1  
$EndComp
Connection ~ 4900 -300
Wire Wire Line
      5000 -100 4900 -100
Wire Wire Line
      4900 -100 4900 -300
Connection ~ 4900 -100
Wire Wire Line
      5000 200 4900 200
Wire Wire Line
      4900 200 4900 -100
NoConn ~ 5000 950
NoConn ~ 5000 1050
Wire Wire Line
      6900 1700 7050 1700
Wire Wire Line
      6900 1800 7050 1800
Wire Wire Line
      6900 1900 7050 1900
Text Label 7050 -300 0 40 ~ 0
IN1
Text Label 7050 -200 0 40 ~ 0
IN2
Text Label 7050 -100 0 40 ~ 0
IN3
Wire Wire Line
      6900 -100 7050 -100
Wire Wire Line
      6900 -200 7050 -200
Text Label 7050 1700 0 40 ~ 0
EN1
Text Label 7050 1800 0 40 ~ 0
EN2
Text Label 7050 1900 0 40 ~ 0
EN3
Wire Wire Line
      6200 -1400 6350 -1400
Wire Wire Line
      6200 -1300 6350 -1300
Wire Wire Line
      6200 -1200 6350 -1200
Wire Wire Line
      5600 -1400 5450 -1400
Wire Wire Line
      5600 -1300 5450 -1300
Wire Wire Line
      5600 -1200 5450 -1200
Text Label 6350 -1400 0 40 ~ 0
vcc
Text Label 6350 -1300 0 40 ~ 0
mosi
Text Label 6350 -1200 0 40 ~ 0
gnd
Text Label 5450 -1400 2 40 ~ 0
miso
Text Label 5450 -1300 2 40 ~ 0
sck
Text Label 5450 -1200 2 40 ~ 0
rst
Wire Wire Line
      7550 -100 7350 -100
Text Label 7350 -100 0 40 ~ 0
IN3
Text Label 1750 -2700 2 40 ~ 0
IN1
Text Label 1750 -2600 2 40 ~ 0
IN2
Text Label 1750 -2500 2 40 ~ 0
IN3
Wire Wire Line
      1750 -2400 1650 -2400
Wire Wire Line
      1650 -2400 1650 -2300
Text Label 2850 -2200 0 40 ~ 0
moto_vcc
$Comp
L R R3
U 1 1 5213C820
P 8550 -550
F 0 "r_da" V 8630 -550 40 
F 1 "r_da" V 8557 -549 40 
        1    8550 -550
        1    0    0    -1  
$EndComp
$Comp
L R R4
U 1 1 5213C820
P 8850 -550
F 0 "r_cl" V 8930 -550 40 
F 1 "r_cl" V 8850 -550 40 
        1    8850 -550
        1    0    0    -1  
$EndComp
$Comp
L VCC #PWR32
U 1 1 5213C820
P 8550 -950
F 0 "#PWR32" H 8550 -850 30 
F 1 "VCC" H 8550 -850 30 
        1    8550 -950
        1    0    0    -1  
$EndComp
$Comp
L VCC #PWR33
U 1 1 5213C820
P 8850 -950
F 0 "#PWR33" H 8850 -850 30 
F 1 "VCC" H 8850 -850 30 
        1    8850 -950
        1    0    0    -1  
$EndComp
Wire Wire Line
      8550 -800 8550 -950
Wire Wire Line
      8850 -950 8850 -800
Text Label 8550 -100 0 40 ~ 0
sda
Text Label 8850 -100 0 40 ~ 0
scl
Wire Wire Line
      8550 -100 8550 -300
Wire Wire Line
      8850 -100 8850 -300
$EndSCHEMATC
