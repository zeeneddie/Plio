import { Template } from 'meteor/templating';


Template.UserEdit_MainDetails.viewmodel({
  mixin: ['callWithFocusCheck', 'userEdit'],
  avatarFile: null,
  updateFirstName(e) {
    this.updateProfileProperty(e, 'firstName', true);
  },
  updateLastName(e) {
    this.updateProfileProperty(e, 'lastName', true);
  },
  updateInitials(e) {
    this.updateProfileProperty(e, 'initials', true);
  },
  updateDescription(e) {
    this.updateProfileProperty(e, 'description', true);
  },
  updateAvatar() {
    this.parent().uploadAvatarFile(this);
  },
  updateEmail(e) {
    const email = this.getData().email;
    if (this.isPropChanged('email', email)) {
      this.callWithFocusCheck(e, () => {
        this.parent().updateEmail(email);
      });
    }
  },
  isEditable() {
    return this.parent().isEditable();
  },
  getData() {
    return {
      email: this.email(),
      firstName: this.firstName(),
      lastName: this.lastName(),
      initials: this.initials() && this.initials().toUpperCase(),
      description: this.description(),
      avatar: this.avatar(),
    };
  },
});
