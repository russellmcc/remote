// -----------------------------------
// Controlling LEDs over the Internet
// -----------------------------------

const uint16_t timer_period = 1895; //38khz
const float duty_cycle = 0.5;

#undef min
#undef max
using namespace std;
#include <map>
#include <vector>
#include <string>
#include <algorithm>

static const initializer_list<int> channel_up = {
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

static const initializer_list<int> tv_power = {
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

static const initializer_list<int> channel_down = {
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

static const initializer_list<int> source = {
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

static const initializer_list<int> source_up = {
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

static const initializer_list<int> source_down = {
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

static const initializer_list<int> xbox_audio = {
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

static const initializer_list<int> turntable_audio = {
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

static const initializer_list<int> appletv_audio = {
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

static const initializer_list<int> tv_audio = {
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

static const initializer_list<int> volume_up = {
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

static const initializer_list<int> volume_down = {
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

static const initializer_list<int> appletv_menu = {
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

struct MessageInfo {
	String name;
	initializer_list<int> message;
};

static const MessageInfo irMessages[] = {
	{"channel_up", channel_up},
	{"tv_power", tv_power},
	{"channel_down", channel_down},
    {"source", source},
    {"source_up", source_up},
    {"source_down", source_down},
    {"xbox_audio", xbox_audio},
    {"turntable_audio", turntable_audio},
    {"appletv_audio", appletv_audio},
    {"tv_audio", tv_audio},
    {"volume_up", volume_up},
    {"volume_down", volume_down},
    {"appletv_menu", appletv_menu},
};

// This routine runs only once upon reset
void setup()
{
  //Register our Spark function here
  Spark.function("ir", irControl);

  // AFIO clock enable
  RCC_APB2PeriphClockCmd(RCC_APB2Periph_AFIO, ENABLE);

  pinMode(A1, AF_OUTPUT_PUSHPULL);

  // TIM clock enable
  RCC_APB1PeriphClockCmd(RCC_APB1Periph_TIM2, ENABLE);

  // setting up TIM2 values
  {
    TIM_TimeBaseInitTypeDef timebase;
    TIM_TimeBaseStructInit(&timebase);
    timebase.TIM_Period = timer_period;
    timebase.TIM_Prescaler = 0;
    timebase.TIM_ClockDivision = 0;
    timebase.TIM_CounterMode = TIM_CounterMode_Up;

    TIM_TimeBaseInit(TIM2, &timebase);
  }

  {
    TIM_OCInitTypeDef  compare;
    TIM_OCStructInit(&compare);
    compare.TIM_OCMode = TIM_OCMode_PWM1;
    compare.TIM_OutputState = TIM_OutputState_Enable;
    compare.TIM_OCPolarity = TIM_OCPolarity_High;
    compare.TIM_Pulse = timer_period * duty_cycle;

    // PWM1 Mode configuration: Channel2
    TIM_OC2Init(TIM2, &compare);
  }

	// TIM enable counter
  SetFlashingIR(0);
}

void SetFlashingIR(bool value) {
  if (value) {
    TIM_SetCounter(TIM2, 0);
    TIM_Cmd(TIM2, ENABLE);
  } else {
    TIM_Cmd(TIM2, DISABLE);
    TIM_SetCounter(TIM2, timer_period - 1);
  }
}

void delayABunchOfMicros(uint32_t micros) {
  float micro_secs = micros;
  while (micro_secs> 1000000) {
    delay(1000);
    micro_secs -= 1000000;
  }
  delayMicroseconds(micro_secs);
}

static const int numMessages = sizeof(irMessages) / sizeof(decltype(irMessages[0]));

bool sendCode(String command) {
	auto messagePointer = std::find_if(irMessages, irMessages + numMessages,
		[&](const MessageInfo& info) {
			return info.name == command;
		});

	if (messagePointer == irMessages + numMessages) {
			return false;
	}

  __disable_irq();  // this turns off any background interrupts

	auto& message = messagePointer->message;
  for (int i = 0; i < message.size(); i += 2) {
    SetFlashingIR(true);
    delayABunchOfMicros(*(message.begin() + i)*10*1.02);
    SetFlashingIR(false);
    delayABunchOfMicros(*(message.begin() +i + 1)*10*1.02);
  }

  __enable_irq();  // this turns them back on
	return true;
}

// This routine loops forever
void loop()
{
   // Nothing to do here
}

int irControl(String command)
{
  return sendCode(command) ? 1 : 0;
}
