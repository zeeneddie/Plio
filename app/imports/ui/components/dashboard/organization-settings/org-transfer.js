import { Template } from 'meteor/templating';
import { Organizations } from '/imports/api/organizations/organizations.js';
import { UserMembership } from '/imports/api/constants.js';


Template.OrganizationSettings_OrgTransfer.viewmodel({
  mixin: ['organization', 'user', 'search', 'date'],
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
    return this.isOrgOwner() && !this.invitationSent();
  },
  isButtonEnabled() {
    return _.every([
      this.isOrgOwner(),
      !!this.ownerId(),
      !this.invitationSent(),
      this.ownerId() !== this.templateInstance.data.ownerId
    ]);
  },
  dataToggleAttr() {
    return this.isInputEnabled() ? 'dropdown' : '';
  },
  transfer() {
    return this.organization() && this.organization().transfer;
  },
  invitationSent() {
    const transfer = this.transfer();
    return !!(transfer && transfer._id && transfer.newOwnerId && transfer.createdAt);
  },
  invitationSentText() {
    const transfer = this.transfer();
    const date = transfer && transfer.createdAt;
    const newOwnerId = transfer && transfer.newOwnerId;

    const newOwner = Meteor.users.findOne({
      _id: newOwnerId
    });

    if (!newOwner || !date) {
      return '';
    }

    const userName = newOwner.fullNameOrEmail();
    const formattedDate = this.renderDate(date);
    return `You’ve sent an invitation to transfer ownership to ${userName} on ${formattedDate}`;
  },
  cancelOrgTransfer() {
    this.parent().cancelOrgTransfer();
  }
});
