import { CountryCodes } from 'meteor/3stack:country-codes';

import { updateProfile } from '/imports/api/users/methods.js';


Template.UserEdit_ContactDetails.viewmodel({
  mixin: ['editableModalSection', 'userEditSection', 'collapse'],
  updateProfile(prop) {
    if (this.isPropChanged(prop)) {
      this.callMethod(updateProfile, {
        _id: this.userId(),
        [prop]: this.getData()[prop]
      });
    }
  },
  updateAddress() {
    this.updateProfile('address');
  },
  updateSkype() {
    this.updateProfile('skype');
  },
  updateCountry() {
    this.updateProfile('country');
  },
  countries() {
    return _.map(CountryCodes.getList(), (val, key) => {
      return {
        code: key,
        name: val
      };
    });
  },
  getData() {
    return {
      address: this.address(),
      skype: this.skype(),
      country: this.country()
    };
  }
});
