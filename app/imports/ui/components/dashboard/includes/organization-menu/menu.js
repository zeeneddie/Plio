import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import moment from 'moment-timezone';

import { Organizations } from '/imports/api/organizations/organizations.js';
import { OrgCurrencies } from '/imports/api/constants.js';
import { isPlioUser } from '/imports/api/checkers.js';


Template.Organization_Menu.viewmodel({
  mixin: ['modal', 'organization', 'roles'],

  isPlioUser,
  autorun() {
    this.templateInstance.subscribe('currentUserOrganizations');
  },
  organizations() {
    return Organizations.find({ 'users.userId': Meteor.userId() });
  },
  openOrgSettings(e) {
    e.preventDefault();

    this.modal().open({
      template: 'OrgSettings',
      _title: 'Organization settings',
      organizationId: this.organization()._id
    });
  },
  openCustomersSettings(e) {
    e.preventDefault();

    this.modal().open({
      template: 'CustomersSettings',
      _title: 'Plio customers',
      organizationId: this.organization()._id
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
  }
});
