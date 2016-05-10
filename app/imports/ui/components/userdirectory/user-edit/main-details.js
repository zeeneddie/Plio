import { Template } from 'meteor/templating';


Template.UserEdit_MainDetails.viewmodel({
  avatarFile: null,
  updateFirstName() {
    this.parent().updateProfile('firstName', this);
  },
  updateLastName() {
    this.parent().updateProfile('lastName', this);
  },
  updateInitials() {
    this.parent().updateProfile('initials', this);
  },
  updateDescription() {
    this.parent().updateProfile('description', this);
  },
  updateAvatar() {
    this.parent().uploadAvatarFile(this);
  },
  updateEmail() {
    this.parent().updateEmail(this);
  },
  isEditable() {
    return this.parent().isEditable();
  },
  getData() {
    return {
      email: this.email(),
      firstName: this.firstName(),
      lastName: this.lastName(),
      initials: this.initials().toUpperCase(),
      description: this.description(),
      avatar: this.avatar()
    };
  }
});
