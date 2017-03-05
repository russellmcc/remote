/* Raw IR decoder sketch!
This sketch/program uses the Arduno and a PNA4602 to
decode IR received. This can be used to make a IR receiver
(by looking for a particular code)
or transmitter (by pulsing an IR LED at ~38KHz for the
durations detected
Code is public domain, check out www.ladyada.net and adafruit.com
for more tutorials!
*/
//#include <StandardCplusplus.h>
//#include <serstream>
//#include <map>
//#include <vector>
//#include <string>
//#include <algorithm>

using namespace std;
#include <avr/pgmspace.h>

static const int channel_up[] PROGMEM = {
	876, 430,
	58, 52,
	58, 158,
	58, 50,
	58, 52,
	54, 52,
	58, 52,
	58, 52,
	56, 50,
	58, 160,
	56, 54,
	56, 160,
	56, 162,
	58, 158,
	58, 160,
	56, 160,
	58, 52,
	56, 160,
	58, 158,
	58, 162,
	56, 160,
	58, 52,
	54, 54,
	56, 52,
	58, 50,
	56, 52,
	58, 50,
	58, 52,
	56, 50,
	58, 162,
	54, 162,
	58, 158,
	58, 162,
	54, 3968,
	874, 214,
	58, 2744,
	876, 214,
	58, 0 };

