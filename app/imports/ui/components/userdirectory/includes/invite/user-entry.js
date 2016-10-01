import { Template } from 'meteor/templating';
import { AvatarPlaceholders } from '/imports/api/constants.js'

Template.UserDirectory_InviteUsers_UserEntry.viewmodel({
  email: '',

  randomAvatarUrl() {
    return AvatarPlaceholders[this.avatarIndex()];
  }
});
