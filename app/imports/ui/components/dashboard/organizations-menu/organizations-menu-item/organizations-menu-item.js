import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { selectOrganization } from '/imports/api/users/methods.js';

Template.OrganizationsMenuItem.viewmodel({
  regex() {
    return `^\\/${this.serialNumber()}`;
  },
  selectOrg(e) {
    e.preventDefault();

    const selectedOrganizationSerialNumber = this.serialNumber();

    selectOrganization.call({ selectedOrganizationSerialNumber }, (err) => {
      if (err) {
        toastr.error(err.reason);
      }
    });

    FlowRouter.go('dashboardPage', { orgSerialNumber: selectedOrganizationSerialNumber });
  }
});
