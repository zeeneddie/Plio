import { FlowRouter } from 'meteor/kadira:flow-router';

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
      FlowRouter.go('dashboardPage', { orgSerialNumber: this.organizationSerialNumber() });
    }
  },
};
