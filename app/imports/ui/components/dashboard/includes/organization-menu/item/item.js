import { Template } from 'meteor/templating';

import { organizationChanged } from '/imports/client/store/actions/organizationsActions';

Template.Organization_Menu_Item.viewmodel({
  mixin: ['router', 'store'],
  serialNumber: '',
  regex() {
    return `^\\/${this.serialNumber()}`;
  },
  selectOrg(e) {
    e.preventDefault();

    const selectedOrganizationSerialNumber = this.serialNumber();

    this.dispatch(organizationChanged);

    localStorage.setItem(`${Meteor.userId()}: selectedOrganizationSerialNumber`, selectedOrganizationSerialNumber);

    this.goToDashboard(selectedOrganizationSerialNumber);
  },
});
