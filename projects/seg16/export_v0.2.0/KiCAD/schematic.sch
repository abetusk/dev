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
L WS2812B U1
U 1 1 5213C820
P -3050 -1100
F 0 "a0" H -3050 -950 60 
F 1 "WS2812B" H -3050 -1240 60 
        1    -3050 -1100
        1    0    0    -1  
$EndComp
$Comp
L CONN_3 K1
U 1 1 5213C820
P -5050 950
F 0 "IN" V -5100 950 50 0000 C CNN
F 1 "Val**" V -5000 950 40 0000 C CNN
        1    -5050 950 
        1    0    0    -1  
$EndComp
$Comp
L CONN_3 K2
U 1 1 5213C820
P 1400 700
F 0 "OUT" V 1350 700 50 0000 C CNN
F 1 "Val**" V 1450 700 40 0000 C CNN
        1    1400 700 
        1    0    0    -1  
$EndComp
$Comp
L CONN_2 P2
U 1 1 5213C820
P 1450 1850
F 0 "SIG-OUT" V 1400 1850 40 0000 C CNN
F 1 "Val**" V 1500 1850 40 0000 C CNN
        1    1450 1850
        1    0    0    -1  
$EndComp
$Comp
L CONN_2 P4
U 1 1 5213C820
P -5050 1950
F 0 "sig-in" V -5100 1950 40 0000 C CNN
F 1 "Val**" V -5000 1950 40 0000 C CNN
        1    -5050 1950
        1    0    0    -1  
$EndComp
$Comp
L CONN_2 P1
U 1 1 5213C820
P 1400 -450
F 0 "pwr" V 1350 -450 40 0000 C CNN
F 1 "Val**" V 1450 -450 40 0000 C CNN
        1    1400 -450
        1    0    0    -1  
$EndComp
$Comp
L CONN_2 P3
U 1 1 5213C820
P -5050 50
F 0 "pwr" V -5100 50 40 0000 C CNN
F 1 "Val**" V -5000 50 40 0000 C CNN
        1    -5050 50  
        1    0    0    -1  
$EndComp
$Comp
L VCC #PWR3
U 1 1 5213C820
P -3050 -1400
F 0 "#PWR3" H -3050 -1300 30 
F 1 "VCC" H -3050 -1300 30 
        1    -3050 -1400
        1    0    0    -1  
$EndComp
$Comp
L C C1
U 1 1 5213C820
P -2650 -1100
F 0 "aC0" H -2600 -1000 40 
F 1 "100nf" H -2644 -1185 40 
        1    -2650 -1100
        1    0    0    -1  
$EndComp
Wire Wire Line
      700 1000 700 700
Connection ~ -2500 3700
Wire Wire Line
      -2500 3200 -2500 3300
$Comp
L VCC #PWR10
U 1 1 5213C820
P -2500 3200
F 0 "#PWR10" H -2500 3300 30 
F 1 "VCC" H -2500 3300 30 
        1    -2500 3200
        1    0    0    -1  
$EndComp
Wire Wire Line
      1000 600 1050 600
$Comp
L ~GND #PWR5
U 1 1 5213C820
P -3050 -850
F 0 "#PWR5" H -3050 -850 30 
F 1 "~GND" H -3050 -920 30 
        1    -3050 -850
        1    0    0    -1  
$EndComp
$Comp
L WS2812B U10
U 1 1 5213C820
P -1350 3500
F 0 "U10" H -1350 3640 60 
F 1 "WS2812B" H -1350 3360 60 
        1    -1350 3500
        1    0    0    -1  
$EndComp
$Comp
L WS2812B U3
U 1 1 5213C820
P -1450 -1100
F 0 "U3" H -1450 -960 60 
F 1 "WS2812B" H -1450 -1240 60 
        1    -1450 -1100
        1    0    0    -1  
$EndComp
$Comp
L WS2812B U9
U 1 1 5213C820
P -300 2650
F 0 "U9" H -300 2790 60 
F 1 "WS2812B" H -300 2510 60 
        1    -300 2650
        1    0    0    -1  
$EndComp
$Comp
L WS2812B U6
U 1 1 5213C820
P -300 -400
F 0 "U6" H -300 -260 60 
F 1 "WS2812B" H -300 -540 60 
        1    -300 -400
        1    0    0    -1  
$EndComp
$Comp
L WS2812B U7
U 1 1 5213C820
P -300 600
F 0 "U7" H -300 740 60 
F 1 "WS2812B" H -300 460 60 
        1    -300 600 
        1    0    0    -1  
