import { notification } from 'antd';

const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  WARNING: 'warning',
  INFO: 'info',
  ERROR: 'error',
};

const openNotificationWithIcon = (type, message) => {
  notification[type]({
    message: 'Yarrr!',
    description: message,
    duration: 8,
    style: {
      left: -Math.floor(Math.random() * 500 + 250),
      top: Math.floor(Math.random() * 500 + 250),
    },
  });
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
    onStartScenario1() {
      openNotificationWithIcon(NOTIFICATION_TYPES.WARNING, 'Scenario 1 starting text here!');
    },
    onEndScenario1() {},
  },
};
