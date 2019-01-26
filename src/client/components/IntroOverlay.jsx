import React from 'react';
import autobind from 'autobind-decorator';
import Splash from '../style/assets/splash.png';
// $FlowFixMe
import './IntroOverlay.scss';

type Props = {};
type State = {};
export default class IntroOverlay extends React.Component<Props, State> {
  constructor() {
    super();
    this.state = {
      renderSelf: true,
    };
  }

  componentDidMount() {}

  componentWillReceiveProps() {}

  @autobind
  _startGame() {
    this.setState({ renderSelf: false });
    this.props.startGame();
  }

  render() {
    const { renderSelf } = this.state;
    if (!renderSelf) return <div />;
    return (
      <div className="IntroOverlay" onClick={this._startGame}>
        <img src={Splash} alt="nothnx" />
        <div className="title">Click anywhere to set sail!</div>
      </div>
    );
  }
}