static const int tv_power[] PROGMEM = {
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

static const int channel_down[] PROGMEM = {
874, 432,
58, 50,
58, 158,
60, 50,
58, 52,
56, 52,
56, 52,
58, 50,
56, 54,
54, 162,
56, 54,
54, 162,
56, 160,
58, 158,
58, 162,
54, 162,
58, 50,
56, 54,
54, 162,
56, 54,
54, 162,
56, 160,
58, 52,
54, 162,
58, 50,
56, 162,
56, 52,
56, 160,
58, 52,
56, 52,
56, 162,
54, 54,
56, 162,
54, 3968,
876, 214,
58, 2744,
876, 214,
58, 0};

static const int source[] PROGMEM = {
	876, 430,
	60, 52,
	56, 162,
	54, 52,
	58, 52,
	54, 54,
	56, 52,
	56, 52,
	56, 54,
	56, 160,
	56, 54,
	56, 160,
	56, 160,
	58, 160,
	58, 160,
	56, 160,
	58, 52,
	56, 160,
	58, 162,
	54, 52,
	58, 162,
	54, 52,
	58, 52,
	54, 162,
	56, 52,
	56, 54,
	56, 50,
	60, 160,
	56, 50,
	58, 162,
	54, 162,
	54, 56,
	54, 162,
	56, 3970,
	876, 214,
	58, 2748,
	876, 214,
	58, 2750,
	874, 216,
	58, 0};

static const int source_up[] PROGMEM = {
	876, 432,
	58, 50,
	60, 160,
	56, 50,
	58, 52,
	54, 56,
	54, 52,
	58, 52,
	56, 52,
	56, 162,
	54, 54,
	56, 164,
	52, 162,
	58, 158,
	58, 160,
	56, 162,
	58, 50,
	56, 54,
	56, 50,
	58, 52,
	56, 160,
	58, 52,
	56, 54,
	54, 162,
	54, 56,
	54, 162,
	56, 160,
	58, 158,
	58, 52,
	58, 160,
	56, 162,
	56, 54,
	54, 162,
	54, 3972,
	876, 214,
	58, 2750,
	876, 214,
	58, 0};

static const int source_down[] PROGMEM = {
	874, 432,
	58, 52,
	58, 158,
	58, 52,
	58, 50,
	56, 54,
	54, 56,
	54, 52,
	56, 54,
	54, 162,
	56, 54,
	54, 162,
	56, 160,
	58, 158,
	58, 162,
	56, 160,
	58, 52,
	56, 160,
	58, 52,
	56, 160,
	58, 158,
	60, 50,
	58, 52,
	54, 162,
	58, 52,
	56, 54,
	54, 162,
	54, 54,
	56, 52,
	58, 160,
	56, 162,
	54, 54,
	56, 162,
	54, 3972,
	876, 214,
	58, 2752,
	876, 214,
	58, 0};

static const int xbox_audio[] PROGMEM = {
		868, 454,
		58, 54,
		58, 164,
		64, 48,
		58, 164,
		58, 166,
		58, 166,
		58, 164,
		58, 54,
		58, 164,
		58, 56,
		56, 164,
		58, 52,
		60, 52,
		58, 52,
		58, 52,
		60, 164,
		60, 164,
		58, 52,
		58, 56,
		56, 52,
		58, 52,
		58, 52,
		60, 164,
		58, 166,
		58, 52,
		58, 166,
		58, 164,
		60, 164,
		58, 166,
		58, 164,
		58, 54,
		58, 52,
		56, 3930,
		868, 214,
		58, 2896,
		868, 214,
		60, 2894,
		868, 216,
		58, 0};

static const int turntable_audio[] PROGMEM = {
		866, 456,
	58, 54,
	56, 166,
	58, 52,
	58, 166,
	58, 166,
	56, 166,
	58, 166,
	58, 52,
	58, 166,
	58, 52,
	60, 164,
	58, 52,
	58, 52,
	60, 52,
	58, 52,
	58, 166,
	58, 52,
	58, 54,
	58, 164,
	58, 54,
	58, 164,
	58, 52,
	58, 166,
	58, 54,
	58, 164,
	58, 166,
	56, 54,
	58, 164,
	60, 52,
	58, 164,
	58, 54,
	58, 164,
	58, 3930,
	868, 214,
	58, 2896,
	868, 214,
	60, 2894,
	868, 214,
	60, 0};

static const int appletv_audio[] PROGMEM = {
	868, 454,
	58, 54,
	58, 164,
	58, 54,
	58, 164,
	58, 166,
	58, 166,
	58, 164,
	58, 54,
	58, 164,
	58, 52,
	60, 164,
	58, 52,
	58, 54,
	58, 52,
	58, 54,
	56, 166,
	58, 164,
	60, 52,
	58, 52,
	58, 166,
	58, 52,
	58, 54,
	58, 166,
	56, 166,
	58, 52,
	60, 164,
	58, 166,
	56, 56,
	56, 166,
	58, 164,
	58, 52,
	60, 52,
	58, 3928,
	868, 214,
	60, 2894,
	868, 216,
	58, 2894,
	870, 214,
	58, 0};

static const int tv_audio[] PROGMEM = {
	868, 454,
	64, 48,
	58, 164,
	58, 54,
	58, 166,
	58, 164,
	58, 166,
	58, 164,
	58, 54,
	58, 164,
	58, 54,
	58, 164,
	58, 52,
	60, 52,
	58, 52,
	58, 54,
	58, 166,
	58, 164,
	58, 52,
	58, 166,
	58, 52,
	58, 166,
	56, 54,
	58, 56,
	54, 56,
	56, 52,
	58, 166,
	58, 52,
	58, 166,
	56, 54,
	58, 166,
	58, 164,
	60, 164,
	58, 3928,
	870, 214,
	56, 2898,
	866, 216,
	58, 0};

static const int volume_up[] PROGMEM = {
	868, 454,
	58, 52,
	58, 166,
	58, 52,
	58, 166,
	58, 164,
	60, 164,
	58, 164,
	60, 52,
	58, 164,
	60, 52,
	58, 166,
	56, 54,
	58, 52,
	58, 52,
	60, 52,
	58, 164,
	60, 52,
	58, 166,
	56, 54,
	58, 166,
	58, 164,
	58, 52,
	60, 54,
	56, 52,
	58, 166,
	58, 52,
	58, 166,
	58, 52,
	58, 54,
	58, 164,
	58, 166,
	58, 164,
	58, 3930,
	868, 214,
	58, 2896,
	868, 214,
	60, 0};

static const int volume_down[] PROGMEM = {
		868, 456,
	58, 52,
	58, 166,
	56, 54,
	58, 166,
	58, 164,
	58, 166,
	58, 164,
	58, 54,
	58, 164,
	60, 54,
	56, 164,
	58, 54,
	58, 52,
	58, 52,
	58, 54,
	58, 166,
	58, 164,
	60, 164,
	58, 52,
	58, 166,
	58, 164,
	58, 54,
	58, 52,
	58, 52,
	58, 54,
	58, 52,
	58, 166,
	58, 52,
	58, 52,
	58, 166,
	58, 166,
	58, 164,
	58, 3928,
	870, 214,
	58, 2896,
	868, 214,
	58, 0};

static const int appletv_menu[] PROGMEM = {
	898, 434,
	56, 54,
	56, 162,
	56, 162,
	56, 164,
	56, 54,
	54, 164,
	56, 162,
	56, 162,
	56, 164,
	56, 162,
	56, 162,
	56, 54,
	56, 54,
	56, 56,
	54, 56,
	54, 164,
	56, 162,
	56, 162,
	56, 54,
	56, 54,
	56, 58,
	52, 54,
	56, 54,
	56, 54,
	58, 52,
	56, 54,
	56, 164,
	56, 162,
	56, 162,
	56, 164,
	54, 164,
	56, 56,
	56, 3764,
	892, 218,
	56, 0};

static const int source_select[] PROGMEM = {
	872, 432,
	58, 50,
	58, 162,
	54, 52,
	58, 50,
	56, 54,
	54, 52,
	58, 52,
	54, 54,
	56, 160,
	56, 54,
	54, 162,
	54, 162,
	56, 160,
	56, 162,
	54, 160,
	58, 52,
	56, 54,
	56, 160,
	56, 52,
	56, 160,
	56, 54,
	54, 52,
	56, 162,
	54, 52,
	58, 160,
	56, 52,
	58, 160,
	56, 50,
	58, 160,
	56, 160,
	56, 54,
	56, 160,
	56, 3960,
	872, 214,
	58, 2724,
	874, 214,
	58, 0};

template <typename T, unsigned int N>
constexpr unsigned int countof(T const (&)[N]) noexcept
{
return N;
}

struct MessageInfo {
	String name;
        unsigned int length;
	const int* message;
};

static const MessageInfo irMessages[] = {
	{"channel_up", countof(channel_up), channel_up},
	{"tv_power", countof(channel_up), tv_power},
	{"channel_down", countof(channel_up), channel_down},
    {"source", countof(channel_up), source},
    {"source_up", countof(channel_up), source_up},
    {"source_down", countof(channel_up), source_down},
    {"xbox_audio", countof(channel_up), xbox_audio},
    {"turntable_audio", countof(channel_up), turntable_audio},
    {"appletv_audio", countof(channel_up), appletv_audio},
    {"tv_audio", countof(channel_up), tv_audio},
    {"volume_up", countof(channel_up), volume_up},
    {"volume_down", countof(channel_up), volume_down},
    {"appletv_menu", countof(channel_up), appletv_menu},
		{"source_select", countof(channel_up), source_select}
};

static const String sources[] = {
	"tv",
	"nothing",
	"nothing",
	"xbox",
	"appletv",
	"nothing",
	"nothing",
	"nothing"
};

static const int sources_length = countof(sources);

auto currentSource = 0;
String wantedSource = "tv";
bool currentPowerState = false;

bool sendCode(const String&);

void setSource(const String& key) {
	wantedSource = key;

	int goalSource = -1; //std::find(sources.begin(), sources.end(), key) - sources.begin();
        for (int i=0; i<sources_length; i++) {
           if (sources[i] == wantedSource) goalSource = i; 
        }

	if (!currentPowerState)
		return;

	if (goalSource == -1) //sources.size())
		return;

	if (goalSource == currentSource)
		return;

	delay(1000);
	sendCode("source");
	delay(1000);

	while (currentSource < goalSource) {
		currentSource++;
		sendCode("source_down");
		delay(1000);
	}

	while (currentSource > goalSource) {
		currentSource--;
		sendCode("source_up");
		delay(1000);
	}

	delay(1000);

	sendCode("source_select");

	delay(250);
}

void setTVPowerState(bool state) {
	if (currentPowerState == state)
		return;

	delay(1000);
	sendCode("tv_power");
	currentPowerState = state;

	// warm-up time
	if (state) {
		delay(60000);
		setSource(wantedSource);
	}

	delay(250);
}
 
int IRledPin =  13;    // LED connected to digital pin 13
 
// The setup() method runs once, when the sketch starts
 
void setup()   {                
  // initialize the IR digital pin as an output:
  pinMode(IRledPin, OUTPUT);      
 
 
  delay(1000);
  
  
  
  //irControl("appletv");
  
   Serial.begin(9600);
  
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

static const int numMessages = sizeof(irMessages) / sizeof(decltype(irMessages[0]));

bool sendCode(const String& command) {
  auto messagePointer = irMessages + numMessages;
	/*auto messagePointer = std::find_if(irMessages, irMessages + numMessages,
		[&](const MessageInfo& info) {
			return info.name == command;
		});*/
 for (int i=0; i<numMessages; i++) {
  if (command == irMessages[i].name) messagePointer = irMessages + i; 
 }

	if (messagePointer == irMessages + numMessages) {
			return false;
	}

  cli();  // this turns off any background interrupts

	auto& message = messagePointer->message;
  for (int i = 0; i < messagePointer->length; i += 2) {
    
    pulseIR(*(message + i)*10*1.02);
     
     float micro_secs = *(message + i+1)*9.5*1.06;
     while (micro_secs> 1000000) {
       sei();
       delay(1000);
       cli();
       micro_secs -= 1000000;
     }
     delayMicroseconds(micro_secs);
  }

  sei();  // this turns them back on
  
  Serial.println("Code Sent - " + command);
  return true;
}

// This routine loops forever
void loop()
{
   // look for serial commands
   if (Serial.available() > 0)
   {
    String data = Serial.readString();
    Serial.println(data);
    irControl(data); 
   }
}

int irControl(String command)
{
	return sendCode(command) ? 1 : 0;
}
