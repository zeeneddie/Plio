import ReactDOM from 'react-dom';

import { MOBILE_BREAKPOINT } from '/imports/api/constants';
import { setShowCard } from '/imports/client/store/actions/mobileActions';
import { goTo } from '../../../../utils/router/actions';

export const onHandleReturn = props => () => {
  if (props.width <= MOBILE_BREAKPOINT && props.showCard) {
    return props.dispatch(setShowCard(false));
  }

  // remove when dashboard is written in react
  ReactDOM.unmountComponentAtNode(document.getElementById('app'));

  return goTo('dashboardPage')();
};
