// -----------------------------------
// Controlling LEDs over the Internet
// -----------------------------------

const uint16_t timer_period = 1895; //38khz
const float duty_cycle = 0.5;

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
	TIM_Cmd(TIM2, DISABLE);
}

void SetFlashingIR(bool value) {
  TIM_Cmd(TIM2, value ? ENABLE : DISABLE);
}

// This routine loops forever
void loop()
{
   // Nothing to do here
}

int irControl(String command)
{
   SetFlashingIR(command == "on");
   return 1;
}
