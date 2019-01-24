// @flow
// eslint-disable-next-line
export type TransitionType = {
    _fromState: string;
    _toState: string;
    _checkConditionsFunction: any;
    toState: () => string;
    checkConditionsFunction: () => any;
}

export class Transition {
  _fromState: string;

  _toState: string;

  _checkConditionsFunction: any;

  constructor(fromState: string, toState: string, checkConditionsFunction: any) {
    this._fromState = fromState;
    this._toState = toState;
    this._checkConditionsFunction = checkConditionsFunction;
  }

  get fromState() {
    return this._fromState;
  }

  get toState() {
    return this._toState;
  }

  get checkConditionsFunction() {
    return this.checkConditionsFunction;
  }

  toString() {
    return JSON.stringify({
      toState: this.toState,
      fromState: this.fromState,
      checkConditionsFunction: this.checkConditionsFunction,
    });
  }

  checkConditions(params: Object): any {
    this.checkConditionsFunction(params);
  }
}
