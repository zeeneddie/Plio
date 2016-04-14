import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { ViewModel } from 'meteor/manuel:viewmodel';

import { insert } from '/imports/api/organizations/methods.js';

Template.NewOrganizationForm.viewmodel({
  orgName: '',
  save() {
    const orgName = this.orgName();
    const $modal = ViewModel.findOne('ModalWindow').modal;

    if (!orgName) {
      toastr.error('Organization name cannot be empty!');
      return;
    }

    insert.call({ name: orgName }, (err, _id) => {
      if (err) {
        toastr.error(`Could not create new organization:<br>${err.reason}`);
      } else {
        FlowRouter.go('dashboardPage', { _id });
      }

      $modal.modal('hide');
      this.orgName('');
    });
  }
});
