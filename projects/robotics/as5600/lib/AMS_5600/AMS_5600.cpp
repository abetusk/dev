/****************************************************
/* AMS 5600 class for Arduino platform
/* Author: Tom Denton
/* Date: 15 Dec 2014 
/* File: AMS_5600.cpp
/* Version 1.00
/* www.ams.com
/*  
/* Description:  This class has been designed to
/* access the AMS 5600 “potuino” shield.
/*
/***************************************************/

#include "Arduino.h"
#include "AMS_5600.h"
#include "Wire.h"

/****************************************************
/* Method: AMS_5600
/* In: none
/* Out: none
/* Description: constructor class for AMS 5600
/***************************************************/
AMS_5600::AMS_5600()
{
  /* set i2c address */ 
  _ams5600_Address = 0x36;
 
  /* load register values*/
  /* c++ class forbids pre loading of variables */
  _zmco = 0x00;
  _zpos_hi = 0x01;
  _zpos_lo = 0x02;
  _mpos_hi = 0x03;
  _mpos_lo = 0x04;
  _mang_hi = 0x05;
  _mang_lo = 0x06;
  _conf_hi = 0x07;    
  _conf_lo = 0x08;
  _raw_ang_hi = 0x0c;
  _raw_ang_lo = 0x0d;
  _ang_hi = 0x0e;
  _ang_lo = 0x0f;
  _stat = 0x0b;
  _agc = 0x1a;
  _mag_hi = 0x1b;
  _mag_lo = 0x1c;
  _burn = 0xff;
}

/****************************************************
/* Method: AMS_5600
/* In: none
/* Out: i2c address of AMS 5600
/* Description: returns i2c address of AMS 5600
/***************************************************/
int AMS_5600::getAddress()
{
  return _ams5600_Address; 
}

/*******************************************************
/* Method: setMaxAngle
/* In: new maximum angle to set OR none
/* Out: value of max angle register
/* Description: sets a value in maximum angle register.
/* If no value is provided, method will read position of
/* magnet.  Setting this register zeros out max position
/* register.
/*******************************************************/
word AMS_5600::setMaxAngle(word newMaxAngle)
{
  word retVal;
  if(newMaxAngle == -1)
  {
    _maxAngle = getRawAngle();
  }
  else
    _maxAngle = newMaxAngle;

  writeOneByte(_mang_hi, highByte(_maxAngle));
  delay(2); 
  writeOneByte(_mang_lo, lowByte(_maxAngle)); 
  delay(2);         

  retVal = readTwoBytes(_mang_hi, _mang_lo);
  return retVal;
}

/*******************************************************
/* Method: getMaxAngle
/* In: none
/* Out: value of max angle register
/* Description: gets value of maximum angle register.
/*******************************************************/
word AMS_5600::getMaxAngle()
{
  return readTwoBytes(_mang_hi, _mang_lo);
}


/*******************************************************
/* Method: getConfigure()
/* In: none
/* Out: value of configure register
/* Description: gets value of configure register.
/*******************************************************/
word AMS_5600::getConfigure()
{
  return readTwoBytes(_conf_hi, _conf_lo);
}

/*******************************************************
/* Method: setConfigure
/* In: new configure value
/* Out: value of configure register
/* Description: sets a value in configure register.
/*******************************************************/
word AMS_5600::setConfigure(word confValue)
{
  writeOneByte(_conf_hi, highByte(confValue));
  delay(2); 
  writeOneByte(_conf_lo, lowByte(confValue)); 
  delay(2);
  
  return getConfigure();
}

/*******************************************************
/* Method: setStartPosition
/* In: new start angle position
/* Out: value of start position register
/* Description: sets a value in start position register.
/* If no value is provided, method will read position of
/* magnet.  
/*******************************************************/
word AMS_5600::setStartPosition(word startAngle)
{
  if(startAngle == -1)
  {
    _rawStartAngle = getRawAngle();
  }
  else
    _rawStartAngle = startAngle;

  writeOneByte(_zpos_hi, highByte(_rawStartAngle));
  delay(2); 
  writeOneByte(_zpos_lo, lowByte(_rawStartAngle)); 
  delay(2);                
  _zPosition = readTwoBytes(_zpos_hi, _zpos_lo);
  
  return(_zPosition);
}

