import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Organizations } from '/imports/api/organizations/organizations.js';
import { update } from '/imports/api/users/methods.js';

Template.OrganizationsMenu.onCreated(function() {
  this.autorun(() => this.subscribe('currentUserOrganizations'));
});

Template.OrganizationsMenu.helpers({
  organization() {
    const serialNumber = Number(FlowRouter.getParam('orgSerialNumber'));
    return Organizations.findOne({ serialNumber });
  },
  organizations() {
    return Organizations.find({ 'users.userId': Meteor.userId() });
  },
  regex() {
    return `^\\/${this.serialNumber}`;
  }
});

Template.OrganizationsMenu.events({
  'click .org-settings-modal-link'(e, tpl) {
    ModalManager.open('OrganizationSettings');
  },
  'click .js-org-select'(e, tpl) {
    e.preventDefault();

    const selectedOrganizationSerialNumber = Blaze.getData(e.target).serialNumber;

    update.call({ selectedOrganizationSerialNumber }, (err) => {
      if (err) {
        toastr.error(err.reason);
      }
    });

    FlowRouter.go('dashboardPage', { orgSerialNumber: selectedOrganizationSerialNumber });
  }
});
