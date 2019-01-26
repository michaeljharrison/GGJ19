import React from 'react';
// $FlowFixMe
import './Boat.scss';

type Props = {
  stateMachine: any,
};
type State = {};

export default class Boat extends React.Component<Props, State> {
  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {}

  componentWillReceiveProps() {}

  render() {
    let { stateMachine } = this.props;
    if (!stateMachine) stateMachine = {};
    return <div className="Boat overlay" />;
  }
}
