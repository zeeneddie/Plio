import { Template } from 'meteor/templating';
import { Organizations } from '/imports/api/organizations/organizations.js';


Template.DashboardLayout.viewmodel({
  share: 'organization',
  isReady: false,
  _subHandlers: null,
  onCreated() {
    this.orgSerialNumber(parseInt(FlowRouter.getParam('orgSerialNumber')));
    this._subHandlers = [
      this.templateInstance.subscribe('currentUserOrganizations'),
      this.templateInstance.subscribe('currentUserOrganizationById', this.orgSerialNumber())
    ];
  },
  autorun: [
    function () {
      this.isReady(this._subHandlers.every(handle => handle.ready()));
    }
  ],
  organization() {
    const serialNumber = this.orgSerialNumber();
    return Organizations.findOne({ serialNumber });
  }
});
