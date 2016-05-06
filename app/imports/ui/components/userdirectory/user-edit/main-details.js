import { Slingshot } from 'meteor/edgee:slingshot';

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
  uploadAvatarFile() {
    const uploader = new Slingshot.Upload('usersAvatars');

    uploader.send(this.avatarFile(), (err, downloadUrl) => {
      if (err) {
        alert(err);
        console.log(err);
        return;
      }

      this.callMethod(updateProfile, {
        _id: this.userId(),
        avatar: downloadUrl
      });
    });
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
