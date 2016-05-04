import { updateProfile, updateEmail } from '/imports/api/users/methods.js';


Template.UserEdit_MainDetails.viewmodel({
  mixin: ['editableModalSection'],
  isChanged(vmProperty, contextProperty) {
    contextProperty = contextProperty || vmProperty;

    const val = this[vmProperty]();
    const savedVal = this.templateInstance.data[contextProperty];

    return val && val !== savedVal;
  },
  updateFirstName() {
    if (this.isChanged('firstName')) {
      this.callMethod(updateProfile, {
        _id: this.userId(),
        firstName: this.firstName()
      });
    }
  },
  updateLastName() {
    if (this.isChanged('lastName')) {
      this.callMethod(updateProfile, {
        _id: this.userId(),
        lastName: this.lastName()
      });
    }
  },
  updateInitials() {
    if (this.isChanged('initials')) {
      this.callMethod(updateProfile, {
        _id: this.userId(),
        initials: this.initials()
      });
    }
  },
  updateEmail() {
    if (this.isChanged('email')) {
      this.callMethod(updateEmail, {
        _id: this.userId(),
        email: this.email()
      });
    }
  },
  updateDescription() {
    if (this.isChanged('description')) {
      this.callMethod(updateProfile, {
        _id: this.userId(),
        description: this.description()
      });
    }
  }
});
