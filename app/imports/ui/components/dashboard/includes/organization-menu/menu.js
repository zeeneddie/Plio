import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import moment from 'moment-timezone';

import { isPlioUser } from '/imports/api/checkers';
import { Organizations } from '/imports/share/collections/organizations';
import { OrgCurrencies } from '/imports/share/constants';
import { OrganizationSettingsHelp } from '/imports/api/help-messages';
import { createOrgQueryWhereUserIsMember } from '../../../../../share/mongo/queries';

Template.Organization_Menu.viewmodel({
  mixin: ['modal', 'organization', 'roles'],
  onCreated(template) {
    template.autorun(() => {
      template.subscribe('currentUserOrganizations');
    });
  },
  organizations() {
    const userId = Meteor.userId();
    const query = createOrgQueryWhereUserIsMember(userId);

    return Organizations.find(query);
  },
  haveCustomerAccess() {
    return isPlioUser(Meteor.userId());
  },
  async openOrgSettings(e) {
    e.preventDefault();

    await import('./settings');

    this.modal().open({
      template: 'OrgSettings',
      _title: 'Organization settings',
      helpText: OrganizationSettingsHelp.organizationSettings,
      organizationId: this.organization()._id,
    });
  },
  async openCreateNewOrgModal(e) {
    e.preventDefault();

    await import('./settings');

    this.modal().open({
      template: 'Organizations_Create',
      _title: 'New organization',
      variation: 'save',
      timezone: moment.tz.guess(),
      ownerName: Meteor.user().fullName(),
      currency: OrgCurrencies.GBP,
    });
  },
});
