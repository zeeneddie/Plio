import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import moment from 'moment-timezone';

import { Organizations } from '/imports/share/collections/organizations.js';
import { OrgCurrencies } from '/imports/share/constants.js';
import { OrganizationSettingsHelp } from '/imports/api/help-messages.js';


Template.Organization_Menu.viewmodel({
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
      _title: 'Organization settings',
      organizationId: this.organization()._id
    });
  },
  openCreateNewOrgModal(e) {
    e.preventDefault();
    this.modal().open({
      template: 'Organizations_Create',
      _title: 'New organization',
      helpText: OrganizationSettingsHelp.organizationSettings,
      variation: 'save',
      timezone: moment.tz.guess(),
      ownerName: Meteor.user().fullName(),
      currency: OrgCurrencies.GBP
    });
  }
});
