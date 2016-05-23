import { Template } from 'meteor/templating';
import { CountryCodes } from '/imports/api/country-codes.js';


Template.UserEdit_ContactDetails.viewmodel({
  mixin: ['collapse', 'modal', 'clearableField'],
  updateAddress() {
    this.parent().updateProfile('address', this);
  },
  updateSkype() {
    this.callWithFocusCheck(() => {
      this.parent().updateProfile('skype', this);
    });
  },
  updateCountry() {
    this.parent().updateProfile('country', this);
  },
  updatePhoneNumber(viewModel) {
    this.parent().updatePhoneNumber(viewModel);
  },
  addPhoneNumber(viewModel) {
    this.parent().addPhoneNumber(viewModel);
  },
  isEditable() {
    return this.parent().isEditable();
  },
  countries() {
    return CountryCodes.getList();
  },
  getData() {
    return {
      address: this.address(),
      skype: this.skype(),
      country: this.country(),
      phoneNumbers: this.child('UserEdit_PhoneNumbers').getData()
    };
  }
});
