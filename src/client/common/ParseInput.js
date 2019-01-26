const handleScenario1Input = (stateMachine: any, params: Object, input: string, openNotificationWithIcon: any) => {
  console.log('Handling input for Scenario 1: ', stateMachine, params, input);
  stateMachine.endScenario1((openNotificationWithIcon: any));
  return true;
};
const handleScenario2Input = (stateMachine: any, params: Object, input: string) => {
  console.log('Handling input for Scenario 2: ', stateMachine, params, input);
  stateMachine.endScenario2();
  return true;
};
const handleScenario3Input = (stateMachine: any, params: Object, input: string) => {
  console.log('Handling input for Scenario 3: ', stateMachine, params, input);
  stateMachine.endScenario3();
  return true;
};
const handleScenario4Input = (stateMachine: any, params: Object, input: string) => {
  console.log('Handling input for Scenario 4: ', stateMachine, params, input);
  stateMachine.endScenario4();
  return true;
};

export const parseInput = (stateMachine: string, params: Object, input: string, openNotificationWithIcon: any) => {
  if (stateMachine.state === 'sailing') {
    console.log('Sailing, do passive responses!');
  } else {
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
  }
};