$EndComp
$Comp
L WS2812B U8
U 1 1 5213C820
P -300 1500
F 0 "U8" H -300 1640 60 
F 1 "WS2812B" H -300 1360 60 
        1    -300 1500
        1    0    0    -1  
$EndComp
$Comp
L WS2812B U11
U 1 1 5213C820
P -2500 3500
F 0 "U11" H -2500 3640 60 
F 1 "WS2812B" H -2500 3360 60 
        1    -2500 3500
        1    0    0    -1  
$EndComp
$Comp
L WS2812B U12
U 1 1 5213C820
P -3800 2550
F 0 "U12" H -3800 2690 60 
F 1 "WS2812B" H -3800 2410 60 
        1    -3800 2550
        1    0    0    -1  
$EndComp
$Comp
L WS2812B U13
U 1 1 5213C820
P -3800 1700
F 0 "U13" H -3800 1840 60 
F 1 "WS2812B" H -3800 1560 60 
        1    -3800 1700
        1    0    0    -1  
$EndComp
$Comp
L WS2812B U14
U 1 1 5213C820
P -3800 600
F 0 "U14" H -3800 740 60 
F 1 "WS2812B" H -3800 460 60 
        1    -3800 600 
        1    0    0    -1  
$EndComp
$Comp
L WS2812B U15
U 1 1 5213C820
P -3750 -300
F 0 "U15" H -3750 -160 60 
F 1 "WS2812B" H -3750 -440 60 
        1    -3750 -300
        1    0    0    -1  
$EndComp
$Comp
L WS2812B U16
U 1 1 5213C820
P -2550 1050
F 0 "U16" H -2550 1190 60 
F 1 "WS2812B" H -2550 910 60 
        1    -2550 1050
        1    0    0    -1  
$EndComp
$Comp
L WS2812B U17
U 1 1 5213C820
P -1450 1100
F 0 "U17" H -1450 1240 60 
F 1 "WS2812B" H -1450 960 60 
        1    -1450 1100
        1    0    0    -1  
$EndComp
$Comp
L WS2812B U18
U 1 1 5213C820
P -2700 -200
F 0 "U18" H -2700 -60 60 
F 1 "WS2812B" H -2700 -340 60 
        1    -2700 -200
        1    0    0    -1  
$EndComp
Wire Wire Line
      -100 1100 700 1100
$Comp
L WS2812B U20
U 1 1 5213C820
P -1150 50
F 0 "U20" H -1150 190 60 
F 1 "WS2812B" H -1150 -90 60 
        1    -1150 50  
        1    0    0    -1  
$EndComp
$Comp
L WS2812B U21
U 1 1 5213C820
P -1050 2150
F 0 "U21" H -1050 2290 60 
F 1 "WS2812B" H -1050 2010 60 
        1    -1050 2150
        1    0    0    -1  
$EndComp
$Comp
L WS2812B U22
U 1 1 5213C820
P -1950 1750
F 0 "U22" H -1950 1890 60 
F 1 "WS2812B" H -1950 1610 60 
        1    -1950 1750
        1    0    0    -1  
$EndComp
$Comp
L WS2812B U23
U 1 1 5213C820
P -2800 2000
F 0 "U23" H -2800 2140 60 
F 1 "WS2812B" H -2800 1860 60 
        1    -2800 2000
        1    0    0    -1  
$EndComp
$Comp
L C C2
U 1 1 5213C820
P -1050 -1100
F 0 "C2" H -1050 -1000 40 
F 1 "C" H -1044 -1185 40 
        1    -1050 -1100
        1    0    0    -1  
$EndComp
$Comp
L C C3
U 1 1 5213C820
P 50 -400
F 0 "C3" H 50 -300 40 
F 1 "C" H 56 -485 40 
        1    50   -400
        1    0    0    -1  
$EndComp
$Comp
L C C4
U 1 1 5213C820
P 50 600
F 0 "C4" H 50 700 40 
F 1 "C" H 56 515 40 
        1    50   600 
        1    0    0    -1  
$EndComp
$Comp
L C C5
U 1 1 5213C820
P 50 1500
F 0 "C5" H 50 1600 40 
F 1 "C" H 56 1415 40 
        1    50   1500
        1    0    0    -1  
$EndComp
$Comp
L C C6
U 1 1 5213C820
P 50 2650
F 0 "C6" H 50 2750 40 
F 1 "C" H 56 2565 40 
        1    50   2650
        1    0    0    -1  
$EndComp
$Comp
L C C7
U 1 1 5213C820
P -1000 3600
F 0 "C7" H -1000 3700 40 
F 1 "C" H -994 3515 40 
        1    -1000 3600
        1    0    0    -1  
