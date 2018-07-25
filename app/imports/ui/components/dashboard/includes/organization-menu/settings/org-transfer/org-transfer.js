import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import get from 'lodash.get';

import { isOrgOwner } from '/imports/api/checkers';


Template.OrgSettings_OrgTransfer.viewmodel({
  mixin: ['organization', 'user', 'date', 'utils'],
  isTransferMode: false,
  newOwnerId: '',
  placeholder: 'Select new organization owner',
  selectFirstIfNoSelected: false,
  ownerId() { return Meteor.userId(); },
  owner() {
    const owner = Meteor.users.findOne({ _id: this.ownerId() });
    return owner ? owner.fullNameOrEmail() : '';
  },
  selectArgs() {
    const {
      newOwnerId: value,
      placeholder,
      selectFirstIfNoSelected,
    } = this.data();

    const disabled = !this.isInputEnabled();

    const { users: orgMembersData } = this.organization() || {};
    const filteredUsers = _(orgMembersData)
      .filter(user => user.userId !== this.ownerId() && user.isRemoved === false);

    const membersIds = _.pluck(filteredUsers, 'userId');

    return {
      value,
      placeholder,
      selectFirstIfNoSelected,
      disabled,
      query: { _id: { $in: membersIds } },
      onUpdate: (viewmodel) => {
        const { selected: ownerId } = viewmodel.getData();

        return this.newOwnerId(ownerId);
      },
    };
  },
  transferOrg(e) {
    e.stopPropagation();
    this.parent().transferOrg(this.newOwnerId());
  },
  isOrgOwner() {
    return isOrgOwner(Meteor.userId(), this.organizationId());
  },
  isInputEnabled() {
    return this.isOrgOwner() && !this.invitationSent();
  },
  isTransferButtonEnabled() {
    return _.every([
      this.isOrgOwner(),
      !!this.newOwnerId(),
      !this.invitationSent(),
      this.newOwnerId() !== this.ownerId(),
    ]);
  },
  transfer() {
    return get(this.organization(), 'transfer');
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
      _id: newOwnerId,
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
  },
});
