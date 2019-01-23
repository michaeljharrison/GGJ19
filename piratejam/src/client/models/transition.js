import { State } from "./state";

// @flow

type Transition = {
    fromState: State;
    toState: State;
    checkConditionsFunction: any; 
}

export class Transition = {
    constructor(fromState: State, toState: State, checkConditionsFunction: any) {
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
        return JSON.stringify({ toState: this.toState, fromState: this.fromState, checkConditionsFunction: this.checkConditionsFunction});
    }

    checkConditions(params: Object): boolean {
        this.checkConditionsFunction(params);
    }

}