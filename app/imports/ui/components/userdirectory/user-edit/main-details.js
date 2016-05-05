import { updateProfile, updateEmail } from '/imports/api/users/methods.js';


Template.UserEdit_MainDetails.viewmodel({
  mixin: ['editableModalSection', 'userEditSection'],
  updateProfile(prop) {
    if (this.isPropChanged(prop)) {
      this.callMethod(updateProfile, {
        _id: this.userId(),
        [prop]: this.getData()[prop]
      });
    }
  },
  updateEmail() {
    if (this.isPropChanged('email')) {
      this.callMethod(updateEmail, {
        _id: this.userId(),
        email: this.getData().email
      });
    }
  },
  updateFirstName() {
    this.updateProfile('firstName');
  },
  updateLastName() {
    this.updateProfile('lastName');
  },
  updateInitials() {
    this.updateProfile('initials');
  },
  updateDescription() {
    this.updateProfile('description');
  },
  getData() {
    return {
      email: this.email(),
      firstName: this.firstName(),
      lastName: this.lastName(),
      initials: this.initials().toUpperCase(),
      description: this.description()
    };
  }
});
