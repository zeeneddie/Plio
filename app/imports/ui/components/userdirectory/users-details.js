import { Template } from 'meteor/templating';

Template.UsersDetails.viewmodel({
  activeUser() {
    return this.parent().activeUser();
  },
  openEditUserModal(e) {
    e.preventDefault();
    ModalManager.open('UserEdit', {
      userId: this.user()._id
    });
  }
});
