const handleScenario1Input = (stateMachine: any, params: Object, input: string, openNotificationWithIcon: any) => {
  console.log('Handling input for Scenario 1: ', stateMachine.state, params, input);
  switch (stateMachine.state) {
    case 's1C1':
      if (input.toLowerCase().match('wolf')) {
        stateMachine.s1C1F();
      } else if (input.toLowerCase().match('chicken')) {
        stateMachine.s1C1P();
      } else if (input.toLowerCase().match('corn')) {
        stateMachine.s1C1F();
      } else {
        return { status: 'confuse', message: 'yarrrr?' };
      }
      break;
    default:
      return { status: 'confuse', message: 'Lolwut (this should enver happen)?' };
  }
  stateMachine.endScenario1((openNotificationWithIcon: any));
  return { status: 'success', message: 'Yarr!' };
};
const handleScenario2Input = (stateMachine: any, params: Object, input: string) => {
  console.log('Handling input for Scenario 2: ', stateMachine, params, input);
  stateMachine.endScenario2();
  return { status: 'success', message: 'Yarr!' };
};
const handleScenario3Input = (stateMachine: any, params: Object, input: string) => {
  console.log('Handling input for Scenario 3: ', stateMachine, params, input);
  stateMachine.endScenario3();
  return { status: 'success', message: 'Yarr!' };
};
const handleScenario4Input = (stateMachine: any, params: Object, input: string) => {
  console.log('Handling input for Scenario 4: ', stateMachine, params, input);
  stateMachine.endScenario4();
  return { status: 'success', message: 'Yarr!' };
};

export const parseInput = (stateMachine: string, params: Object, input: string, openNotificationWithIcon: any) => {
  if (stateMachine.state === 'sailing') {
    return { status: 'success', message: "Wait for something to happen, cap'n" };
  }
  switch (params.scenario) {
    case 0:
      return handleScenario1Input(stateMachine, params, input, (openNotificationWithIcon: any));
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
