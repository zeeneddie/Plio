import { Template } from 'meteor/templating';

Template.Subcards_Notify_Read.viewmodel({
  mixin: 'user',
  users: '',
  renderNotifyUsers() {
    return this.users().map(user => this.userNameOrEmail(user)).join(', ');
  },
});
