import { notification } from 'antd';

const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  WARNING: 'warning',
  INFO: 'info',
  ERROR: 'error',
};

const openNotificationWithIcon = (type, message) => {
  notification[type]({
    message: 'Captain!',
    description: message,
    placement: 'topRight',
    duration: 12,
    style: {
      //  left: -Math.floor(Math.random() * 500 + 250),
      //  top: Math.floor(Math.random() * 250 + 25),
    },
  });
};
export const STATE_MACHINE = {
  init: 'sailing',
  transitions: [
    { name: 'toS1C1', from: 'sailing', to: 's1C1' },
    { name: 'toS1C1P', from: 's1C1', to: 's1C1P' },
    { name: 'toS1C1F', from: 's1C1', to: 's1C1F' },
    { name: 'toS1C1F', from: 's1C1', to: 's1C1F' },
  ],
  methods: {
    onToS1C1() {
      console.log('S1C1');
      openNotificationWithIcon(
        NOTIFICATION_TYPES.WARNING,
        'You arrive on an island. There is a chicken, a wolf and a large corn cob. You reckon you can only grab one item at a time. What do you grab first',
      );
    },
    onToS1C1P() {
      openNotificationWithIcon(NOTIFICATION_TYPES.WARNING, 'You grab the chicken and put him on the boat');
      openNotificationWithIcon(
        NOTIFICATION_TYPES.WARNING,
        'Chicken flies off boat. Chickens can fly, who knew? Wolf gets distracted and runs away. Yo utake the corn. Wow! Corn is a man. How exciting.',
      );
    },
    onToS1C1F() {
      openNotificationWithIcon(NOTIFICATION_TYPES.WARNING, 'You didnt choose the chicken');
      openNotificationWithIcon(
        NOTIFICATION_TYPES.WARNING,
        'Chicken pecks at corn. You hear cries of agony, theres blood everwhere. You didnt notice Corn was a (Corn) Man. You monster! Wolf theb murders Chicken. Corn Man is dead.',
      );
    },
  },
};
