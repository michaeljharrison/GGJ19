const handleScenario1Input = (stateMachine: any, params: Object, input: string, openNotificationWithIcon: any) => {
  console.log('Handling input for Scenario 1: ', stateMachine.state, params, input);
  switch (stateMachine.state) {
    case 'S1C1':
      if (input.toLowerCase().match('wolf')) {
        stateMachine.toS1C1F();
        params.scenario += 1;
      } else if (input.toLowerCase().match('chicken')) {
        stateMachine.toS1C1P();
        params.scenario += 1;
      } else if (input.toLowerCase().match('corn')) {
        stateMachine.toS1C1F();
        params.scenario += 1;
      } else {
        return { status: 'confuse', message: 'Yarrrr? Chicken, Wolf or Corn!?', title: 'Confused!' };
      }
      break;
    default:
      return { status: 'confuse', message: 'Lolwut (this should enver happen)?' };
  }
  return { status: 'success', message: "Order understood Cap'n!" };
};

const handleScenario2Input = (stateMachine: any, params: Object, input: string) => {
  console.log('Handling input for Scenario 2: ', stateMachine.state, params, input);
  switch (stateMachine.state) {
    case 'S2C1':
      stateMachine.toS2C2();
      return { status: 'success', message: 'You greet the girl.', title: 'Obviously.' };
    case 'S2C2':
      if (
        input.toLowerCase().match('yaas')
        || input.toLowerCase().match('af')
        || input.toLowerCase().match('mood')
        || input.toLowerCase().match('lit')
        || input.toLowerCase().match('lol')
        || input.toLowerCase().match('yolo')
        || input.toLowerCase().match('yeet')
      ) {
        stateMachine.toS2C2P();
        params.scenario += 1;
        params.currentRetries = 0;
        return { status: 'success', message: 'She understand your disgusting slang.', title: 'Yukky.' };
      }
      // Failure, check retries
      params.currentRetries += 1;
      if (params.currentRetries > 2) {
        params.currentRetries = 0;
        stateMachine.toS2C2F();
        params.scenario += 1;
        return { status: 'failure', message: "She doesn't seem to understand english.", title: '#Millenials.' };
      }
      stateMachine.toS2C2Retry();
      return { status: 'failure', message: "She doesn't seem to understand english.", title: '#Millenials.' };


    default:
      return { status: 'confuse', message: 'Lolwut (this should enver happen)?' };
  }
};

const handleScenario4Input = (stateMachine: any, params: Object, input: string) => {
  console.log('Handling input for Scenario 3: ', stateMachine, params, input);
  stateMachine.endScenario3();
  return { status: 'success', message: 'Yarr did it!', title: 'Success' };
};

const handleScenario3Input = (stateMachine: any, params: Object, input: string) => {
  switch (stateMachine.state) {
    case 'SE':
      if ((input.toLowerCase().match('friend') || input.toLowerCase().match('crew'))) {
        stateMachine.toSEC1();
        return { status: 'success', message: 'You eat your friends.' };
      }
      stateMachine.toSEC2();
      return { status: 'confuse', message: 'You should eat your friends.' };
    case 'SEC1':
      if (input.toLowerCase().match('corn')) {
        stateMachine.toSEC11();
        return { status: 'success', message: 'You eat the Corn Man.' };
      } if (input.toLowerCase().match('millenial')) {
        stateMachine.toSEC12();
        return { status: 'success', message: 'You eat the Millenial' };
      } if (input.toLowerCase().match('infected')) {
        stateMachine.toSEC13();
        return { status: 'success', message: 'You eat the gross noob.' };
      }
      return { status: 'confuse', message: 'Who do you eat? (Corn, Millenial, Infected)' };
    case 'SEC2':
      if (input.toLowerCase().match('eat') && (input.toLowerCase().match('friend') || input.toLowerCase().match('crew'))) {
        stateMachine.toSEC1();
        return { status: 'success', message: 'Good move.' };
      }
      stateMachine.toFail();
      return { status: 'error', message: 'Bad Move.' };

    default:
      return { status: 'confuse', message: 'Lolwut (this should enver happen)?' };
  }
};

export const parseInput = (stateMachine: string, params: Object, input: string, openNotificationWithIcon: any) => {
  if (stateMachine.state === 'sailing') {
    return { status: 'success', message: "Wait for something to happen, cap'n!", title: 'Wait!' };
  }
  switch (params.scenario) {
    case 1:
      return handleScenario1Input(stateMachine, params, input, (openNotificationWithIcon: any));
    case 2:
      return handleScenario2Input(stateMachine, params, input, (openNotificationWithIcon: any));
    case 3:
      return handleScenario3Input(stateMachine, params, input, (openNotificationWithIcon: any));
    case 4:
      return handleScenario4Input(stateMachine, params, input, (openNotificationWithIcon: any));
    default:
      console.log('wtf');
      break;
  }
};
