const handleScenario0Input = (stateMachine: any, params: Object, input: string, openNotificationWithIcon: any) => {
  console.log('Handling input for Scenario 0: ', stateMachine.state, params, input);
  switch (stateMachine.state) {
    case 'start':
      if (input.toLowerCase().match('yes')) {
        stateMachine.toStart1();
        params.scenario += 1;
        return { status: 'success', title: 'Understood', message: 'Your First Order.' };
      }
      if (input.toLowerCase().match('no')) {
        stateMachine.toStart1();
        params.scenario += 1;
        return { status: 'success', title: 'Understood.' };
      }
      return { status: 'confuse', title: 'Huh?', message: 'CRACKERS wants a yes or no.' };
    default:
      return { status: 'confuse', message: 'Lolwut (this should enver happen)?' };
  }
};

const handleScenario1Input = (stateMachine: any, params: Object, input: string, openNotificationWithIcon: any) => {
  console.log('Handling input for Scenario 1: ', stateMachine.state, params, input);
  switch (stateMachine.state) {
    case 'S1C1':
      if (input.toLowerCase().match('wolf')) {
        stateMachine.toS1C1F();
        params.scenario += 1;
        return { status: 'success', message: 'You grab the Wolf.', title: 'Dinner!' };
      }
      if (input.toLowerCase().match('chicken')) {
        stateMachine.toS1C1P();
        params.scenario += 1;
        params.hasCorn = true;
        return { status: 'success', message: 'You grab the Chicken.', title: 'Cluck!' };
      }
      if (input.toLowerCase().match('corn')) {
        stateMachine.toS1C1F();
        params.scenario += 1;
        return { status: 'success', message: 'You grab the corn.', title: 'Dinner!' };
      }
      return { status: 'confuse', message: 'Yarrrr? Chicken, Wolf or Corn!?', title: 'Confused!' };

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
        || input.toLowerCase().match('fam')
      ) {
        stateMachine.toS2C2P();
        params.scenario += 1;
        params.currentRetries = 0;
        params.hasMerry = true;
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

const handleScenario3Input = (stateMachine: any, params: Object, input: string) => {
  switch (stateMachine.state) {
    case 'SE':
      if (input.toLowerCase().match('friend') || input.toLowerCase().match('crew')) {
        stateMachine.toSEC1();
        return { status: 'success', message: 'You eat your friends.' };
      }
      return { status: 'confuse', message: 'You should eat your friends.' };
    case 'SEC1':
      if (input.toLowerCase().match('corn') || input.toLowerCase().match('ignatius')) {
        stateMachine.toSEC11();
        return { status: 'success', message: 'You eat the Corn Man.', title: 'Monster' };
      }
      if (input.toLowerCase().match('millenial') || input.toLowerCase().match('meredith') || input.toLowerCase().match('merry')) {
        stateMachine.toSEC12();
        return { status: 'success', message: 'You eat the Millenial', title: 'Monster' };
      }
      if (input.toLowerCase().match('crackers')) {
        stateMachine.toSEC13();
        return { status: 'success', message: 'You ate Crackers, who does that?', title: 'Monster' };
      }
      return { status: 'confuse', message: 'Who do you eat? (Crackers, Meredith or Ignatius)' };
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

const handleScenario4Input = (stateMachine: any, params: Object, input: string) => {
  console.log('Handling input for Scenario 3: ', stateMachine, params, input);
  stateMachine.endScenario3();
  return { status: 'success', message: 'Yarr did it!', title: 'Success' };
};

export const parseInput = (stateMachine: string, params: Object, input: string, openNotificationWithIcon: any) => {
  if (stateMachine.state === 'sailing') {
    return { status: 'success', message: "Wait for something to happen, cap'n!", title: 'Wait!' };
  }
  switch (params.scenario) {
    case 0:
      return handleScenario0Input(stateMachine, params, input, (openNotificationWithIcon: any));
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
