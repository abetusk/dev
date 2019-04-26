/* 
Driving a DVD drive spindle three-phase motor 
 
This code was used for the stroboscope project
  
This example code is in the public domain. Based on several Arduino code samples
 
http://elabz.com/
 
 */
 
// constants won't change. They're used here to 
// set pin numbers:
//const int buttonPin = 8;// the number of the direction pushbutton pin
//const int ledPin =  7;  // the number of the status LED pin (not the flash LED)
//const int potPin = 0;  // pot controls the RPM speed
//const int potPinFlash = 1;  // pot controls the flash speed
const int motorPin1 =  9;
const int motorPin2 = 10;
const int motorPin3 = 11;
//const int flashPin =12;
//const int motorDelay=5; // together with pot controls the RPM
const int motorDelay=1; // together with pot controls the RPM
//const int flashDelay=2; // controls duration of flash
const int frames=12; // has to be divisible by 3 in this version
const int serialDelay = 2000; //debug only
long serialLast =0; //debug only
// Variables will change:
//boolean ledState = false; // the current state of the status LED output pin
//int buttonState;    // the current reading from the direction input pin
//int potState;       // the current reading from the RPM speed potentiometer
//int potStateFlash; // the current reading from the flash rate potentiometer
//int lastButtonState = LOW; 
//int debounceDelay = 50;    // the debounce time; increase if the output flickers
boolean direct = true; // direction true=forward, false=backward
 
/*
int pwmSin[] = {127,110,94,78,64,50,37,26,17,10,4,1,0,1,4,10,17,26,37,50,64,78,94,110,127,144,160,176,191,204,217,228,237,244,250,253,254,253,250,244,237,228,217,204,191,176,160,144,127
}; // array of PWM duty values for 8-bit timer - sine function
*/


/*
int pwmSin[]={
  511,444,379,315,256,200,150,106,
  68,39,17,4,0,4,17,39,
  68,106,150,200,256,315,379,444,
  511,578,643,707,767,822,872,916,
  954,983,1005,1018,1022,1018,1005,983,
  954,916, 872,822,767,707,643,578,
  511
}; // array of PWM duty values for 10-bit timer - sine function
*/

/*
int pwmSin[]={
   255, 222, 189, 157, 128, 100,  75,  53,
    34,  19,   8,   2,   0,   2,   8,  19,
    34,  53,  75, 100, 128, 157, 189, 222,
   255, 289, 321, 353, 383, 411, 436, 458,
   477, 491, 502, 509, 511, 509, 502, 491,
   477, 458, 436, 411, 383, 353, 321, 289,
   255
};
*/

/*
int pwmSin[]={
   127, 111,  94,  78,  64,  50,  37,  26,
    17,   9,   4,   1,   0,   1,   4,   9,
    17,  26,  37,  50,  64,  78,  94, 111,
   127, 144, 160, 176, 191, 205, 218, 229,
   238, 245, 251, 254, 255, 254, 251, 245,
   238, 229, 218, 205, 191, 176, 160, 144,
   127
};
*/

#define TABLE_SIZE 768
#define OFFSET_0 0
#define OFFSET_1 256
#define OFFSET_2 512


