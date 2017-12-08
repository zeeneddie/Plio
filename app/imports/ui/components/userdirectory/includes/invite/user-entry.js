import { Template } from 'meteor/templating';
import { AvatarPlaceholders } from '/imports/share/constants.js';

Template.UserDirectory_InviteUsers_UserEntry.viewmodel({
  email: '',

  handleSubmit(e) {
    e.preventDefault();
  },
  randomAvatarUrl() {
    return AvatarPlaceholders[this.avatarIndex()];
  },
});
