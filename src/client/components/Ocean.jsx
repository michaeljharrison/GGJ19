import React from 'react';
// $FlowFixMe
import './Ocean.scss';

type Props = {
  stateMachine: any,
};
type State = {};
export default class Ocean extends React.Component<Props, State> {
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
      <div className="Ocean">
        {' '}
        <div className="state">Ocean</div>
      </div>
    );
  }
}
