import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Organizations } from '/imports/api/organizations/organizations.js';
import { remove } from '/imports/api/users/methods.js';
import { OrgCurrencies } from '/imports/api/constants.js';


Template.HelloPage.viewmodel({
  mixin: ['router', 'modal'],
  onCreated(template) {
    template.autorun(() => {
      const currentUser = Meteor.user();
      const organizationsHandle = template.subscribe('currentUserOrganizations');
      if (!Meteor.loggingIn() && organizationsHandle.ready()) {
        if (currentUser) {
          if (Organizations.find({ 'users.userId': currentUser._id })) {
            // if the user is an owner of organization go to that organization no matter what
            const ownerOrg = Organizations.findOne({ 'users': { $elemMatch: { userId: currentUser._id, role: 'owner' } } });
            if (!!ownerOrg) {
              this.goToDashboard(ownerOrg.serialNumber);
            } else {
              const { selectedOrganizationSerialNumber } = currentUser;
              const orgExists = !!Organizations.findOne({ serialNumber: selectedOrganizationSerialNumber });
              if (selectedOrganizationSerialNumber && orgExists) {
                this.goToDashboard(selectedOrganizationSerialNumber);
              } else {
                const org = Organizations.findOne({ 'users.userId': currentUser._id });
                !!org && this.goToDashboard(org.serialNumber);
              }
            }
          }
        } else {
          FlowRouter.go('signIn');
        }
      }
    });
  },
  openCreateNewOrgModal(e) {
    e.preventDefault();

    this.modal().open({
      template: 'OrganizationCreate',
      title: 'New organization',
      variation: 'save',
      ownerName: Meteor.user().fullName(),
      currency: OrgCurrencies.GBP
    });
  },
  deleteAccount(e) {
    e.preventDefault();

    swal({
      title: 'Are you sure?',
      text: `Your account will be deleted permanently!`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      closeOnConfirm: false
    }, () => {
      remove.call({}, (err) => {
        if (err) {
          swal('Oops... Something went wrong!', err.reason, 'error');
        } else {
          swal(
            'Removed!',
            `Your account was removed successfully!`,
            'success'
          );
        }
      });
    });
  }
});
