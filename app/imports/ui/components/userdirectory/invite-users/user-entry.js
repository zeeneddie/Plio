import { Template } from 'meteor/templating';

Template.UserDirectory_InviteUsers_UserEntry.viewmodel({
  email: '',
  randomAvatarUrl() {
    return `/avatars/avatar-placeholder-${this.avatarIndex()}.png`;
  }
});