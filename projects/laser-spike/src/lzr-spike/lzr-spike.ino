 
// Parts of source code taken from the PICCOLO project:
//
// 
// Written by Adafruit Industries.  Distributed under the BSD license --
// see license.txt for more information.  This paragraph must be included
// in any redistribution.
//
// ffft library is provided under its own terms -- see ffft.S for specifics.
//
// extended by abetusk and kept under the same BSD style license.
//

#include <Wire.h>
#include <Adafruit_PWMServoDriver.h>

// IMPORTANT: FFT_N should be #defined as 128 in ffft.h.

#include <avr/pgmspace.h>
#include <ffft.h>
//#include <math.h>



enum laser_state_enum {
  STATE_LASER_TWINKLE = 0,
  STATE_LASER_GEQ,
  STATE_LASER_JOYSTICK,
  STATE_LASER_N,
};

typedef struct debounce_type {
  int threshold;
  int count;
} debounce_t;

debounce_t btn_debounce;



int laser_state;

// called this way, it uses the default address 0x40
Adafruit_PWMServoDriver pwm0 = Adafruit_PWMServoDriver();
Adafruit_PWMServoDriver pwm1 = Adafruit_PWMServoDriver(0x41);

#define SENSE_X A1
#define SENSE_Y A2
#define BUTTON A3

int sense_x=0;
int sense_y=0;
int button = 0;
int count=0;

uint16_t g_laser_pwm=0;
uint8_t g_laser_pwm_del = 8;
uint8_t n_pwm = 16;

// Microphone connects to Analog Pin 0.  Corresponding ADC channel number
// varies among boards...it's ADC0 on Uno and Mega, ADC7 on Leonardo.
// Other boards may require different settings; refer to datasheet.

#define ADC_CHANNEL 0

int16_t       capture[FFT_N];    // Audio capture buffer
complex_t     bfly_buff[FFT_N];  // FFT "butterfly" buffer
uint16_t      spectrum[FFT_N/2]; // Spectrum output buffer
volatile byte samplePos = 0;     // Buffer position counter

byte peak[8],      // Peak level of each column; used for falling dots
     dotCount = 0, // Frame counter for delaying dot-falling speed
     colCount = 0; // Frame counter for storing past column data
int col[8][10],   // Column levels for the prior 10 frames
    minLvlAvg[8], // For dynamic adjustment of low & high ends of graph,
    maxLvlAvg[8], // pseudo rolling averages for the prior few frames.
    colDiv[8];    // Used when filtering FFT output to 8 columns

/*
These tables were arrived at through testing, modeling and trial and error,
exposing the unit to assorted music and sounds.  But there's no One Perfect
EQ Setting to Rule Them All, and the graph may respond better to some
inputs than others.  The software works at making the graph interesting,
but some columns will always be less lively than others, especially
comparing live speech against ambient music of varying genres.
*/
static const uint8_t PROGMEM
  // This is low-level noise that's subtracted from each FFT output column:
  noise[64]={ 8,6,6,5,3,4,4,4,3,4,4,3,2,3,3,4,
              2,1,2,1,3,2,3,2,1,2,3,1,2,3,4,4,
              3,2,2,2,2,2,2,1,3,2,2,2,2,2,2,2,
              2,2,2,2,2,2,2,2,2,2,2,2,2,3,3,4 },
  // These are scaling quotients for each FFT output column, sort of a
  // graphic EQ in reverse.  Most music is pretty heavy at the bass end.
  eq[64]={
    255, 175,218,225,220,198,147, 99, 68, 47, 33, 22, 14,  8,  4,  2,
      0,   0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
      0,   0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
      0,   0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0 },
  // When filtering down to 8 columns, these tables contain indexes
  // and weightings of the FFT spectrum output values to use.  Not all
  // buckets are used -- the bottom-most and several at the top are
  // either noisy or out of range or generally not good for a graph.
  col0data[] = {  2,  1,  // # of spectrum bins to merge, index of first
    111,   8 },           // Weights for each bin
  col1data[] = {  4,  1,  // 4 bins, starting at index 1
     19, 186,  38,   2 }, // Weights for 4 bins.  Got it now?
  col2data[] = {  5,  2,
     11, 156, 118,  16,   1 },
  col3data[] = {  8,  3,
      5,  55, 165, 164,  71,  18,   4,   1 },
  col4data[] = { 11,  5,
      3,  24,  89, 169, 178, 118,  54,  20,   6,   2,   1 },
  col5data[] = { 17,  7,
      2,   9,  29,  70, 125, 172, 185, 162, 118, 74,
     41,  21,  10,   5,   2,   1,   1 },
  col6data[] = { 25, 11,
      1,   4,  11,  25,  49,  83, 121, 156, 180, 185,
    174, 149, 118,  87,  60,  40,  25,  16,  10,   6,
      4,   2,   1,   1,   1 },
  col7data[] = { 37, 16,
      1,   2,   5,  10,  18,  30,  46,  67,  92, 118,
    143, 164, 179, 185, 184, 174, 158, 139, 118,  97,
     77,  60,  45,  34,  25,  18,  13,   9,   7,   5,
      3,   2,   2,   1,   1,   1,   1 },
  // And then this points to the start of the data for each of the columns:
  * const colData[]  = {
    col0data, col1data, col2data, col3data,
    col4data, col5data, col6data, col7data };


