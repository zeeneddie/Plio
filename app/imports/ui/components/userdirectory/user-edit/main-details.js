import { Template } from 'meteor/templating';


Template.UserEdit_MainDetails.viewmodel({
  mixin: ['clearableField'],
  avatarFile: null,
  isPropChanged(propName, newVal) {
    const savedVal = this.templateInstance.data[propName];
    return newVal && newVal !== savedVal;
  },
  updateFirstName(e) {
    const firstName = this.getData().firstName;
    if (this.isPropChanged('firstName', firstName)) {
      this.callWithFocusCheck(e, () => {
        this.parent().updateProfile('firstName', firstName);
      });
    }
  },
  updateLastName(e) {
    const lastName = this.getData().lastName;
    if (this.isPropChanged('lastName', lastName)) {
      this.callWithFocusCheck(e, () => {
        this.parent().updateProfile('lastName', lastName);
      });
    }
  },
  updateInitials(e) {
    const initials = this.getData().initials;
    if (this.isPropChanged('initials', initials)) {
      this.callWithFocusCheck(e, () => {
        this.parent().updateProfile('initials', initials);
      });
    }
  },
  updateDescription(e) {
    const description = this.getData().description;
    if (this.isPropChanged('description', description)) {
      this.callWithFocusCheck(e, () => {
        this.parent().updateProfile('description', description);
      });
    }
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
      initials: this.initials().toUpperCase(),
      description: this.description(),
      avatar: this.avatar()
    };
  }
});
