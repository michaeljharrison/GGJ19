import {
  notification
} from 'antd';

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
      // START ENCOUNTER
      {
        name: 'toSailing',
        from: '*',
        to: 'sailing'
      },
      // S1
      {
        name: 'toS1C1',
        from: 'sailing',
        to: 'S1C1'
      },
      {
        name: 'toS1C1P',
        from: 'S1C1',
        to: 'sailing'
      },
      {
        name: 'toS1C1F',
        from: 'S1C1',
        to: 'sailing'
      },
      // S2
      {
        name: 'toS2C1',
        from: 'sailing',
        to: 'S2C1'
      },
      {
        name: 'toS2C2',
        from: 'S2C1',
        to: 'S2C2'
      },
      {
        name: 'toS2C2Retry',
        from: 'S2C2',
        to: 'S2C2'
      },
      {
        name: 'toS2C2P',
        from: 'S2C2',
        to: 'sailing'
      },
      {
        name: 'toS2C2F',
        from: 'S2C2',
        to: 'sailing'
      },
      // END ENCOUNTER
      {
        name: 'toSE',
        from: 'sailing',
        to: 'SE'
      },
      {
        name: 'toSEC1',
        from: 'SE',
        to: 'SEC1'
      },
      {
        name: 'toSEC2',
        from: 'SE',
        to: 'SEC2'
      },
      {
        name: 'toSEC11',
        from: 'SEC1',
        to: 'SEC11'
      },
      {
        name: 'toSEC12',
        from: 'SEC1',
        to: 'SEC12'
      },
      {
        name: 'toSEC13',
        from: 'SEC1',
        to: 'SEC13'
      },
      {
        name: 'toSEC31',
        from: 'SEC11',
        to: 'win'
      },
      {
        name: 'toSEC32',
        from: 'SEC12',
        to: 'win'
      },
      {
        name: 'toSEC33',
        from: 'SEC13',
        to: 'win'
      },
      {
        name: 'toSEC1From2',
        from: 'SEC2',
        to: 'SEC1'
      },
      {
        name: 'toFail',
        from: 'SEC2',
        to: 'fail'
      },
    ],
    methods: {
      onToSE() {
        openNotificationWithIcon(
          NOTIFICATION_TYPES.WARNING,
          'Your ship crashes onto a deserted Island. You are hungry. Your crew is hungry. The island is empty. Your ship is no more.', 'Woops.'
        );
        openNotificationWithIcon(
          NOTIFICATION_TYPES.WARNING,
          'It\'s now 4 days later. ', 'Tick Tock.'
        );
        openNotificationWithIcon(
          NOTIFICATION_TYPES.WARNING,
          'You will die without food.What do you eat?', 'Hunger.'
        );
      },
      onToSEC1() {
        openNotificationWithIcon(
          NOTIFICATION_TYPES.WARNING,
          'Who do you choose to eat?', 'Salivating.'
        );
      },
      onToSEC11() {
        openNotificationWithIcon(
          NOTIFICATION_TYPES.WARNING,
          `Vivid imagery about placing succelent corn into your mouth.
          It's juicy.
          Corn juice slowly drips through your beard.`, '<3 Corn <3')
      },
      onToSEC12() {
        openNotificationWithIcon(
          NOTIFICATION_TYPES.WARNING,
          `She was the worst anyway, dry, it was fine.`, '#WOAT')
      },
      onToSEC13() {
        openNotificationWithIcon(
          NOTIFICATION_TYPES.WARNING,
          `Yukky, nowhere near as delicious as corn.`, 'Gross')
      },
      onToSEC31() {
        openNotificationWithIcon(
          NOTIFICATION_TYPES.WARNING,
          `Home is the friends you eat along the way.`, 'Wholesome.'
        );
      },
      onToSEC32() {
        openNotificationWithIcon(
          NOTIFICATION_TYPES.WARNING,
          `Home is the friends you eat along the way.`, 'Wholesome.'
        );
      },
      onToSEC33() {
        openNotificationWithIcon(
          NOTIFICATION_TYPES.WARNING,
          `Home is the friends you eat along the way.`, 'Wholesome.'
        );
      },
      onToSEC2() {
        openNotificationWithIcon(
          NOTIFICATION_TYPES.WARNING,
          `But you hunger.`, 'Foolish.'
        );
      },
      toSEC1From2() {
        openNotificationWithIcon(
          NOTIFICATION_TYPES.WARNING,
          `Who do you eat?`, 'Choose.'
        );
      },
      onToFail() {
        openNotificationWithIcon(
          NOTIFICATION_TYPES.WARNING,
          `Too bad, You eat your friends anyway.`, 'Bad luck.'
        );
        openNotificationWithIcon(
          NOTIFICATION_TYPES.WARNING,
          `You eat them all, Days pass.`, 'All of them.'
        );
        openNotificationWithIcon(
          NOTIFICATION_TYPES.WARNING,
          `You see a boat approach on the horizon.`, 'Again'
        );
        openNotificationWithIcon(
          NOTIFICATION_TYPES.WARNING,
          `Home is the friends you eat along the way.`, 'Wholesome.'
        );
      },
      onToS1C1() {
        openNotificationWithIcon(
          NOTIFICATION_TYPES.WARNING,
          'You arrive on an island. There is a chicken, a wolf and a large corn cob. You reckon you can only grab one item at a time. What do you grab first', 'Puzzling.'
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