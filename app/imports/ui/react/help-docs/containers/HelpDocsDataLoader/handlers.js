import ReactDOM from 'react-dom';

import { MOBILE_BREAKPOINT } from '/imports/api/constants';
import { setShowCard } from '/client/redux/actions/mobileActions';
import { goToDashboard } from '../../../helpers/routeHelpers';

export const onHandleReturn = (props) => () => {
  if (props.width <= MOBILE_BREAKPOINT && props.showCard) {
    return props.dispatch(setShowCard(false));
  }

  // remove when dashboard is written in react
  ReactDOM.unmountComponentAtNode(document.getElementById('app'));

  return goToDashboard();
};
