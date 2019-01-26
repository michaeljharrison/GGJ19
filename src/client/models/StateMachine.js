const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  WARNING: 'warning',
  INFO: 'info',
  ERROR: 'error',
};

export const STATE_MACHINE = {
  init: 'sailing',
  transitions: [
    { name: 'startScenario1', from: 'sailing', to: 'scenario1' },
    { name: 'endScenario1', from: 'scenario1', to: 'sailing' },
    { name: 'startScenario2', from: 'sailing', to: 'scenario2' },
    { name: 'endScenario2', from: 'scenario2', to: 'sailing' },
    { name: 'startScenario3', from: 'sailing', to: 'scenario3' },
    { name: 'endScenario3', from: 'scenario3', to: 'sailing' },
    { name: 'startScenario4', from: 'sailing', to: 'scenario4' },
    { name: 'endScenario4', from: 'scenario4', to: 'sailing' },
  ],
  methods: {
    onEndScenario1() {},
    onStartScenario2() {},
    onEndScenario2() {},
    onStartScenario3() {},
    onEndScenario3() {},
  },
};
