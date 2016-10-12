import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import moment from 'moment-timezone';

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
            const selectedOrganizationSerialNumber = localStorage.getItem(`${Meteor.userId()}: selectedOrganizationSerialNumber`);
            const serialNumber = parseInt(selectedOrganizationSerialNumber, 10);
            const orgExists = !!Organizations.findOne({ serialNumber });

            if (serialNumber && orgExists) {
              this.goToDashboard(serialNumber);
            } else {
              const org = Organizations.findOne({ 'users.userId': currentUser._id });
              !!org && this.goToDashboard(org.serialNumber);
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
      template: 'Organizations_Create',
      _title: 'New organization',
      variation: 'save',
      timezone: moment.tz.guess(),
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
