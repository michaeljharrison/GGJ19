import React from 'react';
import IslandBG from '../style/assets/Island.png';
// $FlowFixMe
import './Island.scss';

type Props = {
  stateMachine: any,
  show: false,
};
type State = {};

export default class Island extends React.Component<Props, State> {
  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {}

  componentWillReceiveProps() {}

  render() {
    const { show } = this.props;
    let { stateMachine } = this.props;
    if (!stateMachine) stateMachine = {};
    if (!show) return <div />;
    return (
      <div className="Island overlay">
        <img className="islandBG" src={IslandBG} alt="huh" />
      </div>
    );
  }
}
