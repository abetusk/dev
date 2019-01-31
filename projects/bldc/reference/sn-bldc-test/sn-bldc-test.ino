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

int pwmSin[]={
   127, 111,  94,  78,  64,  50,  37,  26,
    17,   9,   4,   1,   0,   1,   4,   9,
    17,  26,  37,  50,  64,  78,  94, 111,
   127, 144, 160, 176, 191, 205, 218, 229,
   238, 245, 251, 254, 255, 254, 251, 245,
   238, 229, 218, 205, 191, 176, 160, 144,
   127
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
int currentStepA=0;
int currentStepB=16;
int currentStepC=32;

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
  ICR1 = 1023 ; // 10 bit resolution
 
 
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
  move();
 
   
}
 
 
void move() {
  static long xx=0;
  static long int debug=0;
  long int m;
  
  
  m = millis();
  //if((millis() - flashTime) >  flashDelayActual) { digitalWrite(flashPin, HIGH); }
   
  //if (xx > 1024) {
  //  xx=0;
  //if((millis() - lastMotorDelayTime) >  motorDelayActual){
  if((m - lastMotorDelayTime) >  1000){
    // delay time passed, move one step

    if (direct==true) { increment =  1; }
    else              { increment = -1; }

    currentStepA = currentStepA + increment;
    if(currentStepA > 47) currentStepA = 0;
    if(currentStepA<0) currentStepA =47;

    currentStepB = currentStepB + increment;
    if(currentStepB > 47) currentStepB = 0;
    if(currentStepB<0) currentStepB =47;

    currentStepC = currentStepC + increment;
    if(currentStepC > 47) currentStepC = 0;
    if(currentStepC<0) currentStepC =47;

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
     
  analogWrite(motorPin1, pwmSin[currentStepA]);
  analogWrite(motorPin2, pwmSin[currentStepB]);
  analogWrite(motorPin3, pwmSin[currentStepC]);
  

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
