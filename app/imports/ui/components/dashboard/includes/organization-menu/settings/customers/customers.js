import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Organizations } from '/imports/share/collections/organizations.js';
import { UserMembership } from '/imports/share/constants.js';

Template.CustomersSettings.viewmodel({
  mixin: ['date'],
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
  organizations() {
    const organizations = Organizations.find({}, { sort: { createdAt: 1 } }).fetch();

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
