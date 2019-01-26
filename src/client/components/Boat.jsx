import React from 'react';
import BoatBG from '../style/assets/BOAT.png';
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
    return (
      <div className="Boat overlay">
        <img className="boatBG" src={BoatBG} alt="huh" />
      </div>
    );
  }
}