$EndComp
$Comp
L C C8
U 1 1 5213C820
P -2100 3500
F 0 "C8" H -2100 3600 40 
F 1 "C" H -2094 3415 40 
        1    -2100 3500
        1    0    0    -1  
$EndComp
$Comp
L C C9
U 1 1 5213C820
P -3350 2550
F 0 "C9" H -3350 2650 40 
F 1 "C" H -3344 2465 40 
        1    -3350 2550
        1    0    0    -1  
$EndComp
$Comp
L C C10
U 1 1 5213C820
P -3450 1700
F 0 "C10" H -3450 1800 40 
F 1 "C" H -3444 1615 40 
        1    -3450 1700
        1    0    0    -1  
$EndComp
$Comp
L C C11
U 1 1 5213C820
P -3450 600
F 0 "C11" H -3450 700 40 
F 1 "C" H -3444 515 40 
        1    -3450 600 
        1    0    0    -1  
$EndComp
$Comp
L C C12
U 1 1 5213C820
P -3400 -300
F 0 "C12" H -3400 -200 40 
F 1 "C" H -3394 -385 40 
        1    -3400 -300
        1    0    0    -1  
$EndComp
$Comp
L C C13
U 1 1 5213C820
P -2350 -200
F 0 "C13" H -2350 -100 40 
F 1 "C" H -2344 -285 40 
        1    -2350 -200
        1    0    0    -1  
$EndComp
$Comp
L C C14
U 1 1 5213C820
P -1500 400
F 0 "C14" H -1500 500 40 
F 1 "C" H -1494 315 40 
        1    -1500 400 
        1    0    0    -1  
$EndComp
$Comp
L C C15
U 1 1 5213C820
P -800 50
F 0 "C15" H -800 150 40 
F 1 "C" H -794 -35 40 
        1    -800 50  
        1    0    0    -1  
$EndComp
$Comp
L C C16
U 1 1 5213C820
P -2100 1050
F 0 "C16" H -2100 1150 40 
F 1 "C" H -2094 965 40 
        1    -2100 1050
        1    0    0    -1  
$EndComp
$Comp
L C C17
U 1 1 5213C820
P -1050 1100
F 0 "C17" H -1050 1200 40 
F 1 "C" H -1044 1015 40 
        1    -1050 1100
        1    0    0    -1  
$EndComp
$Comp
L C C18
U 1 1 5213C820
P -700 2150
F 0 "C18" H -700 2250 40 
F 1 "C" H -694 2065 40 
        1    -700 2150
        1    0    0    -1  
$EndComp
$Comp
L C C19
U 1 1 5213C820
P -1600 1750
F 0 "C19" H -1600 1850 40 
F 1 "C" H -1594 1665 40 
        1    -1600 1750
        1    0    0    -1  
$EndComp
$Comp
L C C20
U 1 1 5213C820
P -2450 2000
F 0 "C20" H -2450 2100 40 
F 1 "C" H -2444 1915 40 
        1    -2450 2000
        1    0    0    -1  
$EndComp
Wire Wire Line
      1000 900 1000 800
Wire Wire Line
      -2000 -1100 -1650 -1100
Wire Wire Line
      -1250 -750 -500 -750
$Comp
L ~GND #PWR57
U 1 1 5213C820
P 1050 2050
F 0 "#PWR57" H 1050 2050 30 
F 1 "~GND" H 1050 1980 30 
        1    1050 2050
        1    0    0    -1  
$EndComp
Wire Wire Line
      1050 1950 1100 1950
Wire Wire Line
      1050 2050 1050 1950
Wire Wire Line
      1000 -550 1000 -700
Wire Wire Line
      1050 -550 1000 -550
$Comp
L VCC #PWR53
U 1 1 5213C820
P 1000 450
F 0 "#PWR53" H 1000 550 30 
F 1 "VCC" H 1000 550 30 
        1    1000 450 
        1    0    0    -1  
$EndComp
Wire Wire Line
      -2900 300 -2900 -200
Wire Wire Line
      -4100 -300 -3950 -300
$Comp
L VCC #PWR55
U 1 1 5213C820
P 1000 -700
F 0 "#PWR55" H 1000 -600 30 
F 1 "VCC" H 1000 -600 30 
        1    1000 -700
        1    0    0    -1  
$EndComp
Wire Wire Line
      700 700 1050 700
Wire Wire Line
      700 1750 1100 1750
Wire Wire Line
      1000 800 1050 800
Wire Wire Line
      1000 -250 1000 -350
Wire Wire Line
      1000 -350 1050 -350
Wire Wire Line
      700 1000 700 1750
Wire Wire Line
      -1000 3800 -1350 3800
