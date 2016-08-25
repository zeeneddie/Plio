import { Template } from 'meteor/templating';

import { selectOrganization } from '/imports/api/users/methods.js';

Template.Organization_Menu_Item.viewmodel({
  mixin: 'router',
  serialNumber: '',
  regex() {
    return `^\\/${this.serialNumber()}`;
  },
  selectOrg(e) {
    e.preventDefault();

    const selectedOrganizationSerialNumber = this.serialNumber();

    selectOrganization.call({ selectedOrganizationSerialNumber }, (err) => {
      if (err) {
        console.log(err);
        swal('Oops... Something went wrong', err.reason, 'error');
      }
    });

    this.goToDashboard(selectedOrganizationSerialNumber);
  }
});
