Template.UserEdit_Password.viewmodel({
  mixin: 'collapse',
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
  isEditable() {
    return this.parent().isEditable();
  },
  changePassword() {
    this.parent().changePassword(this);
  },
  getData() {
    return {
      oldPassword: this.oldPassword(),
      newPassword: this.newPassword()
    };
  }
});
