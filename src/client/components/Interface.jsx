import React from 'react';
import { Input, notification, Button } from 'antd';
import autobind from 'autobind-decorator';
// $FlowFixMe
import './Interface.scss';

type Props = {
  stateMachine: any,
};
type State = {
  commandHistory: Array<string>,
  currentCommandInput: string,
};

const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  WARNING: 'warning',
  INFO: 'info',
  ERROR: 'error',
};

const openNotificationWithIcon = (type) => {
  notification[type]({
    message: 'Yarrr!',
    description: 'This be my response to yer question.',
    duration: 8,
  });
};

export default class Interface extends React.Component<Props, State> {
  constructor() {
    super();
    this.state = {
      commandHistory: ['', '', ''],
      currentCommandInput: '',
    };
  }

  componentDidMount() {}

  componentWillReceiveProps() {}

  @autobind
  _handleInputChange(value: any) {
    console.log('Input value: ', value.target.value);
    this.setState({ currentCommandInput: value.target.value });
  }

  @autobind
  _handleEnterInput(value: any) {
    console.log('New input: ', value.target.value);

    // Add to command history.
    const { commandHistory } = this.state;
    commandHistory.unshift(value.target.value);
    this.setState({ currentCommandInput: '' });

    // Check input against current state.

    // Update state if required.
    openNotificationWithIcon(NOTIFICATION_TYPES.SUCCESS);

    // Render

    this.forceUpdate();
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

  render() {
    let { stateMachine, setNightCallback } = this.props;
    const { commandHistory, currentCommandInput } = this.state;

    console.log('Current State: ', commandHistory, currentCommandInput);

    if (!stateMachine) stateMachine = {};
    return (
      <div className="interface">
        <div className="interfaceLeft">
          <div className="inputWrapper">
            <Input
              addonBefore={<div className="inputBefore"> :) </div>}
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
          <div className="historyWrapper">{this._renderCommandHistory()}</div>
        </div>
        <div className="interfaceRight">
          <Button>Menu</Button>
          <Button>Button2</Button>
          <Button
            onClick={() => {
              setNightCallback();
            }}
          >
            Night Light.
          </Button>
        </div>
      </div>
    );
  }
}
