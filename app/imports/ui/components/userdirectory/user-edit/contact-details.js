import { CountryCodes } from 'meteor/3stack:country-codes';

import { updateProfile } from '/imports/api/users/methods.js';


Template.UserEdit_ContactDetails.viewmodel({
  mixin: ['editableModalSection', 'collapse'],
  updateProfile(doc) {
    _.extend(doc, { _id: this.userId() });
    this.callMethod(updateProfile, doc);
  },
  updateAddress() {
    if (this.isChanged('address')) {
      this.updateProfile({
        address: this.address()
      });
    }
  },
  updateSkype() {
    if (this.isChanged('skype')) {
      this.updateProfile({
        skype: this.skype()
      });
    }
  },
  updateCountry() {
    if (this.isChanged('country')) {
      this.updateProfile({
        country: this.country()
      });
    }
  },
  countries() {
    return _.map(CountryCodes.getList(), (val, key) => {
      return {
        code: key,
        name: val
      };
    });
  }
});
