import React from 'react';
import IslandBG from '../style/assets/Island.png';
// $FlowFixMe
import './Island.scss';

type Props = {
  stateMachine: any,
  show: boolean,
  enter: boolean,
  leave: boolean,
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
    const { show, leave, enter } = this.props;
    console.log(enter);
    let { stateMachine } = this.props;
    let classes = '';
    if (!stateMachine) stateMachine = {};
    if (!show) return <div />;

    if (leave) classes = 'leave';
    if (enter) classes = 'enter';
    return (
      <div className={`Island overlay ${classes}`}>
        <img className={`islandBG ${classes}`} src={IslandBG} alt="huh" />
      </div>
    );
  }
}
