import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Organizations } from '/imports/api/organizations/organizations.js';
import { UserMembership } from '/imports/api/constants.js';

Template.CustomersSettings.viewmodel({
  mixin: ['date'],

  organizations() {
    Meteor.subscribe('organizationsInfo');

    const organizations = Organizations.find().fetch();

    return organizations.map(({ name, users, createdAt }) => {
      const owner = _.find(users, ({ role }) => {
        return role === UserMembership.ORG_OWNER;
      });
      const ownerDetail = Meteor.users.findOne({ _id: owner.userId })
      const { firstName, lastName } = ownerDetail.profile;

      return {
        name,
        createdAt,
        countUsers: users.length,
        owner: {
          name: `${firstName} ${lastName}`,
          email: _.first(ownerDetail.emails).address,
        }
      }
    });
  }
});
