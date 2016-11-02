import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Organizations } from '/imports/share/collections/organizations.js';
import { UserMembership } from '/imports/share/constants.js';
import { deleteCustomerOrganization } from '/imports/api/organizations/methods';
import { isPlioAdmin } from '/imports/api/checkers';


Template.CustomersSettings.viewmodel({
  mixin: ['date', 'organization'],
  _subHandlers: [],
  isReady: false,

  autorun: [
    function() {
      const _subHandlers = [
        this.templateInstance.subscribe('organizationsInfo')
      ];

      this._subHandlers(_subHandlers);
    },
    function() {
      this.isReady(this._subHandlers().every(handle => handle.ready()));
    }
  ],
  isPlioAdmin() {
    return isPlioAdmin(Meteor.userId());
  },
  organizations() {
    const organizations = Organizations.find({
      isAdminOrg: { $ne: true }
    }, {
      sort: { createdAt: 1 },
      fields: {
        name: 1,
        createdAt: 1,
        'users.userId': 1,
        'users.role': 1
      }
    });

    return organizations.map(({ _id, name, users, createdAt }) => {
      const owner = _.find(users, ({ role }) => {
        return role === UserMembership.ORG_OWNER;
      });

      const ownerDetail = Meteor.users.findOne({
        _id: owner.userId
      }, {
        fields: {
          emails: 1,
          'profile.firstName': 1,
          'profile.lastName': 1,
        }
      });

      const { firstName, lastName } = ownerDetail.profile;

      return {
        _id,
        name,
        createdAt,
        countUsers: users.length,
        owner: {
          name: `${firstName} ${lastName}`,
          email: _.first(ownerDetail.emails).address,
        }
      }
    });
  },
  deleteOrganization({ organizationId, password }, cb) {
    deleteCustomerOrganization.call({ organizationId, adminPassword: password }, cb);
  },
  deleteOrganizationFn() {
    return this.deleteOrganization.bind(this);
  }
});
