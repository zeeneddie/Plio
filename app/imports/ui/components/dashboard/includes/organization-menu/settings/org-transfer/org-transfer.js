import { Template } from 'meteor/templating';
import get from 'lodash.get';

import { Organizations } from '/imports/share/collections/organizations.js';
import { UserMembership } from '/imports/share/constants.js';
import { isOrgOwner } from '/imports/api/checkers.js';


Template.OrgSettings_OrgTransfer.viewmodel({
  mixin: ['organization', 'user', 'date', 'utils'],
  inputText: '',
  ownerId: Meteor.userId(),
  placeholder: 'Org owner',
  selectFirstIfNoSelected: true,
  selectArgs() {
    const {
      ownerId:value,
      placeholder,
      selectFirstIfNoSelected
    } = this.data();

    const disabled = !this.isInputEnabled();

    return {
      value,
      placeholder,
      selectFirstIfNoSelected,
      disabled,
      onUpdate: (viewmodel) => {
        const { selected:ownerId } = viewmodel.getData();

        return this.ownerId(ownerId);
      }
    };
  },
  transferOrg(e) {
    e.stopPropagation();
    this.parent().transferOrg(this.ownerId());
  },
  isOrgOwner() {
    return isOrgOwner(Meteor.userId(), this.organizationId());
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
