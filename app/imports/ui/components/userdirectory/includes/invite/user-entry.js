import { Template } from 'meteor/templating';
import { AvatarPlaceholders } from '/imports/api/constants.js'

Template.UserDirectory_InviteUsers_UserEntry.viewmodel({
  email: '',

  inputName() {
    return `invite-user-email-${this.avatarIndex()}`;
  },

  randomAvatarUrl() {
    return AvatarPlaceholders[this.avatarIndex()];
  }
});
