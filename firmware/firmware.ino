// -----------------------------------
// Controlling LEDs over the Internet
// -----------------------------------

const uint16_t timer_period = 1895; //38khz
const float duty_cycle = 0.5;

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

void sendCode() {
  __disable_irq();  // this turns off any background interrupts

  for (int i = 0; i < sizeof(IRsignal) / sizeof(IRsignal[0]); i += 2) {
    SetFlashingIR(true);
    delayABunchOfMicros(IRsignal[i]*10*1.02);
    SetFlashingIR(false);
    delayABunchOfMicros(IRsignal[i + 1]*10*1.02);
  }

  __enable_irq();  // this turns them back on
}

// This routine loops forever
void loop()
{
   // Nothing to do here
}

int irControl(String command)
{
  sendCode();
  return 1;
}
