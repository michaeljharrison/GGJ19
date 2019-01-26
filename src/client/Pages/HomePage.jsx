import React from 'react';
import i18n from 'i18next';
import { notifcation } from 'antd';
import autobind from 'autobind-decorator';
import { withI18n, reactI18nextModule } from 'react-i18next';
import StateMachine from 'javascript-state-machine';
import { parseInput } from '../common/ParseInput';
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

const openNotificationWithIcon = (type) => {
  notification[type]({
    message: 'Yarrr!',
    description: 'This be my response to yer question.',
    duration: 8,
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
};
class HomePage extends React.Component<any, State> {
  constructor() {
    super();
    this.state = {
      stateMachine: null,
      isReady: false,
      isNight: false,
      stateParams: {},
    };
  }

  componentDidMount() {
    this.setState({ stateMachine: new StateMachine(STATE_MACHINE) });
    this.setState({ isReady: true });
  }

  @autobind
  _toggleNight() {
    const { isNight } = this.state;
    this.setState({ isNight: !isNight });
  }

  @autobind
  _newInput(input) {
    parseInput(stateMachine.state);
    const { stateParams } = this.state;
    // Check stateParams to determine a transition:
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