$Comp
L ~GND #PWR56
U 1 1 5213C820
P 1000 -250
F 0 "#PWR56" H 1000 -250 30 
F 1 "~GND" H 1000 -320 30 
        1    1000 -250
        1    0    0    -1  
$EndComp
Wire Wire Line
      1000 450 1000 600
$Comp
L ~GND #PWR54
U 1 1 5213C820
P 1000 900
F 0 "#PWR54" H 1000 900 30 
F 1 "~GND" H 1000 830 30 
        1    1000 900 
        1    0    0    -1  
$EndComp
$Comp
L ~GND #PWR6
U 1 1 5213C820
P -2500 3800
F 0 "#PWR6" H -2500 3800 30 
F 1 "~GND" H -2500 3730 30 
        1    -2500 3800
        1    0    0    -1  
$EndComp
Connection ~ -2500 3300
Wire Wire Line
      -2500 3300 -2100 3300
Wire Wire Line
      -2100 3700 -2500 3700
Wire Wire Line
      -2500 3700 -2500 3800
$Comp
L ~GND #PWR8
U 1 1 5213C820
P -1350 3850
F 0 "#PWR8" H -1350 3850 30 
F 1 "~GND" H -1350 3780 30 
        1    -1350 3850
        1    0    0    -1  
$EndComp
$Comp
L VCC #PWR9
U 1 1 5213C820
P -1350 3250
F 0 "#PWR9" H -1350 3350 30 
F 1 "VCC" H -1350 3350 30 
        1    -1350 3250
        1    0    0    -1  
$EndComp
Wire Wire Line
      -1350 3250 -1350 3300
Wire Wire Line
      -1000 3400 -1000 3300
Wire Wire Line
      -1000 3300 -1350 3300
Wire Wire Line
      -1350 3700 -1350 3850
Connection ~ -1350 3800
Wire Wire Line
      -3050 -900 -3050 -850
Wire Wire Line
      -3050 -1400 -3050 -1300
Connection ~ -3050 -1300
Wire Wire Line
      -3050 -1300 -2650 -1300
Wire Wire Line
      -2650 -900 -3050 -900
Wire Wire Line
      -2850 -1100 -2850 -750
Wire Wire Line
      -2850 -750 -2000 -750
Wire Wire Line
      -2000 -750 -2000 -1100
$Comp
L VCC #PWR11
U 1 1 5213C820
P -1450 -1400
F 0 "#PWR11" H -1450 -1300 30 
F 1 "VCC" H -1450 -1300 30 
        1    -1450 -1400
        1    0    0    -1  
$EndComp
$Comp
L ~GND #PWR12
U 1 1 5213C820
P -1450 -850
F 0 "#PWR12" H -1450 -850 30 
F 1 "~GND" H -1450 -920 30 
        1    -1450 -850
        1    0    0    -1  
$EndComp
Wire Wire Line
      -1450 -1400 -1450 -1300
Wire Wire Line
      -1450 -900 -1450 -850
Connection ~ -1450 -1300
Wire Wire Line
      -1450 -1300 -1050 -1300
Wire Wire Line
      -1050 -900 -1450 -900
Wire Wire Line
      -500 -750 -500 -400
Wire Wire Line
      -1250 -1100 -1250 -750
$Comp
L VCC #PWR14
U 1 1 5213C820
P -300 -700
F 0 "#PWR14" H -300 -600 30 
F 1 "VCC" H -300 -600 30 
        1    -300 -700
        1    0    0    -1  
$EndComp
$Comp
L ~GND #PWR15
U 1 1 5213C820
P -300 -100
F 0 "#PWR15" H -300 -100 30 
F 1 "~GND" H -300 -170 30 
        1    -300 -100
        1    0    0    -1  
$EndComp
Wire Wire Line
      -300 -200 -300 -100
Connection ~ -300 -200
Wire Wire Line
      -300 -200 50 -200
Wire Wire Line
      50 -600 -300 -600
Wire Wire Line
      -300 -700 -300 -600
Wire Wire Line
      -1150 -150 -800 -150
Wire Wire Line
      -800 250 -1150 250
Wire Wire Line
      -1500 200 -1850 200
Wire Wire Line
      -1850 600 -1500 600
Wire Wire Line
      -1050 900 -1450 900
Wire Wire Line
      -1050 1300 -1450 1300
Wire Wire Line
      -1600 1550 -1950 1550
Wire Wire Line
      -1600 1950 -1950 1950
Wire Wire Line
      -2450 1800 -2800 1800
Wire Wire Line
      -2450 2200 -2800 2200
Wire Wire Line
      -3350 2350 -3800 2350
Wire Wire Line
      -3800 2750 -3350 2750
Wire Wire Line
      -3800 1900 -3450 1900
