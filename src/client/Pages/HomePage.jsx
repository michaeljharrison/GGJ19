import React from 'react';
import i18n from 'i18next';
import { withI18n, reactI18nextModule } from 'react-i18next';
import StateMachine from 'javascript-state-machine';
import { CONFIG } from '../i18n.js';
// $FlowFixMe
import './HomePage.scss';
import { STATE_MACHINE } from '../models/StateMachine';
import {
  Interface, Boat, Sky, Ocean, DebugInfo,
} from '../components';

i18n
  .use(reactI18nextModule) // passes i18n down to react-i18next
  .init(CONFIG);

type Props = {
  t: any,
};
type State = {
  stateMachine: any,
};
class HomePage extends React.Component<Props, State> {
  constructor() {
    super();
    this.state = {
      stateMachine: null,
      isReady: false,
    };
  }

  componentDidMount() {
    this.setState({ stateMachine: new StateMachine(STATE_MACHINE) });
    this.setState({ isReady: true });
  }

  componentWillReceiveProps() {}

  render() {
    const { stateMachine, isReady } = this.state;
    if (!isReady) {
      return <div className="LoadingWrapper">LOADING</div>;
    }
    return (
      <div className="Page HomePage">
        <div className="gameView">
          <DebugInfo stateMachine={stateMachine} />
          <Sky />
          <Boat />
          <Ocean />
        </div>
        <Interface />
      </div>
    );
  }
}

const HomePageWithI18n = withI18n()(HomePage); // pass `t` function to App
export default HomePageWithI18n;
