import React from 'react';
import Particles from 'react-particles-js';
import { OCEAN_PARTICLES } from '../models/Particles.js';

import WaveBack from '../style/assets/Wave_back.png';
import WaveMid from '../style/assets/Wave_mid.png';
import WaveFront from '../style/assets/Wave_front.png';
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
      <div className="Ocean overlay">
        {' '}
        <div className="water">
          {/* <Particles className="oceanParticles" params={OCEAN_PARTICLES} /> */}
          <div className="wave waveWrapper">
            <img src={WaveBack} alt="?" className="wave waveBack" />
            <img src={WaveMid} alt="?" className="wave waveMid" />
            <img src={WaveFront} alt="?" className="wave waveFront" />
          </div>
        </div>
      </div>
    );
  }
}
