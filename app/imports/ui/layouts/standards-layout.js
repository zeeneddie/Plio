import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Organizations } from '/imports/api/organizations/organizations.js';

Template.StandardsLayout.viewmodel({
  share: 'organization',
  _subHandlers: null,
  isReady: false,
  onCreated() {
    this.orgSerialNumber(parseInt(FlowRouter.getParam('orgSerialNumber')));
  },
  organization() {
    const serialNumber = this.orgSerialNumber();
    return Organizations.findOne({ serialNumber });
  },
  autorun: [
    function () {
      const org = Organizations.findOne({ serialNumber: this.orgSerialNumber() });
      const { _id, users } = !!org && org;
      const userIds = _.pluck(users, 'userId');
      this._subHandlers = [
        this.templateInstance.subscribe('currentUserOrganizations'),
        this.templateInstance.subscribe('standards-book-sections', _id),
        this.templateInstance.subscribe('standards-types', _id),
        this.templateInstance.subscribe('departments', _id),
        this.templateInstance.subscribe('organizationUsers', userIds)
      ]
    },
    function () {
      this.isReady(this._subHandlers.every(handle => handle.ready()));
    }
  ]
});