//---

void teardown_geq() {

  Serial.print(">>> teardown geq");
  
  cli();
  ADCSRA = 0;
  ADCSRA |= (1<<ADPS2);
  ADCSRA |= (1<<ADPS1);
  ADCSRA |= (1<<ADPS0);
  ADCSRA |= (1<<ADEN);
  
  pinMode(SENSE_X, INPUT);
  pinMode(SENSE_Y, INPUT);
  pinMode(BUTTON, INPUT);
  sei();
}

//---

void setup_geq() {
  uint8_t i, j, nBins, binNum, *data;

Serial.print(">>> setup geq");

  memset(peak, 0, sizeof(peak));
  memset(col , 0, sizeof(col));

  for(i=0; i<8; i++) {
    minLvlAvg[i] = 0;
    maxLvlAvg[i] = 512;
    data         = (uint8_t *)pgm_read_word(&colData[i]);
    nBins        = pgm_read_byte(&data[0]) + 2;
    binNum       = pgm_read_byte(&data[1]);
    for(colDiv[i]=0, j=2; j<nBins; j++) {
      colDiv[i] += pgm_read_byte(&data[j]);
    }
  }
  
  cli();

  // Init ADC free-run mode; f = ( 16MHz/prescaler ) / 13 cycles/conversion 
  ADMUX  = ADC_CHANNEL; // Channel sel, right-adj, use AREF pin
  ADCSRA = _BV(ADEN)  | // ADC enable
           _BV(ADSC)  | // ADC start
           _BV(ADATE) | // Auto trigger
           _BV(ADIE)  | // Interrupt enable
           _BV(ADPS2) | _BV(ADPS1) | _BV(ADPS0); // 128:1 / 13 = 9615 Hz
  ADCSRB = 0;                // Free run mode, no high MUX bit
  DIDR0  = 1 << ADC_CHANNEL; // Turn off digital input for ADC pin
//  DIDR0  = (1 << ADC_CHANNEL) | (1 << 1) | (1<< 2) | (1<< 3); // Turn off digital input for ADC pin
  TIMSK0 = 0;                // Timer0 off

  sei();

  pinMode(BUTTON, INPUT);
}

//---

void setup() {
  btn_debounce.threshold = 20;
  btn_debounce.count = 0;

#ifdef DEBUG
  Serial.begin(115200);
  Serial.println("16 channel PWM test!");
#endif

  pwm0.begin();
  pwm0.setPWMFreq(1600);  // This is the maximum PWM frequency


  // if you want to really speed stuff up, you can go into 'fast 400khz I2C' mode
  // some i2c devices dont like this so much so if you're sharing the bus, watch
  // out for this!
  //Wire.setClock(400000);
  Wire.setClock(200000);

  pinMode(SENSE_X, INPUT);
  pinMode(SENSE_Y, INPUT);
  pinMode(BUTTON, INPUT);

}

//---

void laser_diode_twinkle() {
  uint8_t pwmnum;

  g_laser_pwm + (g_laser_pwm + g_laser_pwm_del) % 4096;

  // Drive each PWM in a 'wave'
  //
  for (pwmnum=0; pwmnum < n_pwm; pwmnum++) {
    pwm0.setPWM(pwmnum, 0, (g_laser_pwm + (4096/n_pwm)*pwmnum) % 4096 );
  }

}

//---

