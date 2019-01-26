import React from 'react';
import autobind from 'autobind-decorator';
// $FlowFixMe
import './IntroOverlay.scss';

type Props = {
};
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
        <div className="title">
              Meat the Crew
        </div>
        <div className="subtitle">
              Click anywhere to set sail!
        </div>
      </div>
    );
  }
}
