import _ from 'lodash';
import assert from 'assert';
import { State } from '../models/state';
import { Transition } from '../models/transition.js';
import { StateMachine } from '../models/stateMachine.js';

const STATES = {
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

  test('can create a new state machine.', () => {
    const states = [];
    // First create all our transitions:
    const startToMiddle = new Transition(STATES.START, STATES.MIDDLE, params => params.test === 1);
    const middleToEnd = new Transition(STATES.MIDDLE, STATES.END, params => params.test === 2);
    // Then create all our states:
    states.push(new State(STATES.START, [startToMiddle]));
    states.push(new State(STATES.MIDDLE, [middleToEnd]));
    states.push(new State(STATES.END, []));
    const stateMachine = new StateMachine(states, 0);

    expect(stateMachine.toString()).toEqual('{\"states\":[{\"_transitions\":[{\"_fromState\":\"start\",\"_toState\":\"middle\"}],\"_stateName\":\"start\"},{\"_transitions\":[{\"_fromState\":\"middle\",\"_toState\":\"end\"}],\"_stateName\":\"middle\"},{\"_transitions\":[],\"_stateName\":\"end\"}]}');
});

