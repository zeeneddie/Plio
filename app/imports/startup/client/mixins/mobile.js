import { FlowRouter } from 'meteor/kadira:flow-router';

import { HomeRouteNames } from '../../../api/constants';

export default {
  display() {
    return this.isMobile() ? 'display: block !important' : '';
  },
  isMobile() {
    return !!this.width() && this.width() < 768;
  },
  navigate(e) {
    e.preventDefault();

    if (this.isMobile()) {
      this.width(null);
    } else {
      const backRoute = FlowRouter.getQueryParam('backRoute');
      const homeRoute = HomeRouteNames[this.organization().homeScreenType];
      FlowRouter.go(backRoute || homeRoute, { orgSerialNumber: this.organizationSerialNumber() });
    }
  },
};
