import React from 'react';
import i18n from 'i18next';
import { withI18n, reactI18nextModule } from 'react-i18next';
import { CONFIG } from '../i18n.js';
// $FlowFixMe
import './DebugInfo.scss';

i18n
  .use(reactI18nextModule) // passes i18n down to react-i18next
  .init(CONFIG);

type Props = {
  stateMachine: any,
};
type State = {};
class HomePage extends React.Component<Props, State> {
  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {}

  componentWillReceiveProps() {}

  render() {
    let { stateMachine } = this.props;
    if (!stateMachine) stateMachine = {};
    return (
      <div className="DebugInfo">
        {' '}
        <div className="state">{`Current State: ${stateMachine.state}`}</div>
      </div>
    );
  }
}

const HomePageWithI18n = withI18n()(HomePage); // pass `t` function to App
export default HomePageWithI18n;