byte pwmSin[] = {

   127, 126, 125, 124, 123, 122, 121, 120, 119, 118, 117, 116, 115, 113, 112, 111,
   110, 109, 108, 107, 106, 105, 104, 103, 102, 101, 100,  99,  98,  97,  96,  95,
    94,  93,  92,  91,  90,  89,  88,  87,  86,  85,  84,  83,  82,  81,  80,  79,
    78,  77,  76,  75,  74,  73,  72,  72,  71,  70,  69,  68,  67,  66,  65,  64,
    63,  62,  61,  61,  60,  59,  58,  57,  56,  55,  54,  54,  53,  52,  51,  50,
    49,  49,  48,  47,  46,  45,  45,  44,  43,  42,  41,  41,  40,  39,  38,  38,
    37,  36,  35,  35,  34,  33,  33,  32,  31,  30,  30,  29,  28,  28,  27,  26,
    26,  25,  25,  24,  23,  23,  22,  22,  21,  20,  20,  19,  19,  18,  18,  17,
    17,  16,  16,  15,  15,  14,  14,  13,  13,  12,  12,  11,  11,  10,  10,  10,
     9,   9,   8,   8,   8,   7,   7,   7,   6,   6,   6,   5,   5,   5,   4,   4,
     4,   4,   3,   3,   3,   3,   2,   2,   2,   2,   2,   1,   1,   1,   1,   1,
     1,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
     0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
     1,   1,   1,   1,   1,   1,   2,   2,   2,   2,   2,   3,   3,   3,   3,   4,
     4,   4,   4,   5,   5,   5,   6,   6,   6,   7,   7,   7,   8,   8,   8,   9,
     9,  10,  10,  10,  11,  11,  12,  12,  13,  13,  14,  14,  15,  15,  16,  16,
    17,  17,  18,  18,  19,  19,  20,  20,  21,  22,  22,  23,  23,  24,  25,  25,
    26,  26,  27,  28,  28,  29,  30,  30,  31,  32,  33,  33,  34,  35,  35,  36,
    37,  38,  38,  39,  40,  41,  41,  42,  43,  44,  45,  45,  46,  47,  48,  49,
    49,  50,  51,  52,  53,  54,  54,  55,  56,  57,  58,  59,  60,  61,  61,  62,
    63,  64,  65,  66,  67,  68,  69,  70,  71,  72,  72,  73,  74,  75,  76,  77,
    78,  79,  80,  81,  82,  83,  84,  85,  86,  87,  88,  89,  90,  91,  92,  93,
    94,  95,  96,  97,  98,  99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109,
   110, 111, 112, 113, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126,
   127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 141, 142, 143,
   144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159,
   160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175,
   176, 177, 178, 179, 180, 181, 182, 182, 183, 184, 185, 186, 187, 188, 189, 190,
   191, 192, 193, 193, 194, 195, 196, 197, 198, 199, 200, 200, 201, 202, 203, 204,
   205, 205, 206, 207, 208, 209, 209, 210, 211, 212, 213, 213, 214, 215, 216, 216,
   217, 218, 219, 219, 220, 221, 221, 222, 223, 224, 224, 225, 226, 226, 227, 228,
   228, 229, 229, 230, 231, 231, 232, 232, 233, 234, 234, 235, 235, 236, 236, 237,
   237, 238, 238, 239, 239, 240, 240, 241, 241, 242, 242, 243, 243, 244, 244, 244,
   245, 245, 246, 246, 246, 247, 247, 247, 248, 248, 248, 249, 249, 249, 250, 250,
   250, 250, 251, 251, 251, 251, 252, 252, 252, 252, 252, 253, 253, 253, 253, 253,
   253, 254, 254, 254, 254, 254, 254, 254, 254, 254, 254, 254, 254, 254, 254, 254,
   255, 254, 254, 254, 254, 254, 254, 254, 254, 254, 254, 254, 254, 254, 254, 254,
   253, 253, 253, 253, 253, 253, 252, 252, 252, 252, 252, 251, 251, 251, 251, 250,
   250, 250, 250, 249, 249, 249, 248, 248, 248, 247, 247, 247, 246, 246, 246, 245,
   245, 244, 244, 244, 243, 243, 242, 242, 241, 241, 240, 240, 239, 239, 238, 238,
   237, 237, 236, 236, 235, 235, 234, 234, 233, 232, 232, 231, 231, 230, 229, 229,
   228, 228, 227, 226, 226, 225, 224, 224, 223, 222, 221, 221, 220, 219, 219, 218,
   217, 216, 216, 215, 214, 213, 213, 212, 211, 210, 209, 209, 208, 207, 206, 205,
   205, 204, 203, 202, 201, 200, 200, 199, 198, 197, 196, 195, 194, 193, 193, 192,
   191, 190, 189, 188, 187, 186, 185, 184, 183, 182, 182, 181, 180, 179, 178, 177,
   176, 175, 174, 173, 172, 171, 170, 169, 168, 167, 166, 165, 164, 163, 162, 161,
   160, 159, 158, 157, 156, 155, 154, 153, 152, 151, 150, 149, 148, 147, 146, 145,
   144, 143, 142, 141, 139, 138, 137, 136, 135, 134, 133, 132, 131, 130, 129, 128

};




/*
int pwmSin[]={
    63,  55,  47,  39,  32,  25,  18,  13,
     8,   4,   2,   0,   0,   0,   2,   4,
     8,  13,  18,  25,  32,  39,  47,  55,
    63,  72,  80,  88,  95, 102, 109, 114,
   119, 122, 125, 127, 127, 127, 125, 122,
   119, 114, 109, 102,  95,  88,  80,  72,
    63
};
*/

