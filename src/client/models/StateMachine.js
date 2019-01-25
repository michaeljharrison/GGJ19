export const STATE_MACHINE = {
  init: 'solid',
  transitions: [
    { name: 'melt', from: 'solid', to: 'liquid' },
    { name: 'freeze', from: 'liquid', to: 'solid' },
    { name: 'vaporize', from: 'liquid', to: 'gas' },
    { name: 'condense', from: 'gas', to: 'liquid' },
  ],
  methods: {
    onMelt() {
      console.log('I melted');
    },
    onFreeze() {
      console.log('I froze');
    },
    onVaporize() {
      console.log('I vaporized');
    },
    onCondense() {
      console.log('I condensed');
    },
  },
};
