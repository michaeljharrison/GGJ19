import React from 'react';
import i18n from 'i18next';
import { notification } from 'antd';
import autobind from 'autobind-decorator';
import { withI18n, reactI18nextModule } from 'react-i18next';
import StateMachine from 'javascript-state-machine';
import { parseInput } from '../common/ParseInput.js';
import { CONFIG } from '../i18n.js';
// $FlowFixMe
import './HomePage.scss';
import { STATE_MACHINE } from '../models/StateMachine';
import {
  Interface, Boat, Sky, Ocean, DebugInfo,
} from '../components';

const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  WARNING: 'warning',
  INFO: 'info',
  ERROR: 'error',
};

const openNotificationWithIcon = (type, message) => {
  notification[type]({
    message: 'Yarrr!',
    description: message,
    duration: 8,
    style: {
      left: -Math.floor(Math.random() * 500 + 250),
      top: Math.floor(Math.random() * 500 + 250),
    },
  });
};

i18n
  .use(reactI18nextModule) // passes i18n down to react-i18next
  .init(CONFIG);

type State = {
  stateMachine: any,
  isNight: boolean,
  isReady: boolean,
  stateParams: Object,
  intervalID: any,
};

class HomePage extends React.Component<any, State> {
  constructor() {
    super();
    this.state = {
      stateMachine: null,
      isReady: false,
      isNight: false,
      stateParams: {
        isSailing: true,
        isScenario: false,
        hasLost: false,
        scenario: 0,
      },
    };
  }

  componentDidMount() {
    this.setState({ stateMachine: new StateMachine(STATE_MACHINE) });
    this.setState({ isReady: true });
    const intervalId = setInterval(this._newScenario, 3000);
    // store intervalId in the state so it can be accessed later:
    this.setState({ intervalId });
  }

  @autobind
  _newScenario() {
    console.log('INTERVAL!');
    const { stateParams, stateMachine } = this.state;
    if (stateParams.isSailing) {
      console.log('New Scenario');
      openNotificationWithIcon(NOTIFICATION_TYPES.WARNING, 'Something up ahead Captain!');
      stateParams.inScenario = true;
      stateParams.isSailing = false;
      this.setState({ stateParams });
      switch (stateParams.scenario) {
        case 0:
          stateMachine.startScenario1();
          break;
        case 1:
          stateMachine.startScenario2();
          break;
        case 2:
          stateMachine.startScenario3();
          break;
        case 3:
          stateMachine.startScenario4();
          break;
        default:
          console.log('wtf');
          break;
      }
    } else {
      // Do nothing until scenario is solved.
    }
  }

  @autobind
  _toggleNight() {
    const { isNight } = this.state;
    this.setState({ isNight: !isNight });
  }

  @autobind
  _newInput(input) {
    const { stateParams, stateMachine } = this.state;
    const returnMessage = parseInput(stateMachine, stateParams, input);
    openNotificationWithIcon(NOTIFICATION_TYPES.SUCCESS, returnMessage);
  }

  render() {
    const { stateMachine, isReady, isNight } = this.state;
    if (!isReady) {
      return <div className="LoadingWrapper">LOADING</div>;
    }
    return (
      <div className="Page HomePage">
        <div className="gameView">
          <DebugInfo stateMachine={stateMachine} />
          <Sky isNight={isNight} />
          <Boat />
          <Ocean />
        </div>
        <Interface newInputCallback={this._newInput} setNightCallback={this._toggleNight} />
      </div>
    );
  }
}

const HomePageWithI18n = withI18n()(HomePage); // pass `t` function to App
export default HomePageWithI18n;
