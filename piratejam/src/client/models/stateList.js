import { State } from './state.js';
import { Transition } from './transition.js';
import { StateMachine } from './stateMachine.js';

export const STATES = {
  START: 'start',
  MIDDLE: 'middle',
  END: 'end',
  MENU_PAUSED: 'menu_paused',
  MENU_OPTIONS: 'menu_paused',
  MENU_HELP: 'menu_help',
  MENU_QUIT: 'menu_quit',
  END_LOSE: 'end_lose',
  END_WIN: 'end_win',

};
export const initStates = () => {
  const states = [];
  // First create all our transitions:
  const startToMiddle = new Transition(STATES.START, STATES.MIDDLE, params => params.test === 1);
  const middleToEnd = new Transition(STATES.MIDDLE, STATES.END, params => params.test === 2);
  // Then create all our states:
  states.push(new State(STATES.START, [startToMiddle]));
  states.push(new State(STATES.MIDDLE, [middleToEnd]));
  states.push(new State(STATES.END, []));
  return new StateMachine(states, 0);
};
