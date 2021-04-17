// example of BLDC driver using L6234 and AS5600 encoder.
//

//////////////////////////////////////////////////////////////////////////
//
// UcnBrushlessDCMotorPWM example
//
// Arduino library for driving brushless DC motor like as servo motor
//
//
// https://usefullcode.net/
// https://github.com/usefullcodenet/UcnBrushlessDCMotorPWM
//
// Copyright (c) 2020 usefullcode.net <usefullcode@gmail.com>
//
// MIT License (MIT) <http://opensource.org/licenses/MIT>
//
//////////////////////////////////////////////////////////////////////////

//# Abstruct
//
// This sample code show how to drive brushless DC motor with continous rotation.
//
//
//# Prepare
//
//- MPU
//  - Arduino UNO board (ATMEGA328P)
//  - http://s.click.aliexpress.com/e/_dTG6WHQ
//
//- Motor driver
//  - L298N motor driver module
//  - http://s.click.aliexpress.com/e/_dVlgCao
//
//- Brushless DC motor
//  - DYS GM60-80T(24N22P) gimbal motor
//  - http://s.click.aliexpress.com/e/_d6vn8wY
//
//- External battery
//  - 5V mobile battery
//
//
//# Connection
//
//  Arduino UNO 9pin     ->    L298N modle IN1
//  Arduino UNO 10pin    ->    L298N modle IN2
//  Arduino UNO 11pin    ->    L298N modle IN3
//
//  L298N modle OUT1     ->    GM60-80T U
//  L298N modle OUT2     ->    GM60-80T V
//  L298N modle OUT3     ->    GM60-80T W
//
//  mobile battery 5V    ->    L298N modle 5V
//  mobile battery 5V    ->    L298N modle VIN
//  mobile battery GND   ->    L298N modle GND
//
//  mobile battery GND   ->    Arduino UNO GND
//
//  *L298N modle ENA/ENB jumpers are closed
//

//# ATTENTION
//
//  The brushless DC motor needs a large current. Be sure to use ampere meter.
//  Mobile battery with built-in safety circuit is recommended for the motor power supply,
//  and USB current meter is useful.
//
//  USB current meter  http://s.click.aliexpress.com/e/_dZpiddS
//


#include <UcnBrushlessDCMotorPWM.h>
#include <Wire.h>
#include <AS5600.h>

#define SYS_VOL   5

AMS_5600 ams5600;

int ang, lang = 0;

int okok=0;

UcnBrushlessDCMotorPWM _bldc;

// PWM output pin for BLDC driver
//
#define BLDC_DRV_IN1  9
#define BLDC_DRV_IN2  10
#define BLDC_DRV_IN3  11

// (option) ENABLE pin for BLDC driver
//
#define BLDC_DRV_EN1  5
#define BLDC_DRV_EN2  6
#define BLDC_DRV_EN3  7

// Pole count of BLDC motor
//
#define BLDC_MOTOR_POLE    22    //24N22P

//#define BLDC_MOTOR_POLE    14    //12N14P
//#define BLDC_MOTOR_POLE    26    //24N26P
//#define BLDC_MOTOR_POLE    28    //24N28P
//#define BLDC_MOTOR_POLE    32    //24N32P

// ams5600 uses A4 and A5 for I2C (?) communication
//

void setup() {
  Serial.begin(115200);
  Wire.begin();
  Serial.println(">>>>>>>>>>>>>>>>>>>>>>>>>>> ");

  if (ams5600.detectMagnet() == 0 ){

    while (1){
      if (ams5600.detectMagnet() == 1 ){
        Serial.print("Current Magnitude: ");
        Serial.println(ams5600.getMagnitude());
        break;
      }
      else{
        Serial.println("Can not detect magnet");
      }
      delay(1000);
    }
  }
  
  _bldc.begin(BLDC_MOTOR_POLE, BLDC_DRV_IN1, BLDC_DRV_IN2, BLDC_DRV_IN3, BLDC_DRV_EN1, BLDC_DRV_EN2, BLDC_DRV_EN3);
  _bldc.SetPower(50);    //motor power 80%
}

// Raw data reports 0 - 4095 segments, which is 0.087 of a degree
//
float convertRawAngleToDegrees(word newAngle) {
  float retVal = newAngle * 0.087;
  ang = retVal;
  return ang;
}

void loop() {

  // continuos rotation
  //
  _bldc.DoRotate(1);
  delayMicroseconds(3000);

  // rate limit messages
  //
  if (okok==16) {
    Serial.println(String(convertRawAngleToDegrees(ams5600.getRawAngle()),DEC));
    okok=0;
  }

  okok++;
}
