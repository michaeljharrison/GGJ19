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
    this._states = states;
    this._currentStateIndex = initialStateIndex;
    this._currentState = states[this.currentStateIndex];
  }

  get params() {
    return this._params;
  }

  get states() {
    return this._states;
  }

  get currentState() {
    return this._currentState;
  }

  setStates(newStates: Array < StateType >) {
    this._states = newStates;
  }

  update(params: Object) {
    return new Promise((resolve, reject) => {
      const {
        _currentState, _states,
      } = this;
      _currentState.checkAllTransitions(params).then((result) => {
        if (result) {
          const foundIndex = _.findIndex(_states, o => o.stateName === result);
          if (foundIndex >= 0) {
            this.currentState = _states[foundIndex];
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
      states: this._states,
      currentState: this._currentState,
    });
  }
}
