// @flow
import {
  Transition,
} from './transition';
import type { TransitionType } from './transition';

// eslint-disable-next-line
type StateType = {
    _stateName: string;
    _transitions: Array < Transition > ;
};

export class State {
  _transitions: Array< TransitionType >;

  _stateName: string;

  constructor(stateName: string, transitions: Array < TransitionType >) {
    this._transitions = transitions;
    this._stateName = stateName;
  }

  get transitions() {
    return this._transitions;
  }

  get stateName() {
    return this._stateName;
  }

  toString() {
    return JSON.stringify({
      stateName: this._stateName,
      transitions: this._transitions,
    });
  }

  checkAllTransitions(params: Object): Promise<any> {
    return new Promise((resolve, reject) => {
      const {
        _transitions,
      } = this;
      _transitions.forEach((transition) => {
        transition.checkConditionsFunction()(params).then((result) => {
          if (result === true) {
            resolve(transition.toState);
          }
        }).catch((err) => { reject(err); });
      });
      resolve(false);
    });
  }
}
