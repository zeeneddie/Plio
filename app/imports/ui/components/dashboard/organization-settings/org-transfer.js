import { Template } from 'meteor/templating';
import { Organizations } from '/imports/api/organizations/organizations.js';
import { UserMembership } from '/imports/api/constants.js';


Template.OrganizationSettings_OrgTransfer.viewmodel({
  mixin: ['organization', 'user', 'search'],
  ownerId: '',
  inputText: '',
  autorun: [
    function() {
      const orgOwner = Meteor.users.findOne({
        _id: this.ownerId()
      });
      this.inputText(orgOwner ? orgOwner.fullNameOrEmail() : '');
    }
  ],
  orgMembers() {
    const org = this.organization();
    if (!org) {
      return [];
    }

    const { users } = org;
    const existingUsersIds = _.filter(users, (usrDoc) => {
      const { isRemoved, removedBy, removedAt } = usrDoc;
      return !isRemoved && !removedBy && !removedAt;
    });

    const orgMembersIds = _.pluck(existingUsersIds, 'userId');

    const query = this.searchObject('inputText', [{
      name: 'profile.firstName'
    }, {
      name: 'profile.lastName'
    }, {
      name: 'emails.0.address'
    }]);

    query['_id'] = { $in: orgMembersIds };

    return Meteor.users.find(query, { sort: { 'profile.firstName': 1 } });
  },
  selectOwner(doc) {
    const { _id } = doc;
    this.ownerId(_id);
    this.ownerId.changed();
  },
  transferOrg(e) {
    e.stopPropagation();
    this.parent().transferOrg(this.ownerId());
  },
  clearInput() {
    this.inputText('');
  },
  restore() {
    Meteor.setTimeout(() => {
      this.ownerId.changed();
    }, 300);
  },
  isOrgOwner() {
    return !!Organizations.findOne({
      _id: this.organizationId(),
      users: {
        $elemMatch: {
          userId: Meteor.userId(),
          role: UserMembership.ORG_OWNER
        }
      }
    });
  },
  isInputEnabled() {
    return this.isOrgOwner();
  },
  isButtonEnabled() {
    return _.every([
      this.isOrgOwner(),
      !!this.ownerId(),
      this.ownerId() !== this.templateInstance.data.ownerId
    ]);
  },
  dataToggleAttr() {
    return this.isInputEnabled() ? 'dropdown' : '';
  }
});
