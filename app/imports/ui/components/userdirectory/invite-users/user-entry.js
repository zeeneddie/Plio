import { Template } from 'meteor/templating';

Template.UserDirectory_InviteUsers_UserEntry.viewmodel({
  randomAvatarUrl() {
    const randomAvatar = Math.floor(Math.random() * 16) + 1;
    return `/avatars/avatar-placeholder-${randomAvatar}.png`;
  }
});