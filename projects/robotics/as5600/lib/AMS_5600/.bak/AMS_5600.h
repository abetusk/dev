/****************************************************
/* AMS 5600 class for Arduino platform
/* Author: Tom Denton
/* Date: 15 Dec 2014
/* File: AMS_5600.h 
/* Version 1.00
/* www.ams.com
/*  
/* Description:  This class has been designed to
/* access the AMS 5600 “potuino” shield.
/*
/***************************************************/

#ifndef AMS_5600_h
#define AMS_5600_h

#include <Arduino.h>

class AMS_5600
{
  public:
    
    AMS_5600(void);
    int getAddress();       
    
    word setMaxAngle(word newMaxAngle = -1);
    word getMaxAngle();

    word getConfigure();
    word setConfigure(word confValue);  
    
    word setStartPosition(word startAngle = -1);
    word getStartPosition();
    
    word setEndPosition(word endAngle = -1);
    word getEndPosition();
    
    word getRawAngle();
    word getScaledAngle();
    
    int  detectMagnet();
    int  getMagnetStrength();
    int  getAgc();
    word getMagnitude();
    
    int  getBurnCount();
    int  burnAngle();
    int  burnMaxAngleAndConfig();
    
  private:
  
    int _ams5600_Address;
      
    word _rawStartAngle;
    word _zPosition;
    word _rawEndAngle;
    word _mPosition;
    word _maxAngle;
    
    /* Registers */
    int _zmco;
    int _zpos_hi;    /*zpos[11:8] high nibble  START POSITION */
    int _zpos_lo;    /*zpos[7:0] */
    int _mpos_hi;    /*mpos[11:8] high nibble  STOP POSITION */
    int _mpos_lo;    /*mpos[7:0] */
    int _mang_hi;    /*mang[11:8] high nibble  MAXIMUM ANGLE */
    int _mang_lo;    /*mang[7:0] */
    int _conf_hi;    
    int _conf_lo;
    int _raw_ang_hi;
    int _raw_ang_lo;
    int _ang_hi;
    int _ang_lo;
    int _stat;
    int _agc;
    int _mag_hi;
    int _mag_lo;
    int _burn;
    
    int readOneByte(int in_adr);
    word readTwoBytes(int in_adr_hi, int in_adr_lo);
    void writeOneByte(int adr_in, int dat_in);
   
};
#endif
