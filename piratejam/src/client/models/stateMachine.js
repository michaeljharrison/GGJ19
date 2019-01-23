import _ from 'lodash';
import {
  State,
} from './state';
import type StateType from './state';

// @flow
  // eslint-disable-next-line
  type StateMachineType = {
      states: Array < State > ;
      initialStateIndex: number;
  };

export class StateMachine {
  constructor(states: Array < StateType >, initialStateIndex: number) {
    this.states = states;
    this.currentStateIndex = initialStateIndex;
    this.currentState = states[this.currentStateIndex];
  }

  get params() {
    return this.params;
  }

  get states() {
    return this.states;
  }

  get currentState() {
    return this.currentState;
  }

  setStates(newStates: Array < StateType >) {
    this.states = newStates;
  }

  update(params: Object) {
    return new Promise((resolve, reject) => {
      const {
        currentState, states,
      } = this;
      currentState.checkAllTransitions(params).then((result) => {
        if (result) {
          const foundIndex = _.findIndex(states, o => o.stateName === result);
          if (foundIndex >= 0) {
            this.currentState = states[foundIndex];
            this.currentStateIndex = foundIndex;
            resolve(true);
          } else {
            reject(new Error('Error - No matching state for transition in state machine: ', result));
          }
        } else {
          // No change in state.
          resolve(false);
        }
      }).catch((err) => {
        reject(err);
      });
    });
  }

  toString() {
    return JSON.stringify({
      states: this.states,
      currentState: this.currentState,
    });
  }
}
