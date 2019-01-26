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
  slow: boolean,
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
    let { stateMachine, slow } = this.props;
    let classes = '';
    if (!stateMachine) stateMachine = {};
    if (slow) {
      classes = 'slowed';
    }
    return (
      <div className="Ocean overlay">
        {' '}
        <div className="water">
          {/* <Particles className="oceanParticles" params={OCEAN_PARTICLES} /> */}
          <div className="wave waveWrapper">
            <img src={WaveBack} alt="?" className={`wave waveBack ${classes}`} />
            <img src={WaveMid} alt="?" className={`wave waveMid ${classes}`} />
            <img src={WaveFront} alt="?" className={`wave waveFront ${classes}`} />
          </div>
        </div>
      </div>
    );
  }
}
