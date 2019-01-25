import React from 'react';
import Particles from 'react-particles-js';
import { OCEAN_PARTICLES } from '../models/Particles.js';
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
          <Particles className="oceanParticles" params={OCEAN_PARTICLES} />
        </div>
      </div>
    );
  }
}