Wire Wire Line
      -3450 1500 -3800 1500
Wire Wire Line
      -3450 400 -3800 400
Wire Wire Line
      -3800 800 -3450 800
Wire Wire Line
      -2100 850 -2550 850
Wire Wire Line
      -2550 1250 -2100 1250
Wire Wire Line
      -3750 -500 -3400 -500
Wire Wire Line
      -3750 -100 -3400 -100
Wire Wire Line
      -2700 -400 -2350 -400
Wire Wire Line
      -2700 0 -2350 0
Wire Wire Line
      -1050 1950 -700 1950
Wire Wire Line
      -1050 2350 -700 2350
Wire Wire Line
      -300 400 50 400
Wire Wire Line
      -300 800 50 800
Wire Wire Line
      -300 1300 50 1300
Wire Wire Line
      -300 1700 50 1700
Wire Wire Line
      -300 2450 50 2450
Wire Wire Line
      -300 2850 50 2850
$Comp
L VCC #PWR16
U 1 1 5213C820
P -300 2350
F 0 "#PWR16" H -300 2450 30 
F 1 "VCC" H -300 2450 30 
        1    -300 2350
        1    0    0    -1  
$EndComp
Wire Wire Line
      -300 2350 -300 2450
$Comp
L ~GND #PWR17
U 1 1 5213C820
P -300 2900
F 0 "#PWR17" H -300 2900 30 
F 1 "~GND" H -300 2830 30 
        1    -300 2900
        1    0    0    -1  
$EndComp
Connection ~ -300 2850
Wire Wire Line
      -300 2850 -300 2900
$Comp
L ~GND #PWR18
U 1 1 5213C820
P -1050 2450
F 0 "#PWR18" H -1050 2450 30 
F 1 "~GND" H -1050 2380 30 
        1    -1050 2450
        1    0    0    -1  
$EndComp
Connection ~ -1050 2350
Wire Wire Line
      -1050 2350 -1050 2450
$Comp
L VCC #PWR19
U 1 1 5213C820
P -1050 1850
F 0 "#PWR19" H -1050 1950 30 
F 1 "VCC" H -1050 1950 30 
        1    -1050 1850
        1    0    0    -1  
$EndComp
Wire Wire Line
      -1050 1850 -1050 1950
$Comp
L ~GND #PWR20
U 1 1 5213C820
P -300 1800
F 0 "#PWR20" H -300 1800 30 
F 1 "~GND" H -300 1730 30 
        1    -300 1800
        1    0    0    -1  
$EndComp
Connection ~ -300 1700
Wire Wire Line
      -300 1700 -300 1800
$Comp
L VCC #PWR21
U 1 1 5213C820
P -300 1200
F 0 "#PWR21" H -300 1300 30 
F 1 "VCC" H -300 1300 30 
        1    -300 1200
        1    0    0    -1  
$EndComp
Wire Wire Line
      -300 1200 -300 1300
$Comp
L VCC #PWR22
U 1 1 5213C820
P -1450 800
F 0 "#PWR22" H -1450 900 30 
F 1 "VCC" H -1450 900 30 
        1    -1450 800 
        1    0    0    -1  
$EndComp
Wire Wire Line
      -1450 800 -1450 900
$Comp
L ~GND #PWR23
U 1 1 5213C820
P -1450 1400
F 0 "#PWR23" H -1450 1400 30 
F 1 "~GND" H -1450 1330 30 
        1    -1450 1400
        1    0    0    -1  
$EndComp
Connection ~ -1450 1300
Wire Wire Line
      -1450 1300 -1450 1400
$Comp
L VCC #PWR24
U 1 1 5213C820
P -300 300
F 0 "#PWR24" H -300 400 30 
F 1 "VCC" H -300 400 30 
        1    -300 300 
        1    0    0    -1  
$EndComp
Wire Wire Line
      -300 300 -300 400
$Comp
L ~GND #PWR25
U 1 1 5213C820
P -300 900
F 0 "#PWR25" H -300 900 30 
F 1 "~GND" H -300 830 30 
        1    -300 900 
        1    0    0    -1  
$EndComp
Connection ~ -300 800
Wire Wire Line
      -300 800 -300 900
$Comp
L ~GND #PWR26
U 1 1 5213C820
P -1150 350
F 0 "#PWR26" H -1150 350 30 
F 1 "~GND" H -1150 280 30 
        1    -1150 350 
        1    0    0    -1  
$EndComp
Connection ~ -1150 250
Wire Wire Line
      -1150 250 -1150 350