int increment;
//int flashIncrement = 0;
//int currentFlash=0;
//int currentStepA=0;
//int currentStepB=16;
//int currentStepC=32;

int currentStepA=OFFSET_0;
int currentStepB=OFFSET_1;
int currentStepC=OFFSET_2;

// the following variables are long's because the time, measured in miliseconds,
// will quickly become a bigger number than can be stored in an int.
//long lastDebounceTime = 0;  // the last time the output pin was toggled
long motorDelayActual = 0;  // the actual delay, based on pot value and motor delay set above
//long flashDelayActual = 0;
//long flashDelayPerCycle = 0;
long lastMotorDelayTime = 0;
//long flashTime = 0; // how long has flash been ON 
//long flashTimeOFF = 0; // how long has flash been OFF 
 
void setup() {
 
  TCCR1B = TCCR1B & 0b11111000 | 0x01; // set PWM frequency @ 31250 Hz for Pins 9 and 10
  TCCR2B = TCCR2B & 0b11111000 | 0x01; // set PWM frequency @ 31250 Hz for Pins 11 and 3 (3 not used)
//  ICR1 = 255 ; // 8 bit resolution
//  ICR1 = 1023 ; // 10 bit resolution
 
 
  //pinMode(buttonPin, INPUT);
  //pinMode(potPin, INPUT);
  //pinMode(potPinFlash, INPUT);
  //pinMode(ledPin, OUTPUT);
  pinMode(motorPin1, OUTPUT);
  pinMode(motorPin2, OUTPUT);
  pinMode(motorPin3, OUTPUT);
  //pinMode(flashPin, OUTPUT);
  //digitalWrite(flashPin, LOW);

  Serial.begin(115200);
}
 
void loop() {
  // read the state of the switch into a local variable:
  //int reading = digitalRead(buttonPin);
 
  // check to see if you just pressed the button 
  // (i.e. the input went from LOW to HIGH),  and you've waited 
  // long enough since the last press to ignore any noise:  
 
  // If the switch changed, due to noise or pressing:
  //if (reading != lastButtonState) {
    // reset the debouncing timer
    //lastDebounceTime = millis();
  //} 
   
  //if ((millis() - lastDebounceTime) > debounceDelay) {
    // whatever the reading is at, it's been there for longer
    // than the debounce delay, so take it as the actual current state:
    //buttonState = reading;
    //direct = !direct;
    //ledState = !ledState;
    //lastButtonState = reading;
  //}
   
  // set the LED using the state of the button:
  //digitalWrite(ledPin, ledState);
 
  // save the reading.  Next time through the loop,
  // it'll be the lastButtonState:
   
  //potStateFlash = analogRead(potPinFlash);
  //potState = analogRead(potPin);
  //motorDelayActual =   potState * motorDelay / 100; 
  motorDelayActual =   1 * motorDelay / 100; 
  // flashDelayActual =   flashDelay+potStateFlash/200; // if we were controlling it with a POT
  //flashDelayActual =   flashDelay;
  //movei();
  move_f();
 
   
}

#define SIGNAL_DELAY 2 // try 1, or 5 also

float currentStepAf = 0.0;
float currentStepBf = 1.0/3.0 * TABLE_SIZE;
float currentStepCf = 2.0/3.0 * TABLE_SIZE;
float incrementf;

void move_f() {
  
 static long xx=0;
 static long int debug=0;
 long int m;
 
 // change motor speed here
 float speedf = 0.1250;

 incrementf = speedf * (direct ? 1 : -1);

 // motion occurs at clock rate (continuous from pov of motor)
 currentStepAf = currentStepAf + incrementf;
 if (currentStepAf >= TABLE_SIZE) currentStepAf -= TABLE_SIZE;  // phasing around subtracts TABLE_SIZE to prevent aliasing at endpoints
 if (currentStepAf < 0) currentStepAf += TABLE_SIZE;

 // there is a simpler way since B and C are just a different phase of A
 // but this works for now..
 currentStepBf = currentStepBf + incrementf;
 if (currentStepBf >= TABLE_SIZE) currentStepBf -= TABLE_SIZE;
 if (currentStepBf < 0) currentStepBf += TABLE_SIZE;

 currentStepCf = currentStepCf + incrementf;
 if (currentStepCf >= TABLE_SIZE) currentStepCf -= TABLE_SIZE;
 if (currentStepCf < 0) currentStepCf += TABLE_SIZE;

 // wait prevents writing the output ports at the clock rate.
 // the SIGNAL_DELAY should be on the order of 1 ms
  m = millis();
  if( (m - lastMotorDelayTime) > SIGNAL_DELAY ) {
   lastMotorDelayTime = m;

   // write to pins
   analogWrite(motorPin1, pwmSin[ int(currentStepAf) ]);
   analogWrite(motorPin2, pwmSin[ int(currentStepBf) ]);
   analogWrite(motorPin3, pwmSin[ int(currentStepCf) ]);
 }


  if (debug>=1007) {
    Serial.print(increment);
    Serial.print(" ");
    Serial.print(currentStepAf);
    Serial.print(" ");
    Serial.print(currentStepBf);
    Serial.print(" ");
    Serial.print(currentStepCf);
    Serial.print(" ");
    
    Serial.print(pwmSin[int(currentStepAf)]);
    Serial.print(" ");
    Serial.print(pwmSin[int(currentStepBf)]);
    Serial.print(" ");
    Serial.print(pwmSin[int(currentStepCf)]);
    Serial.println(" ");
    debug=0;
  }
  debug++;

}
 
