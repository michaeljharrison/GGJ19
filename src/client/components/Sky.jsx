import React from 'react';
// $FlowFixMe
import './Sky.scss';

type Props = {
  stateMachine: any,
};
type State = {};
export default class Sky extends React.Component<Props, State> {
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
      <div className="Sky">
        {' '}
        <div className="state">Sky</div>
      </div>
    );
  }
}
