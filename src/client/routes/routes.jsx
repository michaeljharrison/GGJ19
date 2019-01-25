// eslint no-return-assign:0
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { HomePage, FourOhFour } from '../Pages';
import '../style/global_styles.scss';

const Routes = () => (
  <Switch>
    <Route exact path="/" component={HomePage} />
    <Route path="*" component={FourOhFour} />
  </Switch>
);
export default Routes;
