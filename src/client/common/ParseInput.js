export const parseInput = (stateMachine: string, params: Object) => {
  if (checkScenarioTime(params)) {
    params.scenarioNumber++;
    switch (params.scenarioNumber) {
      case 0:
      default:
        break;
    }
  } else {
    console.log('Not Scenario time, keep sailing.');
  }
};

const isScenarioTime = (params: Object) => {
  const { timeElapsed } = params;
  if (timeElapsed > 10000) {
    return true;
  }
};