$Comp
L VCC #PWR27
U 1 1 5213C820
P -1150 -250
F 0 "#PWR27" H -1150 -150 30 
F 1 "VCC" H -1150 -150 30 
        1    -1150 -250
        1    0    0    -1  
$EndComp
Wire Wire Line
      -1150 -250 -1150 -150
$Comp
L VCC #PWR28
U 1 1 5213C820
P -1850 100
F 0 "#PWR28" H -1850 200 30 
F 1 "VCC" H -1850 200 30 
        1    -1850 100 
        1    0    0    -1  
$EndComp
Wire Wire Line
      -1850 100 -1850 200
$Comp
L ~GND #PWR29
U 1 1 5213C820
P -1850 700
F 0 "#PWR29" H -1850 700 30 
F 1 "~GND" H -1850 630 30 
        1    -1850 700 
        1    0    0    -1  
$EndComp
Connection ~ -1850 600
Wire Wire Line
      -1850 600 -1850 700
$Comp
L VCC #PWR30
U 1 1 5213C820
P -2550 750
F 0 "#PWR30" H -2550 850 30 
F 1 "VCC" H -2550 850 30 
        1    -2550 750 
        1    0    0    -1  
$EndComp
$Comp
L ~GND #PWR31
U 1 1 5213C820
P -2550 1350
F 0 "#PWR31" H -2550 1350 30 
F 1 "~GND" H -2550 1280 30 
        1    -2550 1350
        1    0    0    -1  
$EndComp
Connection ~ -2550 1250
Wire Wire Line
      -2550 1250 -2550 1350
Wire Wire Line
      -2550 750 -2550 850
$Comp
L VCC #PWR32
U 1 1 5213C820
P -3800 300
F 0 "#PWR32" H -3800 400 30 
F 1 "VCC" H -3800 400 30 
        1    -3800 300 
        1    0    0    -1  
$EndComp
$Comp
L ~GND #PWR33
U 1 1 5213C820
P -3800 900
F 0 "#PWR33" H -3800 900 30 
F 1 "~GND" H -3800 830 30 
        1    -3800 900 
        1    0    0    -1  
$EndComp
Connection ~ -3800 800
Wire Wire Line
      -3800 800 -3800 900
Wire Wire Line
      -3800 300 -3800 400
$Comp
L VCC #PWR34
U 1 1 5213C820
P -3800 2250
F 0 "#PWR34" H -3800 2350 30 
F 1 "VCC" H -3800 2350 30 
        1    -3800 2250
        1    0    0    -1  
$EndComp
$Comp
L ~GND #PWR35
U 1 1 5213C820
P -3800 2850
F 0 "#PWR35" H -3800 2850 30 
F 1 "~GND" H -3800 2780 30 
        1    -3800 2850
        1    0    0    -1  
$EndComp
Connection ~ -3800 2750
Wire Wire Line
      -3800 2750 -3800 2850
Wire Wire Line
      -3800 2250 -3800 2350
$Comp
L ~GND #PWR36
U 1 1 5213C820
P -3800 2000
F 0 "#PWR36" H -3800 2000 30 
F 1 "~GND" H -3800 1930 30 
        1    -3800 2000
        1    0    0    -1  
$EndComp
Connection ~ -3800 1900
Wire Wire Line
      -3800 1900 -3800 2000
$Comp
L VCC #PWR37
U 1 1 5213C820
P -3800 1400
F 0 "#PWR37" H -3800 1500 30 
F 1 "VCC" H -3800 1500 30 
        1    -3800 1400
        1    0    0    -1  
$EndComp
Wire Wire Line
      -3800 1400 -3800 1500
$Comp
L VCC #PWR38
U 1 1 5213C820
P -1950 1450
F 0 "#PWR38" H -1950 1550 30 
F 1 "VCC" H -1950 1550 30 
        1    -1950 1450
        1    0    0    -1  
$EndComp
$Comp
L ~GND #PWR39
U 1 1 5213C820
P -1950 2050
F 0 "#PWR39" H -1950 2050 30 
F 1 "~GND" H -1950 1980 30 
        1    -1950 2050
        1    0    0    -1  
$EndComp
Connection ~ -1950 1950
Wire Wire Line
      -1950 1950 -1950 2050
Wire Wire Line
      -1950 1450 -1950 1550
$Comp
L VCC #PWR40
U 1 1 5213C820
P -2800 1700
F 0 "#PWR40" H -2800 1800 30 
F 1 "VCC" H -2800 1800 30 
        1    -2800 1700
        1    0    0    -1  
$EndComp
$Comp
L ~GND #PWR41
U 1 1 5213C820
P -2800 2300
F 0 "#PWR41" H -2800 2300 30 
F 1 "~GND" H -2800 2230 30 
        1    -2800 2300
        1    0    0    -1  
