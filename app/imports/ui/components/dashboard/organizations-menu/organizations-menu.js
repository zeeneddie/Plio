import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import moment from 'moment-timezone';

import { Organizations } from '/imports/api/organizations/organizations.js';
import { OrgCurrencies } from '/imports/api/constants.js';


Template.OrganizationsMenu.viewmodel({
  mixin: ['modal', 'organization', 'roles'],
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
      _title: 'Org Settings',
      organizationId: this.organization()._id
    });
  },
  openCreateNewOrgModal(e) {
    e.preventDefault();
    this.modal().open({
      template: 'OrganizationCreate',
      _title: 'New organization',
      variation: 'save',
      timezone: moment.tz.guess(),
      ownerName: Meteor.user().fullName(),
      currency: OrgCurrencies.GBP
    });
  }
});
