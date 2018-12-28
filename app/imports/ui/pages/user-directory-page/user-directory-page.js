import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/underscore';

import { Organizations } from '../../../share/collections/organizations.js';

Template.UserDirectory_Page.viewmodel({
  share: 'search',
  mixin: ['search', 'organization'],
  autorun() {
    const userIds = this.getCurrentOrganizationUsers();
    const organizationId = this.organizationId();
    if (userIds && userIds.length) {
      const organizationUsersHandle = Meteor.subscribe(
        'organizationUsers',
        userIds,
        organizationId,
      );
      if (!this.activeUser() && organizationUsersHandle.ready()) {
        FlowRouter.redirect(FlowRouter.path('userDirectoryUserPage', {
          orgSerialNumber: this.organizationSerialNumber(),
          userId: this.organizationUsers().fetch()[0]._id,
        }, {
          backRoute: FlowRouter.getQueryParam('backRoute'),
        }));
      }
    }
  },
  user() {
    return this.activeUser() && Meteor.users.findOne({ _id: this.activeUser() });
  },
  activeUser() {
    return FlowRouter.getParam('userId') || null;
  },

  // eslint-disable-next-line consistent-return
  organizationUsers() {
    const userIds = this.getCurrentOrganizationUsers();
    const findQuery = {};
    const searchFields = [
      { name: 'profile.firstName' },
      { name: 'profile.lastName' },
      { name: 'profile.description' },
      { name: 'emails.0.address' },
      { name: 'profile.skype' },
      { name: 'profile.address' },
      { name: 'profile.initials' },
      { name: 'profile.country' },
      { name: 'profile.phoneNumbers', subField: 'number' },
    ];

    const searchUsers = this.searchObject('searchText', searchFields);

    findQuery.$and = [
      { _id: { $in: userIds } },
      { ...searchUsers },
    ];

    const cursor = Meteor.users.find(findQuery, {
      sort: { 'profile.firstName': 1, 'emails.0.address': 1 },
    });

    const result = _.pluck(cursor.fetch(), '_id');

    if (result.length) {
      this.activeUser(result[0]);

      return cursor;
    }
    this.activeUser(null);
  },

  getCurrentOrganizationUsers() {
    const organization = Organizations.findOne({
      serialNumber: this.organizationSerialNumber(),
    });

    if (organization) {
      const { users } = organization;
      const existingUsersIds = _.filter(users, (usrDoc) => {
        const { isRemoved, removedBy, removedAt } = usrDoc;
        return !isRemoved && !removedBy && !removedAt;
      });

      return _.pluck(existingUsersIds, 'userId');
    }
    return [];
  },
});
