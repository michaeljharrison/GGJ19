import {
  Transition,
} from './transition';
import type TransitionType from './transition';

// @flow

// eslint-disable-next-line
type StateType = {
    stateName: string;
    transitions: Array < Transition > ;
};

export class State {
  constructor(stateName: string, transitions: Array < TransitionType >) {
    this.transitions = transitions;
    this.stateName = stateName;
  }

  get transitions() {
    return this.transitions;
  }

  get stateName() {
    return this.stateName;
  }

  toString() {
    return JSON.stringify({
      stateName: this.stateName,
      transitions: this.transitions,
    });
  }

  checkAllTransitions(params: Object): string | boolean {
    return new Promise((resolve, reject) => {
      const {
        transitions,
      } = this;
      transitions.forEach((transition) => {
        transition.checkConditions(params).then((result) => {
          if (result === true) {
            resolve(transition.endState);
          }
        }).catch((err) => { reject(err); });
      });
      resolve(false);
    });
  }
}