$EndComp
Connection ~ -2800 2200
Wire Wire Line
      -2800 2200 -2800 2300
Wire Wire Line
      -2800 1700 -2800 1800
$Comp
L VCC #PWR43
U 1 1 5213C820
P -2700 -500
F 0 "#PWR43" H -2700 -400 30 
F 1 "VCC" H -2700 -400 30 
        1    -2700 -500
        1    0    0    -1  
$EndComp
$Comp
L ~GND #PWR44
U 1 1 5213C820
P -2700 100
F 0 "#PWR44" H -2700 100 30 
F 1 "~GND" H -2700 30 30 
        1    -2700 100 
        1    0    0    -1  
$EndComp
Connection ~ -2700 0
Wire Wire Line
      -2700 0 -2700 100
Wire Wire Line
      -2700 -500 -2700 -400
$Comp
L VCC #PWR45
U 1 1 5213C820
P -3750 -600
F 0 "#PWR45" H -3750 -500 30 
F 1 "VCC" H -3750 -500 30 
        1    -3750 -600
        1    0    0    -1  
$EndComp
$Comp
L ~GND #PWR46
U 1 1 5213C820
P -3750 0
F 0 "#PWR46" H -3750 0 30 
F 1 "~GND" H -3750 -70 30 
        1    -3750 0   
        1    0    0    -1  
$EndComp
Connection ~ -3750 -100
Wire Wire Line
      -3750 -100 -3750 0
Wire Wire Line
      -3750 -600 -3750 -500
$Comp
L VCC #PWR47
U 1 1 5213C820
P -5500 -200
F 0 "#PWR47" H -5500 -100 30 
F 1 "VCC" H -5500 -100 30 
        1    -5500 -200
        1    0    0    -1  
$EndComp
Wire Wire Line
      -5400 -50 -5500 -50
Wire Wire Line
      -5500 -50 -5500 -200
$Comp
L ~GND #PWR48
U 1 1 5213C820
P -5500 250
F 0 "#PWR48" H -5500 250 30 
F 1 "~GND" H -5500 180 30 
        1    -5500 250 
        1    0    0    -1  
$EndComp
Wire Wire Line
      -5500 250 -5500 150
Wire Wire Line
      -5500 150 -5400 150
$Comp
L ~GND #PWR49
U 1 1 5213C820
P -5500 1200
F 0 "#PWR49" H -5500 1200 30 
F 1 "~GND" H -5500 1130 30 
        1    -5500 1200
        1    0    0    -1  
$EndComp
Wire Wire Line
      -5500 1200 -5500 1050
Wire Wire Line
      -5500 1050 -5400 1050
$Comp
L VCC #PWR50
U 1 1 5213C820
P -5500 650
F 0 "#PWR50" H -5500 750 30 
F 1 "VCC" H -5500 750 30 
        1    -5500 650 
        1    0    0    -1  
$EndComp
Wire Wire Line
      -5400 850 -5500 850
Wire Wire Line
      -5500 850 -5500 650
$Comp
L ~GND #PWR52
U 1 1 5213C820
P -5500 2200
F 0 "#PWR52" H -5500 2200 30 
F 1 "~GND" H -5500 2130 30 
        1    -5500 2200
        1    0    0    -1  
$EndComp
Wire Wire Line
      -5400 2050 -5500 2050
Wire Wire Line
      -5500 2050 -5500 2200
Wire Wire Line
      -5400 950 -5750 950
Wire Wire Line
      -5750 950 -5750 1850
Wire Wire Line
      -5750 1850 -5400 1850
Connection ~ -5750 950
Wire Wire Line
      -5750 950 -5750 -1100
Wire Wire Line
      -5750 -1100 -3250 -1100
Wire Wire Line
      -100 -400 -100 50
$Comp
L WS2812B U19
U 1 1 5213C820
P -1850 400
F 0 "U19" H -1850 540 60 
F 1 "WS2812B" H -1850 260 60 
        1    -1850 400 
        1    0    0    -1  
$EndComp
Wire Wire Line
      -100 1500 -100 1100
Connection ~ 700 1100
Wire Wire Line
      -1350 -500 -1350 50
Wire Wire Line
      -950 50 -950 500
Wire Wire Line
      -950 500 -1300 500
Wire Wire Line
      -1300 500 -1300 150
Wire Wire Line
      -1300 150 -1550 150
Wire Wire Line
      -1550 150 -1550 -100
Wire Wire Line
      -1550 -100 -2050 -100
Wire Wire Line
      -2050 -100 -2050 400
Wire Wire Line
      -1650 400 -1650 800