void movei() {
  static long xx=0;
  static long int debug=0;
  long int m;
  byte b, delb;
  
  m = millis();
  //if((millis() - flashTime) >  flashDelayActual) { digitalWrite(flashPin, HIGH); }
   
  if (xx > 16) {
    xx=0;
  //if((millis() - lastMotorDelayTime) >  motorDelayActual){
  //if((m - lastMotorDelayTime) >  1000){
    // delay time passed, move one step

    if (direct==true) { increment =  1; }
    else              { increment = -1; }

/*
    currentStepA = currentStepA + increment;
    if(currentStepA > 47) currentStepA = 0;
    if(currentStepA<0) currentStepA =47;

    currentStepB = currentStepB + increment;
    if(currentStepB > 47) currentStepB = 0;
    if(currentStepB<0) currentStepB =47;

    currentStepC = currentStepC + increment;
    if(currentStepC > 47) currentStepC = 0;
    if(currentStepC<0) currentStepC =47;
*/

    currentStepA = currentStepA + increment;
    if(currentStepA > (TABLE_SIZE-1)) currentStepA = 0;
    if(currentStepA<0) currentStepA =TABLE_SIZE-1;

    currentStepB = currentStepB + increment;
    if(currentStepB > (TABLE_SIZE-1)) currentStepB = 0;
    if(currentStepB<0) currentStepB =TABLE_SIZE-1;

    currentStepC = currentStepC + increment;
    if(currentStepC > (TABLE_SIZE-1)) currentStepC = 0;
    if(currentStepC<0) currentStepC = (TABLE_SIZE-1);

    //lastMotorDelayTime = millis();
    lastMotorDelayTime = m;

    //flashDelayPerCycle = flashDelayPerCycle + flashDelayPerCycle;
    //currentFlash = currentFlash + 1;

    //if(currentFlash>24)  { 
 
      //digitalWrite(flashPin, LOW);
      //currentFlash=0;
      //flashTime = millis();
      //flashDelayActual = millis();

    //}

  }
  xx++;
     
  //analogWrite(motorPin1, pwmSin[currentStepA]);
  //analogWrite(motorPin2, pwmSin[currentStepB]);
  //analogWrite(motorPin3, pwmSin[currentStepC]);

  delb=0;
  b = pwmSin[currentStepA];
  if (b>delb) { b-=delb; }
  analogWrite(motorPin1, b);
  
  b = pwmSin[currentStepB];
  if (b>delb) { b-=delb; }
  analogWrite(motorPin2, b);
  
  b = pwmSin[currentStepC];
  if (b>delb) { b-=delb; }
  analogWrite(motorPin3, b);
  

  if (debug>=1007) {
    Serial.print(increment);
    Serial.print(" ");
    Serial.print(currentStepA);
    Serial.print(" ");
    Serial.print(currentStepB);
    Serial.print(" ");
    Serial.print(currentStepC);
    Serial.print(" ");
    
    Serial.print(pwmSin[currentStepA]);
    Serial.print(" ");
    Serial.print(pwmSin[currentStepB]);
    Serial.print(" ");
    Serial.print(pwmSin[currentStepC]);
    Serial.print(" ");
    Serial.print(m);
    Serial.print(" ");
    Serial.print(lastMotorDelayTime);
    Serial.println(" ");
    debug=0;
  }
  debug++;

   
}
