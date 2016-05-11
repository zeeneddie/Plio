import { Template } from 'meteor/templating';

Template.UsersDetails.viewmodel({
  mixin: ['user', 'organization', 'modal'],
  phoneType(type) {
    return `${type} phone`;
  },
  superpowersTitle(user) {
    if(this.organization()) {
      return `${this.userFullNameOrEmail(user)}'s superpowers for ${this.organization().name}`
    }
  },
  openEditUserModal(e) {
    e.preventDefault();
    this.modal().open({
      template: 'UserEdit',
      title: 'Edit User',
      userId: this.currentUser()._id
    });
  }
});
