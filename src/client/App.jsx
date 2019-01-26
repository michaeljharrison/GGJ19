import React from 'react';
import { hot, setConfig } from 'react-hot-loader';
import { BrowserRouter } from 'react-router-dom';
import Routes from './routes/routes.jsx';

type Props = {};
type State = { status: boolean };

class App extends React.Component<Props, State> {
  componentWillMount() {}

  render() {
    return (
      <BrowserRouter>
        <Routes t />
      </BrowserRouter>
    );
  }
}

setConfig({ logLevel: 'debug' });

export default hot(module)(App);
