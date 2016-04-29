import { updateProfile, updateEmail } from '/imports/api/users/methods.js';


Template.UserEdit_MainDetails.viewmodel({
  mixin: ['editableModalSection'],
  isChanged(vmField, contextField) {
    contextField = contextField || vmField;

    const val = this[vmField]();
    const savedVal = this.templateInstance.data[contextField];

    return val && val !== savedVal;
  },
  updateFirstName() {
    if (this.isChanged('firstName')) {
      this.callMethod(updateProfile, {
        firstName: this.firstName()
      });
    }
  },
  updateLastName() {
    if (this.isChanged('lastName')) {
      this.callMethod(updateProfile, {
        lastName: this.lastName()
      });
    }
  },
  updateInitials() {
    if (this.isChanged('initials')) {
      this.callMethod(updateProfile, {
        initials: this.initials()
      });
    }
  },
  updateEmail() {
    if (this.isChanged('email')) {
      this.callMethod(updateEmail, {
        email: this.email()
      });
    }
  },
  updateDescription() {
    if (this.isChanged('description')) {
      this.callMethod(updateProfile, {
        description: this.description()
      });
    }
  }
});
