import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { Organizations } from '/imports/api/organizations/organizations.js';
import { insert } from '/imports/api/organizations/methods.js';

Template.OrganizationsMenu.helpers({
  organizations() {
    return Organizations.find({ 'users.userId': Meteor.userId() });
  },
  regex() {
    return `^\\/organizations/${this._id}`;
  }
});

Template.OrganizationsMenu.viewmodel({
  orgName: '',
  save(e) {
    const $modal = this.child('ModalWindow').modal;
    const orgName = this.orgName();
    if (!orgName) {
      toastr.error('Organization name cannot be empty!');
      return;
    }
    insert.call({ name: orgName }, (err, _id) => {
      if (err) {
        toastr.error(`Could not create new organization:<br>${err.reason}`);
      } else {
        FlowRouter.go('dashboardPage', { _id });
        $modal.modal('hide');
      }
    });
  }
});