Wire Wire Line
      -1650 800 -1950 800
Wire Wire Line
      -1950 800 -2250 800
Wire Wire Line
      -2250 800 -2250 300
Wire Wire Line
      -2250 300 -2900 300
Connection ~ -4100 -300
Wire Wire Line
      -2500 -200 -2500 -650
Wire Wire Line
      -2500 -650 -3450 -650
Wire Wire Line
      -3450 -650 -3450 -800
Wire Wire Line
      -3450 -800 -4100 -800
Wire Wire Line
      -4100 -800 -4100 -300
Wire Wire Line
      -3550 -300 -3550 100
Wire Wire Line
      -3550 100 -3950 100
Wire Wire Line
      -3950 100 -4000 100
Wire Wire Line
      -4000 100 -4000 600
Wire Wire Line
      -3600 600 -3600 1000
Wire Wire Line
      -3600 1000 -2750 1000
Wire Wire Line
      -2750 1000 -2750 1050
Wire Wire Line
      -2350 1050 -2350 1350
Wire Wire Line
      -2350 1350 -2000 1350
Wire Wire Line
      -2000 1350 -2000 1150
Wire Wire Line
      -2000 1150 -1650 1150
Wire Wire Line
      -1650 1150 -1650 1100
Wire Wire Line
      -1250 1100 -1250 1450
Connection ~ -1250 1450
Wire Wire Line
      -1250 1450 -1250 2150
Wire Wire Line
      -850 2150 -850 2700
Wire Wire Line
      -850 2700 -2150 2700
Wire Wire Line
      -2150 2700 -2150 1750
Wire Wire Line
      -1750 1750 -1750 2550
Wire Wire Line
      -1750 2550 -3000 2550
Wire Wire Line
      -3000 2550 -3000 2000
Wire Wire Line
      -2600 2000 -2600 1500
Wire Wire Line
      -2600 1500 -3300 1500
Wire Wire Line
      -3300 1500 -3300 1150
Wire Wire Line
      -3300 1150 -4100 1150
Wire Wire Line
      -4100 1150 -4100 1700
Wire Wire Line
      -4100 1700 -4000 1700
Wire Wire Line
      -3600 1700 -3600 2100
Wire Wire Line
      -3600 2100 -4100 2100
Wire Wire Line
      -4100 2100 -4100 2550
Wire Wire Line
      -4100 2550 -4000 2550
Wire Wire Line
      -3600 2550 -3600 3500
Wire Wire Line
      -3600 3500 -2700 3500
Wire Wire Line
      -2300 3500 -2300 3850
Wire Wire Line
      -2300 3850 -1750 3850
Wire Wire Line
      -1750 3850 -1750 3500
Wire Wire Line
      -1750 3500 -1550 3500
Wire Wire Line
      -1150 3500 -1150 3000
Wire Wire Line
      -1150 3000 -500 3000
Wire Wire Line
      -500 3000 -500 2650
Wire Wire Line
      -100 2650 -100 2100
Wire Wire Line
      -100 2100 -500 2100
Wire Wire Line
      -500 2100 -500 1500
Connection ~ -100 50
Wire Wire Line
      -100 50 -450 50
Wire Wire Line
      -450 50 -600 50
Wire Wire Line
      -600 50 -600 600
Wire Wire Line
      -600 600 -500 600
Connection ~ -1350 -500
Wire Wire Line
      -100 600 -100 950
Wire Wire Line
      -100 950 -650 950
Wire Wire Line
      -650 950 -650 -500
Wire Wire Line
      -650 -500 -1350 -500
$Comp
L ~CONN_1 P8
U 1 1 5213C820
P 950 3650
F 0 "" H 1030 3650 40 0000 C CNN
F 1 "" H 950 3705 30 0000 C CNN
        1    950  3650
        1    0    0    -1  
$EndComp
$Comp
L ~CONN_1 P7
U 1 1 5213C820
P 900 2700
F 0 "" H 980 2700 40 0000 C CNN
F 1 "" H 900 2755 30 0000 C CNN
        1    900  2700
        1    0    0    -1  
$EndComp
$Comp
L ~CONN_1 P5
U 1 1 5213C820
P 1750 2700
F 0 "" H 1830 2700 40 0000 C CNN
F 1 "" H 1750 2755 30 0000 C CNN
        1    1750 2700
        1    0    0    -1  
$EndComp
$Comp
L ~CONN_1 P6
U 1 1 5213C820
P 1800 3600
F 0 "" H 1880 3600 40 0000 C CNN
F 1 "" H 1800 3655 30 0000 C CNN
        1    1800 3600
        1    0    0    -1  
$EndComp
$EndSCHEMATC