void laser_diode_geq() {
  uint8_t  i, x, L, *data, nBins, binNum, weighting, c;
  uint16_t minLvl, maxLvl;
  int      level, y, sum;

  static int xx=0;
  int report_every =2, ii;


  //while(ADCSRA & _BV(ADIE)); // Wait for audio sampling to finish
  if (ADCSRA & _BV(ADIE)) { return; } // Wait for audio sampling to finish

  fft_input(capture, bfly_buff);   // Samples -> complex #s
  samplePos = 0;                   // Reset sample counter
  ADCSRA |= _BV(ADIE);             // Resume sampling interrupt
  fft_execute(bfly_buff);          // Process complex data
  fft_output(bfly_buff, spectrum); // Complex -> spectrum

  // Remove noise and apply EQ levels
  for(x=0; x<FFT_N/2; x++) {
    L = pgm_read_byte(&noise[x]);
    spectrum[x] = (spectrum[x] <= L) ? 0 :
      (((spectrum[x] - L) * (256L - pgm_read_byte(&eq[x]))) >> 8);
  }



  // Downsample spectrum output to 8 columns:
  for(x=0; x<8; x++) {
    data   = (uint8_t *)pgm_read_word(&colData[x]);
    nBins  = pgm_read_byte(&data[0]) + 2;
    binNum = pgm_read_byte(&data[1]);
    
    for(sum=0, i=2; i<nBins; i++)
      sum += spectrum[binNum++] * pgm_read_byte(&data[i]); // Weighted
    col[x][colCount] = sum / colDiv[x];                    // Average
    minLvl = maxLvl = col[x][0];
    for(i=1; i<10; i++) { // Get range of prior 10 frames
      if(col[x][i] < minLvl)      minLvl = col[x][i];
      else if(col[x][i] > maxLvl) maxLvl = col[x][i];
    }
    // minLvl and maxLvl indicate the extents of the FFT output, used
    // for vertically scaling the output graph (so it looks interesting
    // regardless of volume level).  If they're too close together though
    // (e.g. at very low volume levels) the graph becomes super coarse
    // and 'jumpy'...so keep some minimum distance between them (this
    // also lets the graph go to zero when no sound is playing):
    if((maxLvl - minLvl) < 8) maxLvl = minLvl + 8;
    minLvlAvg[x] = (minLvlAvg[x] * 7 + minLvl) >> 3; // Dampen min/max levels
    maxLvlAvg[x] = (maxLvlAvg[x] * 7 + maxLvl) >> 3; // (fake rolling average)

    // Second fixed-point scale based on dynamic min/max levels:
    level = 10L * (col[x][colCount] - minLvlAvg[x]) /
      (long)(maxLvlAvg[x] - minLvlAvg[x]);

    // Clip output and convert to byte:
    if(level < 0L)      c = 0;
    else if(level > 10) c = 10; // Allow dot to go a couple pixels off top
    else                c = (uint8_t)level;

    if(c > peak[x]) {
      peak[x] = c; // Keep dot on top
    }
  }
    
  // Every third frame, make the peak pixels drop by 1:
  if(++dotCount >= 3) {
    dotCount = 0;
    for(x=0; x<8; x++) {
      if(peak[x] > 0) peak[x]--;
    }
  }

  if(++colCount >= 10) { colCount = 0; }

  for (i=0; i < n_pwm; i++) {
    x = peak[i%8] * 4096 / 10;
    if (x>4095) { x = 4095; }
    if (x<0) { x=0; }
    pwm0.setPWM((i+geq_shift)%n_pwm, 0, x);
  }

}

//---

// Audio-sampling interrupt
//
ISR(ADC_vect) {
  
  static const int16_t noiseThreshold = 4;
  
  // 0-1023
  //
  int16_t              sample         = ADC;

  // Sign-convert for FFT; -512 to +511
  //
  capture[samplePos] =
    ((sample > (512-noiseThreshold)) &&
     (sample < (512+noiseThreshold))) ? 0 :
    sample - 512;

  // Buffer full, interrupt off
  //
  if(++samplePos >= FFT_N) { ADCSRA &= ~_BV(ADIE); }
}

//---

void laser_diode_joystick() {
  uint16_t s=0;
  uint8_t pwmnum;
  float f, p;

  s = ((sense_x > 1024) ? 1024 : sense_x) * 4;
  p = (float)((sense_y > 1024) ? 1024 : sense_y) / 1024.0;

  for (pwmnum=0; pwmnum < n_pwm; pwmnum++) {
    f = ((p>0.5) ? 1.0 : p);
    f *= (float)((s + (4096/n_pwm)*pwmnum));
    pwm0.setPWM(pwmnum, 0, (uint16_t)f);
    //pwm.setPWM(pwmnum, 0, (s + (4096/n_pwm)*pwmnum));
  }

}

//---

void loop() {
  uint16_t button_a;

  switch (laser_state) {
    case STATE_LASER_TWINKLE:   laser_diode_twinkle();  break;
    case STATE_LASER_GEQ:       laser_diode_geq();      break;
    case STATE_LASER_JOYSTICK:  laser_diode_joystick(); break;
    default:                    laser_diode_twinkle(); break;
  }

  button_a = digitalRead(BUTTON);
  if (button_a == 0) {
    btn_debounce.count++;
    if (btn_debounce.count >= btn_debounce.threshold) {

      if (button==1) {
        laser_state = (laser_state + 1) % STATE_LASER_N;
        button = 0;

        if (laser_state == STATE_LASER_GEQ) {
          setup_geq();
        }
        else {
          teardown_geq();
        }
#ifdef DEBUG
        Serial.print(">>> state change: ");
        Serial.println(laser_state);
#endif

      }

      btn_debounce.count=0;
      
    }
  } else {
    button = 1;
    btn_debounce.count=0;
  }

  if (laser_state != STATE_LASER_GEQ) {
    sense_x = analogRead(SENSE_X);
    sense_y = analogRead(SENSE_Y);
  }

#ifdef DEBUG
  if (count > 30) {
    if (laser_state == STATE_LASER_GEQ) {
      for (int i=0; i<8; i++) {
        Serial.print(" ");
        Serial.print(peak[i]);
      }
      Serial.println("");
    }
    else {
      Serial.print(button_a);
      Serial.print(" ");
      Serial.print(sense_x);
      Serial.print(" ");
      Serial.println(sense_y);
    }
    count=0;
  }
  count++;
#endif

}
