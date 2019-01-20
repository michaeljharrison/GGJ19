import React from 'react';
// $FlowFixMe
import './HomePage.scss';

type Props = {};
type State = {};
export default class LoginPage extends React.Component<Props, State> {
  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {}

  componentWillReceiveProps() {}

  render() {
    return (
      <div className="Page HomePage">
        <div className="gameView">Game View.</div>
        <div className="interfaceView">Interface</div>
      </div>
    );
  }
}
