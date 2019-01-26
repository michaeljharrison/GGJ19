import { notification } from 'antd';

const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  WARNING: 'warning',
  INFO: 'info',
  ERROR: 'error',
};

const openNotificationWithIcon2 = (type, message) => {
  notification.open({
    message: 'Captain!',
    description: message,
    placement: 'topLeft',
    duration: 0,
    style: {
      //  left: -Math.floor(Math.random() * 500 + 250),
      //  top: Math.floor(Math.random() * 250 + 25),
    },
  });
};
export const STATE_MACHINE = (openNotificationWithIcon: any) => {
  return {
    init: 'sailing',
    transitions: [
      // S1
      { name: 'toS1C1', from: 'sailing', to: 'S1C1' },
      { name: 'toS1C1P', from: 'S1C1', to: 'sailing' },
      { name: 'toS1C1F', from: 'S1C1', to: 'sailing' },
      // S4
      { name: 'toS2C1', from: 'sailing', to: 'S2C1' },
      { name: 'toS2C2', from: 'S2C1', to: 'S2C2' },
      { name: 'toS2C2Retry', from: 'S2C2', to: 'S2C2' },
      { name: 'toS2C2P', from: 'S2C2', to: 'sailing' },
      { name: 'toS2C2F', from: 'S2C2', to: 'sailing' },
    ],
    methods: {
      onToS1C1() {
        openNotificationWithIcon(
          NOTIFICATION_TYPES.WARNING,
          'You arrive on an island. There is a chicken, a wolf and a large corn cob. You reckon you can only grab one item at a time. What do you grab first'
          , 'Puzzling.'
          );
      },
      onToS1C1P() {
        openNotificationWithIcon(NOTIFICATION_TYPES.WARNING, 'You grab the chicken and put him on the boat');
        openNotificationWithIcon(
          NOTIFICATION_TYPES.WARNING,
          'Chicken flies off boat. Chickens can fly, who knew? Wolf gets distracted and runs away. Yo utake the corn. Wow! Corn is a man. How exciting.',
          'Exciting!'
          );
      },
      onToS1C1F() {
        openNotificationWithIcon(NOTIFICATION_TYPES.WARNING, 'You didnt choose the chicken');
        openNotificationWithIcon(
          NOTIFICATION_TYPES.WARNING,
          'Chicken pecks at corn. You hear cries of agony, theres blood everwhere. You didnt notice Corn was a (Corn) Man. You monster! Wolf theb murders Chicken. Corn Man is dead.',
           'Wat?'
          );
      },
      onToS2C1() {
        openNotificationWithIcon(
          NOTIFICATION_TYPES.WARNING,
          'You arrive on an island. There is a girl fixated on her phone. She does not look up as you approach',
           'Encounter II'
          );
      },
      onToS2C2() {
        openNotificationWithIcon(
          NOTIFICATION_TYPES.WARNING,
          'lol wot? She looks quizzical. Glasses, coloured hair and an adversion to hard labour? Perhaps she is one of those mythical millenials you have heard of. (maybe you should speak to her in a way she understands) ',
           'No Hables Ingles'
          );
      },
      onToS2C2Retry() {
        openNotificationWithIcon(
          NOTIFICATION_TYPES.WARNING,
          'She still doesnt seem to understand, maybe try some young people phrases', 'Not Trending'
          );
      },
      onToS2C2P() {
        openNotificationWithIcon(NOTIFICATION_TYPES.WARNING, 'She understands you!', 'Success!');
        openNotificationWithIcon(NOTIFICATION_TYPES.WARNING, 'Millenial Meredith joins your crew!', 'Yeet!');
      },
      onToS2C3F() {
        openNotificationWithIcon(NOTIFICATION_TYPES.WARNING, 'She doesnt understand your old timey language.', 'Dated');
        openNotificationWithIcon(NOTIFICATION_TYPES.WARNING, 'Millenial Meredith backs into a bush slowly and disappears', 'Big Mood');
      },
    },
  };
  
};
