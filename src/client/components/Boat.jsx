import React from 'react';
import BoatBG from '../style/assets/BOAT.png';
import BoatBGHull from '../style/assets/BOAT_Exterior.png';
import CrackersBack from '../style/assets/Crackers_Ship_Helm.png';
import CrackersFront from '../style/assets/Crackers_Ship.png';
import Merry from '../style/assets/Meredith_Ship.png';
import Corn from '../style/assets/Julian_Ship.png';
import Blackbeard from '../style/assets/Blackbeard_Ship.png';

// $FlowFixMe
import './Boat.scss';

type Props = {
  stateMachine: any,
  show: false,
  stateParams: Object,
  introComplete: boolean,
  hasCorn: boolean,
  hasMerry: boolean,
  showHull: boolean,
};
type State = {};

export default class Boat extends React.Component<Props, State> {
  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {}

  componentWillReceiveProps() {}

  render() {
    const {
      show, stateParams, introComplete, hasCorn, hasMerry, showHull,
    } = this.props;
    let { stateMachine } = this.props;
    if (!stateMachine) stateMachine = {};
    if (!show) return <div />;
    return (
      <div className="Boat overlay">
        {!showHull && <img className="boatBG" src={BoatBG} alt="huh" />}
        {showHull && <img className="boatBG" src={BoatBGHull} alt="huh" />}
        {!introComplete && <img className="crackers char" src={CrackersBack} alt="thisIsCrackers,HiCrackers." />}
        {introComplete && <img className="crackers char" src={CrackersFront} alt="thisIsCrackers,HiCrackers." />}
        {introComplete && <img className="blackbeard char" src={Blackbeard} alt="thisIsBlackBeard" />}
        {hasCorn && <img className="corn char" src={Corn} alt="thisIsCorn" />}
        {hasMerry && <img className="merry char" src={Merry} alt="thisIsCorn" />}
      </div>
    );
  }
}
