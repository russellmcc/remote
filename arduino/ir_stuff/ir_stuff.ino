/* Raw IR decoder sketch!
This sketch/program uses the Arduno and a PNA4602 to
decode IR received. This can be used to make a IR receiver
(by looking for a particular code)
or transmitter (by pulsing an IR LED at ~38KHz for the
durations detected
Code is public domain, check out www.ladyada.net and adafruit.com
for more tutorials!
*/

int IRsignal[] = {

// ON, OFF (in 10's of microseconds)

	874, 432,

	58, 50,

	58, 158,

	58, 52,

	56, 54,

	54, 54,

	56, 50,

	58, 52,

	54, 54,

	56, 160,

	56, 54,

	56, 162,

	54, 160,

	58, 158,

	58, 162,

	54, 162,

	58, 50,

	56, 54,

	56, 160,

	56, 160,

	58, 52,

	56, 52,

	56, 52,

	56, 162,

	56, 50,

	58, 162,

	56, 50,

	58, 52,

	54, 162,

	56, 160,

	58, 160,

	56, 54,

	54, 164,

	52, 3966,

	874, 214,

	58, 2736,

	876, 214,

	58, 2738,

	874, 214,

	58, 2736,

	874, 214,

	58, 0};
 
int IRledPin =  13;    // LED connected to digital pin 13
 
// The setup() method runs once, when the sketch starts
 
void setup()   {                
  // initialize the IR digital pin as an output:
  pinMode(IRledPin, OUTPUT);      
 
 
  delay(1000);
  
  
  
  sendCode();
  
   Serial.begin(9600);
  
   Serial.println("Code Sent");
}
 
void loop()                     
{
}
 
// This procedure sends a 38KHz pulse to the IRledPin 
// for a certain # of microseconds. We'll use this whenever we need to send codes
void pulseIR(long microsecs) {
  // we'll count down from the number of microseconds we are told to wait
  while (microsecs > 0) {
    // 38 kHz is about 13 microseconds high and 13 microseconds low
   digitalWrite(IRledPin, HIGH);  // this takes about 3 microseconds to happen
   delayMicroseconds(8);         // hang out for 10 microseconds, you can also change this to 9 if its not working
   digitalWrite(IRledPin, LOW);   // this also takes about 3 microseconds
   delayMicroseconds(8);         // hang out for 10 microseconds, you can also change this to 9 if its not working
 
   // so 26 microseconds altogether
   microsecs -= 27;
  }
}
 

void sendCode() {
  cli();  // this turns off any background interrupts

  for (int i = 0; i < sizeof(IRsignal) / sizeof(IRsignal[0]); i += 2) {
     pulseIR(IRsignal[i]*10*1.02);
     
     float micro_secs = IRsignal[i+1]*9.5*1.06;
     while (micro_secs> 1000000) {
       sei();
       delay(1000);
       cli();
       micro_secs -= 1000000;
     }
     delayMicroseconds(micro_secs);
     
     
   }
   sei();  // this turns them back on
}
