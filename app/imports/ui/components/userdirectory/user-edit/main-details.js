import { Template } from 'meteor/templating';


Template.UserEdit_MainDetails.viewmodel({
  mixin: ['modal', 'clearableField'],
  avatarFile: null,
  updateFirstName() {
    this.callWithFocusCheck(() => {
      this.parent().updateProfile('firstName', this);
    });
  },
  updateLastName() {
    this.callWithFocusCheck(() => {
      this.parent().updateProfile('lastName', this);
    });
  },
  updateInitials() {
    this.callWithFocusCheck(() => {
      this.parent().updateProfile('initials', this);
    });
  },
  updateDescription() {
    this.callWithFocusCheck(() => {
      this.parent().updateProfile('description', this);
    });
  },
  updateAvatar() {
    this.parent().uploadAvatarFile(this);
  },
  updateEmail() {
    this.callWithFocusCheck(() => {
      this.parent().updateEmail(this);
    });
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
