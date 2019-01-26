import React from 'react';
import Particles from 'react-particles-js';
import {
  STAR_PARTICLES, CLOUD1_PARTICLES, CLOUD2_PARTICLES, CLOUD3_PARTICLES,
} from '../models/Particles.js';
// $FlowFixMe
import './Sky.scss';

type Props = {
  stateMachine: any,
  isNight: boolean,
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
    let { stateMachine, isNight } = this.props;
    if (!stateMachine) stateMachine = {};
    return (
      <div className="Sky overlay">
        {' '}
        <div className="bg_back overlay">
          {' '}
          {isNight && (
            <div className="nightSky">
              {' '}
              <Particles className="night" params={STAR_PARTICLES} />{' '}
            </div>
          )}
          {!isNight && (
            <div className="daySky">
              {' '}
              <Particles className="day" params={CLOUD1_PARTICLES} />
              <Particles className="day" params={CLOUD2_PARTICLES} />
              <Particles className="day" params={CLOUD3_PARTICLES} />
            </div>
          )}
        </div>{' '}
        <div className="bg_mid overlay" /> <div classNAme="bg_front overlay" />{' '}
      </div>
    );
  }
}