/*******************************************************
/* Method: getStartPosition
/* In: none
/* Out: value of start position register
/* Description: gets value of start position register.
/*******************************************************/
word AMS_5600::getStartPosition()
{
  return readTwoBytes(_zpos_hi, _zpos_lo);
}  

/*******************************************************
/* Method: setEndtPosition
/* In: new end angle position
/* Out: value of end position register
/* Description: sets a value in end position register.
/* If no value is provided, method will read position of
/* magnet.  
/*******************************************************/
word AMS_5600::setEndPosition(word endAngle)
{
  if(endAngle == -1)
    _rawEndAngle = getRawAngle();
  else
    _rawEndAngle = endAngle;
 
  writeOneByte(_mpos_hi, highByte(_rawEndAngle));
  delay(2); 
  writeOneByte(_mpos_lo, lowByte(_rawEndAngle)); 
  delay(2);                
  _mPosition = readTwoBytes(_mpos_hi, _mpos_lo);
  
  return(_mPosition);
}

/*******************************************************
/* Method: getEndPosition
/* In: none
/* Out: value of end position register
/* Description: gets value of end position register.
/*******************************************************/
word AMS_5600::getEndPosition()
{
  word retVal = readTwoBytes(_mpos_hi, _mpos_lo);
  return retVal;
}  

/*******************************************************
/* Method: getRawAngle
/* In: none
/* Out: value of raw angle register
/* Description: gets raw value of magnet position.
/* start, end, and max angle settings do not apply
/*******************************************************/
word AMS_5600::getRawAngle()
{
  return readTwoBytes(_raw_ang_hi, _raw_ang_lo);

  word ang_hi = readOneByte(_raw_ang_hi);
  word ang_lo = readOneByte(_raw_ang_lo);
  //return ang_hi * 22.5 + ang_lo * 0.087890625;
  return (ang_hi << 8) | ang_lo;

}

/*******************************************************
/* Method: getScaledAngle
/* In: none
/* Out: value of scaled angle register
/* Description: gets scaled value of magnet position.
/* start, end, or max angle settings are used to 
/* determine value
/*******************************************************/
float AMS_5600::getScaledAngle()
{
  return readTwoBytes(_ang_hi, _ang_lo);

  int ang_hi = readOneByte(_raw_ang_hi);
  int ang_lo = readOneByte(_raw_ang_lo);
  return ang_hi * 22.5 + ang_lo * 0.087890625;

}

/*******************************************************
/* Method: detectMagnet
/* In: none
/* Out: 1 if magnet is detected, 0 if not
/* Description: reads status register and examines the 
/* MH bit
/*******************************************************/
int AMS_5600::detectMagnet()
{
  int magStatus;
  int retVal = 0;
  /*0 0 MD ML MH 0 0 0*/
  /* MD high = AGC minimum overflow, Magnet to strong */
  /* ML high = AGC Maximum overflow, magnet to weak*/ 
  /* MH high = magnet detected*/ 
  magStatus = readOneByte(_stat);
  
  if(magStatus & 0x20)
    retVal = 1; 
  
  return retVal;
}

/*******************************************************
/* Method: getMagnetStrength
/* In: none
/* Out: 0 if no magnet is detected
/*      1 if magnet is to weak
/*      2 if magnet is just right
/*      3 if magnet is to strong
/* Description: reads status register andexamins the MH,ML,MD bits
/*******************************************************/
int AMS_5600::getMagnetStrength()
{
  int magStatus;
  int retVal = 0;
  /*0 0 MD ML MH 0 0 0*/
  /* MD high = AGC minimum overflow, Magnet to strong */
  /* ML high = AGC Maximum overflow, magnet to weak*/ 
  /* MH high = magnet detected*/ 
  magStatus = readOneByte(_stat);
  if(detectMagnet() ==1)
  {
      retVal = 2; /*just right */
      if(magStatus & 0x10)
        retVal = 1; /*to weak */
      else if(magStatus & 0x08)
        retVal = 3; /*to strong */
  }
  
  return retVal;
}

/*******************************************************
/* Method: get Agc
/* In: none
/* Out: value of AGC register
/* Description: gets value of AGC register.
/*******************************************************/
int AMS_5600::getAgc()
{
  return readOneByte(_agc);
}

