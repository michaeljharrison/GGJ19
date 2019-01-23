import { Transition } from "./transition";

// @flow

type State = {
    stateName: string;
    transitions: Array<Transition>;
}
export class State = {
    constructor(stateName: string, transitions=[]: Array<Transition>) {
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
        return JSON.stringify({ stateName: this.stateName, transitions: this.transitions});
    }

    checkAllTransitions(params: Object): string | boolean {
        const { transitions } = this;
        transitions.forEach((transition) => {
            transition.checkConditions(params).then((result) => {
                if(result === true) {
                    return transition.endState;
                }
            }).catch((error) => {
                return false;
            });
        });
        return false;
    }

}