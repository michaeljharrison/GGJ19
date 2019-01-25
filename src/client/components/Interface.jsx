import React from 'react';
import { Input } from 'antd';
// $FlowFixMe
import './Interface.scss';

type Props = {
  stateMachine: any,
};
type State = {};
export default class Interface extends React.Component<Props, State> {
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
      <div className="interface">
        <div className="inputWrapper">
          <Input addonBefore={<div className="inputBefore"> :) </div>} placeholder="Input your command here!" />
        </div>
        <div className="historyWrapper">
          <div className="history first">First</div>
          <div className="history second">Second</div>
          <div className="history third">Third</div>
        </div>
      </div>
    );
  }
}
