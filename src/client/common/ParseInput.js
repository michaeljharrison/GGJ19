const isScenarioTime = (params: Object) => {
  const { timeElapsed } = params;
  if (timeElapsed > 10000) {
    return true;
  }
};

export const parseInput = (stateMachine: string, params: Object) => {
  if (isScenarioTime(params)) {
    params.scenarioNumber += 1;
    switch (params.scenarioNumber) {
      case 0:
      default:
        break;
    }
  } else {
    console.log('Not Scenario time, keep sailing.');
  }
};
