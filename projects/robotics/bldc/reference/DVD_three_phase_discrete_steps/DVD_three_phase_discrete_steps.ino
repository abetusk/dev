/* 
Driving a three-phase motor from a DVD drive spindle for the stroboscope project
 
This example code is in the public domain. Based on several Arduino code samples
 
http://elabz.com/
 
 */

// constants won't change. They're used here to 
// set pin numbers:
const int buttonPin = 8;// the number of the direction pushbutton pin
const int ledPin =  7;  // the number of the status LED pin (not the flash LED)
const int potPin = 0;  // pot controls the RPM speed
const int potPinFlash = 1;  // pot controls the flash speed
const int motorPin1 =9;
const int motorPin2 =10;
const int motorPin3 =11;
const int motorPins[]={9,10,11};

const int motorPinSteps[3][6]={
{1,1,1,0,0,0},
{1,0,0,0,1,1},
{0,0,1,1,1,0}};

// A different, more illustrative, way of writing the same values below:
//const int motorPinSteps[3][9]={
//{HIGH,HIGH,HIGH,HIGH,LOW,LOW,LOW,LOW,LOW},
//{HIGH,LOW,LOW,LOW,LOW,LOW,HIGH,HIGH,HIGH},
//{LOW,LOW,LOW,HIGH,HIGH,HIGH,HIGH,LOW,LOW}};


const int flashPin =12;
const int motorDelay=500; // together with pot controls the RPM
const int flashDelay=2; // controls duration of flash
const int frames=12; // has to be divisible by 3 in this version
const int serialDelay = 2000; //debug only
long serialLast =0; //debug only
// Variables will change:
boolean ledState = false; // the current state of the status LED output pin
int buttonState;    // the current reading from the direction input pin
int potState;       // the current reading from the RPM speed potentiometer
int potStateFlash; // the current reading from the flash rate potentiometer
int lastButtonState = LOW; 
int debounceDelay = 50;    // the debounce time; increase if the output flickers
boolean direct = true; // direction true=forward, false=backward

int increment;
int flashIncrement = 0;
int currentFlash=0;
int currentStepA=0;
// the following variables are long's because the time, measured in miliseconds,
// will quickly become a bigger number than can be stored in an int.
long lastDebounceTime = 0;  // the last time the output pin was toggled
long motorDelayActual = 0;  // the actual delay, based on pot value and motor delay set above
long flashDelayActual = 0;
long flashDelayPerCycle = 0;
long lastMotorDelayTime = 0;
long flashTime = 0; // how long has flash been ON 
long flashTimeOFF = 0; // how long has flash been OFF 

void setup() {

  pinMode(buttonPin, INPUT);
  pinMode(potPin, INPUT);
  pinMode(potPinFlash, INPUT);
  pinMode(ledPin, OUTPUT);
  pinMode(motorPin1, OUTPUT);
  pinMode(motorPin2, OUTPUT);
  pinMode(motorPin3, OUTPUT);
  pinMode(flashPin, OUTPUT);
  digitalWrite(flashPin, LOW);

  Serial.begin(115200);
}

void loop() {
  // read the state of the switch into a local variable:
  int reading = digitalRead(buttonPin);

  // check to see if you just pressed the button 
  // (i.e. the input went from LOW to HIGH),  and you've waited 
  // long enough since the last press to ignore any noise:  

  // If the switch changed, due to noise or pressing:
  if (reading != lastButtonState) {
    // reset the debouncing timer
    lastDebounceTime = millis();
  } 
  
  if ((millis() - lastDebounceTime) > debounceDelay) {
    // whatever the reading is at, it's been there for longer
    // than the debounce delay, so take it as the actual current state:
    buttonState = reading;
    direct = !direct;
    ledState = !ledState;
    lastButtonState = reading;
  }
  
  // set the LED using the state of the button:
  digitalWrite(ledPin, ledState);

  // save the reading.  Next time through the loop,
  // it'll be the lastButtonState:

 potStateFlash = analogRead(potPinFlash);
 potState = analogRead(potPin);

 potState=5;
motorDelayActual = potState * motorDelay / 100; 
flashDelayActual = flashDelay + potStateFlash/100; 

Serial.println(potState);

move();

  
}



void move()
{
if((millis() - flashTime) >  flashDelayActual)
{
  digitalWrite(flashPin, HIGH);
  
}
  
  
if((millis() - lastMotorDelayTime) >  motorDelayActual)
{ // delay time passed, move one step 


if (direct==true)
{
  increment = 1;
} else {
  increment = -1;  
} 
  
  lastMotorDelayTime = millis();
  currentFlash = currentFlash + 1;
if(currentFlash>8)
  { 

    digitalWrite(flashPin, LOW);
    currentFlash=0;
    flashTime = millis();
    flashDelayActual = millis();

  
  }
  currentStepA = currentStepA + increment;
  if(currentStepA > 5) currentStepA = 0;

for(int x=0;x<=2;x++) {
digitalWrite(motorPins[x],motorPinSteps[x][currentStepA]); 
}

}
  

  
}
