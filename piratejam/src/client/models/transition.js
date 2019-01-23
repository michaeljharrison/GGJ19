// @flow
// eslint-disable-next-line
type TransitionType = {
    fromState: string;
    toState: string;
    checkConditionsFunction: any;
}

export class Transition {
  constructor(fromState: string, toState: string, checkConditionsFunction: any) {
    this.fromState = fromState;
    this.toState = toState;
    this.checkConditionsFunction = checkConditionsFunction;
  }

  get fromState() {
    return this.fromState;
  }

  get toState() {
    return this.toState;
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

  checkConditions(params: Object): boolean {
    this.checkConditionsFunction(params);
  }
}
