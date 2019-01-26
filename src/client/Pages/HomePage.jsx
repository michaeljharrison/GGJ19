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
  Interface, Boat, Sky, Ocean, DebugInfo, IntroOverlay, Island
} from '../components';

const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  WARNING: 'warning',
  INFO: 'info',
  ERROR: 'error',
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
  isIntro: boolean,
  isOutro: boolean,
  introComplete: boolean,
};

class HomePage extends React.Component<any, State> {
  constructor() {
    super();
    this.state = {
      stateMachine: null,
      isReady: false,
      isNight: false,
      isIntro: true,
      introComplete: false,
      isOutro: false,
      stateParams: {
        isSailing: true,
        isScenario: false,
        hasLost: false,
        scenario: 1,
        currentRetries: 0,
      },
    };
  }

  componentDidMount() {
    this.setState({ stateMachine: new StateMachine(STATE_MACHINE(this.openNotificationWithIcon))});
    this.setState({ isReady: true });
  }

  @autobind
  openNotificationWithIcon(type, message, title) {
    notification.open({
      message: title,
      description: message,
      placement: 'topLeft',
      duration: 4,
      style: {
        // left: -Math.floor(Math.random() * 500 + 250),
        // top: Math.floor(Math.random() * 250 + 25),
      },
    });
    if (this.refs.interface) {
      this.refs.interface.addToHistory(message);
    }4
  }

  @autobind
  _startGame() {
    console.log('Starting Game!');
    const intervalId = setInterval(this._newScenario, 5000);
    // store intervalId in the state so it can be accessed later:
    this.state.intervalId = intervalId;
    this.setState({isIntro: false})
    this.state.isIntro = false;
  }

  @autobind
  _newScenario() {
    const { stateParams, stateMachine, intervalId } = this.state;
  
    if(stateMachine.state === 'fail' || stateMachine.state === 'win') {
      this.setState({isIntro: true});
      this.setState({introComplete: false});
      stateParams.scenario = 1;
      this.stateMachine.toSailing();
      return;
    }

    if(stateMachine.state === 'SEC11' || stateMachine.state === 'SEC12' || stateMachine.state === 'SEC13') {
      this.setState({isIntro: true});
      this.setState({introComplete: false});
      stateParams.scenario = 1;
      this.stateMachine.toSailing();
      return;
      return;
    }

    console.log('INTERVAL: ', stateParams);
    console.log('CurrentState: ', stateMachine.state);
    if (stateMachine.state === 'sailing') {
      console.log('New Scenario!');
      this.openNotificationWithIcon(NOTIFICATION_TYPES.WARNING, 'Something up ahead Captain!', 'Alert!');
      stateParams.inScenario = true;
      stateParams.isSailing = false;
      console.log('This should say 1!', stateParams.scenario);
      switch (stateParams.scenario) {
        case 1:
          clearInterval(intervalId);
          stateMachine.toS1C1(this.openNotificationWithIcon);
          break;
        case 2:
          clearInterval(intervalId);
          stateMachine.toS2C1(this.openNotificationWithIcon);
          break;
        case 3:
          clearInterval(intervalId);
          stateMachine.toSE(this.openNotificationWithIcon);
          break;
        case 4:
          clearInterval(intervalId);
          stateMachine.toS4C1(this.openNotificationWithIcon);
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
    const returnMessage = parseInput(stateMachine, stateParams, input, this.openNotificationWithIcon);
    if (returnMessage.status === 'success') {
      const intervalId = setInterval(this._newScenario, 5000);
      this.state.intervalId = intervalId;
      this.openNotificationWithIcon(NOTIFICATION_TYPES.SUCCESS, returnMessage.message, returnMessage.title);
    } else if (returnMessage.status === 'confuse') {
      this.openNotificationWithIcon(NOTIFICATION_TYPES.WARNING, returnMessage.message, returnMessage.title);
    } else if (returnMessage.status === 'fail') {
      this.openNotificationWithIcon(NOTIFICATION_TYPES.ERROR, returnMessage.message, returnMessage.title);
    }
  }

  render() {
    const { stateMachine, isReady, isNight, stateParams } = this.state;
    const { isIntro, isOutro, introComplete } = this.state;
    if (!isReady) {
      return <div className="LoadingWrapper">LOADING</div>;
    }
    console.log('Rendering! (shouldnt happen much):', isIntro);
    return (
      <div className="Page HomePage">
        <div className="gameView">
          <DebugInfo stateMachine={stateMachine} />
          {isIntro && <IntroOverlay startGame={this._startGame}/>}
          <Sky isNight={isNight} />
          <Boat show/>
          <Island show={(!isIntro && !introComplete) || isOutro}/>
          <Ocean />
        </div>
        <Interface disabled={isIntro} newInputCallback={this._newInput} setNightCallback={this._toggleNight} ref="interface" />
      </div>
    );
  }
}

const HomePageWithI18n = withI18n()(HomePage); // pass `t` function to App
export default HomePageWithI18n;
