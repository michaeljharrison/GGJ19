import React from 'react';
import Particles from 'react-particles-js';
import { CLOUD1_PARTICLES, CLOUD2_PARTICLES, CLOUD3_PARTICLES } from '../models/Particles.js';
import Sun from '../style/assets/Sun.png';
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
      <div className="Sky overlay">
        {' '}
        <div className="bg_back overlay">
          {' '}
          <div className="daySky">
            {' '}
            <Particles className="day" params={CLOUD1_PARTICLES} />
            <Particles className="day" params={CLOUD2_PARTICLES} />
            <Particles className="day" params={CLOUD3_PARTICLES} />
            <img className="sun" src={Sun} alt="?" />
          </div>
        </div>{' '}
        <div className="bg_mid overlay" /> <div classNAme="bg_front overlay" />{' '}
      </div>
    );
  }
}
