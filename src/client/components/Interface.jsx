import React from 'react';
import { Input, Button } from 'antd';
import autobind from 'autobind-decorator';
import ArrowUp from '../style/assets/ARROW_UP_DEFAULT.png';
import ArrowDown from '../style/assets/ARROW_DOWN_DEFAULT.png';
// $FlowFixMe
import './Interface.scss';

type Props = {
  stateMachine: any,
  setNightCallback: any,
  newInputCallback: any,
};
type State = {
  commandHistory: Array<string>,
  currentCommandInput: string,
};

export default class Interface extends React.Component<Props, State> {
  constructor() {
    super();
    this.state = {
      commandHistory: ['', '', '', '', ''],
      currentCommandInput: '',
    };
  }

  componentDidMount() {}

  componentWillReceiveProps() {}

  @autobind
  _handleInputChange(value: any) {
    this.setState({ currentCommandInput: value.target.value });
  }

  @autobind
  _handleEnterInput(value: any) {
    const { newInputCallback } = this.props;
    console.log('New input: ', value.target.value);
    if (value.target.value.length === 0) {
      console.log('Empty Input');
    } else {
      // Add to command history.
      const { commandHistory } = this.state;
      commandHistory.unshift(value.target.value);
      this.setState({ currentCommandInput: '' });
      newInputCallback(value.target.value);
      this.forceUpdate();
    }
  }

  @autobind
  _renderCommandHistory() {
    const { commandHistory } = this.state;
    const array = [];
    for (let i = 0; i < commandHistory.length; i += 1) {
      array.push(<div className={`history ${i}`}>{commandHistory[i]}</div>);
    }
    return array;
  }

  @autobind
  addToHistory(message: string) {
    const { commandHistory } = this.state;
    commandHistory.unshift(<span className="crewMessage">{message}</span>);
  }

  render() {
    let { stateMachine } = this.props;
    const { setNightCallback } = this.props;
    const { currentCommandInput } = this.state;

    if (!stateMachine) stateMachine = {};
    return (
      <div className="interface">
        <div className="interfaceLeft">
          <div className="inputWrapper">
            <Input
              placeholder="Input your command here!"
              value={currentCommandInput}
              onPressEnter={(value) => {
                this._handleEnterInput(value);
              }}
              onChange={(value) => {
                this._handleInputChange(value);
              }}
              allowClear
            />
          </div>
          <div className="historyWrapperOuter">
            <div className="historyWrapper">{this._renderCommandHistory()}</div>
          </div>
        </div>
        <div className="interfaceRight">
          <Button />
          <Button>
            <img src={ArrowUp} alt="?" />
          </Button>
          <Button>
            <img src={ArrowDown} alt="?" />
          </Button>
        </div>
      </div>
    );
  }
}
