import { updateProfile, updateEmail } from '/imports/api/users/methods.js';


Template.UserEdit_MainDetails.viewmodel({
  mixin: ['editableModalSection'],
  updateProfile(doc) {
    _.extend(doc, { _id: this.userId() });
    this.callMethod(updateProfile, doc);
  },
  updateEmail() {
    if (this.isChanged('email')) {
      this.callMethod(updateEmail, {
        _id: this.userId(),
        email: this.email()
      });
    }
  },
  updateFirstName() {
    if (this.isChanged('firstName')) {
      this.updateProfile({
        firstName: this.firstName()
      });
    }
  },
  updateLastName() {
    if (this.isChanged('lastName')) {
      this.updateProfile({
        lastName: this.lastName()
      });
    }
  },
  updateInitials() {
    if (this.isChanged('initials')) {
      this.updateProfile({
        initials: this.initials()
      });
    }
  },
  updateDescription() {
    if (this.isChanged('description')) {
      this.updateProfile({
        description: this.description()
      });
    }
  }
});
