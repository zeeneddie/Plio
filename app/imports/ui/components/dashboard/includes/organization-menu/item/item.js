import { Template } from 'meteor/templating';

import { selectOrganization } from '/imports/api/users/methods.js';
import { handleMethodResult } from '/imports/api/helpers.js';

Template.Organization_Menu_Item.viewmodel({
  mixin: 'router',
  serialNumber: '',
  regex() {
    return `^\\/${this.serialNumber()}`;
  },
  selectOrg(e) {
    e.preventDefault();

    const selectedOrganizationSerialNumber = this.serialNumber();

    localStorage.setItem(`${Meteor.userId()}: selectedOrganizationSerialNumber`, selectedOrganizationSerialNumber);

    this.goToDashboard(selectedOrganizationSerialNumber);
  }
});
