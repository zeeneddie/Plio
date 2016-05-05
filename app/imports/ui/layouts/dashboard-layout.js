import { Template } from 'meteor/templating';
import { Organizations } from '/imports/api/organizations/organizations.js';


Template.DashboardLayout.viewmodel({
  mixin: {
    organizationMX: 'organization'
  },
  isReady: false,
  organizationSerialNumber() {
    return parseInt(FlowRouter.getParam('orgSerialNumber'));
  },
  autorun: [
    function () {
      this.organizationMX.subscribe(this.organizationSerialNumber())
    },
    function () {
      this.isReady(this.organizationMX.subHandler().ready());
    }
  ],
  organization() {
    const serialNumber = this.organizationSerialNumber();
    return Organizations.findOne({ serialNumber });
  }
});
