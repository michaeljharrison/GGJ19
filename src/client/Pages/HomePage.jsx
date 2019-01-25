import React from 'react';
import { Input } from 'antd';
import i18n from 'i18next';
import { withI18n, reactI18nextModule } from 'react-i18next';
import { DebugInfo } from '../components';
import { CONFIG } from '../i18n.js';
// $FlowFixMe
import './HomePage.scss';

i18n
  .use(reactI18nextModule) // passes i18n down to react-i18next
  .init(CONFIG);

type Props = {
  t: any,
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
    const { t } = this.props;
    const { stateMachine } = this.state;
    return (
      <div className="Page HomePage">
        <div className="gameView">
          <span>Game View</span>
          <DebugInfo stateMachine={stateMachine} />
        </div>
        <div className="interfaceView">
          <div className="interfaceLeft">
            <div className="inputWrapper">
              <Input
                addonBefore={<div className="inputBefore"> :) </div>}
                defaultValue={t('Input_Placeholder')}
              />
            </div>
          </div>
          <div className="interfaceRight" />
        </div>
      </div>
    );
  }
}

const HomePageWithI18n = withI18n()(HomePage); // pass `t` function to App
export default HomePageWithI18n;
