import ReactDOM from 'react-dom';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { setShowCard } from '/imports/client/store/actions/mobileActions';
import { goTo } from '../../../../../ui/utils/router/actions';
import { MOBILE_BREAKPOINT, HomeRouteNames } from '../../../../../api/constants';

export const onHandleReturn = props => () => {
  if (props.width <= MOBILE_BREAKPOINT && props.showCard) {
    return props.dispatch(setShowCard(false));
  }

  // remove when dashboard is written in react
  ReactDOM.unmountComponentAtNode(document.getElementById('app'));

  const organization = props.organizations && props.organizations[0];
  const backRoute = FlowRouter.getQueryParam('backRoute');
  const homeRoute = HomeRouteNames[organization.homeScreenType];
  return goTo(backRoute || homeRoute)();
};