/*******************************************************
/* Method: getMagnitude
/* In: none
/* Out: value of magnitude register
/* Description: gets value of magnitude register.
/*******************************************************/
word AMS_5600::getMagnitude()
{
  return readTwoBytes(_mag_hi, _mag_lo);  
}

/*******************************************************
/* Method: getBurnCount
/* In: none
/* Out: value of zmco register
/* Description: determines how many times chip has been
/* permanently written to. 
/*******************************************************/
int AMS_5600::getBurnCount()
{
  return readOneByte(_zmco);
}

/*******************************************************
/* Method: burnAngle
/* In: none
/* Out: 1 success
/*     -1 no magnet
/*     -2 burn limit exceeded
/*     -3 start and end positions not set (useless burn)
/* Description: burns start and end positions to chip.
/* THIS CAN ONLY BE DONE 3 TIMES
/*******************************************************/
int AMS_5600::burnAngle()
{
  int retVal = 1;
  _zPosition = getStartPosition();
  _mPosition = getEndPosition();
  _maxAngle  = getMaxAngle();
  
  if(detectMagnet() == 1)
  {
    if(getBurnCount() < 3)
    {
      if((_zPosition == 0)&&(_mPosition ==0))
        retVal = -3;
      else
        writeOneByte(_burn, 0x80);
    }
    else
      retVal = -2;
  } 
  else
    retVal = -1;
    
  return retVal;
}

/*******************************************************
/* Method: burnMaxAngleAndConfig
/* In: none
/* Out: 1 success
/*     -1 burn limit exceeded
/*     -2 max angle is to small, must be at or above 18 degrees
/* Description: burns max angle and config data to chip.
/* THIS CAN ONLY BE DONE 1 TIME
/*******************************************************/
int AMS_5600::burnMaxAngleAndConfig()
{
  int retVal = 1;
  _maxAngle  = getMaxAngle();
  
  if(getBurnCount() ==0)
  {
    if(_maxAngle*0.087 < 18)
      retVal = -2;
    else
      writeOneByte(_burn, 0x40);    
  }  
  else
    retVal = -1;
    
  return retVal;
}


/*******************************************************
/* Method: readOneByte
/* In: register to read
/* Out: data read from i2c
/* Description: reads one byte register from i2c
/*******************************************************/
int AMS_5600::readOneByte(int in_adr)
{
  byte status;
  int retVal = -1;

  Wire.beginTransmission(_ams5600_Address);
  Wire.write(in_adr);
  status = Wire.endTransmission();
  Wire.requestFrom(_ams5600_Address, 1, 0);
  while(Wire.available() == 0);
  retVal = Wire.read();
  
  return retVal;
}

/*******************************************************
/* Method: readOneByte
/* In: two registers to read
/* Out: data read from i2c as a word
/* Description: reads two bytes register from i2c
/*******************************************************/
word AMS_5600::readTwoBytes(int in_adr_hi, int in_adr_lo)
{
  word retVal = -1;
 
  /* Read Low Byte */
  Wire.beginTransmission(_ams5600_Address);
  Wire.write(in_adr_lo);
  Wire.endTransmission();
  //Wire.requestFrom(_ams5600_Address, 1);
  Wire.requestFrom(_ams5600_Address, 1, 0);
  while(Wire.available() == 0);
  int low = Wire.read();
 
  /* Read High Byte */  
  Wire.beginTransmission(_ams5600_Address);
  Wire.write(in_adr_hi);
  Wire.endTransmission();
  //Wire.requestFrom(_ams5600_Address, 1);
  Wire.requestFrom(_ams5600_Address, 1, 0);
  
  while(Wire.available() == 0);
  
  word high = Wire.read();
  
  high = high << 8;
  retVal = high | low;
  
  return retVal;
}

/*******************************************************
/* Method: writeOneByte
/* In: address and data to write
/* Out: none
/* Description: writes one byte to a i2c register
/*******************************************************/
void AMS_5600::writeOneByte(int adr_in, int dat_in)
{
  Wire.beginTransmission(_ams5600_Address);
  Wire.write(adr_in); 
  Wire.write(dat_in);
  Wire.endTransmission();
}

/**********  END OF AMS 5600 CALSS *****************/
