import { Template } from 'meteor/templating';
import { CountryCodes } from '/imports/api/country-codes.js';
import get from 'lodash.get';

Template.UserEdit_ContactDetails.viewmodel({
  mixin: ['collapse', 'callWithFocusCheck', 'userEdit'],
  address: '',
  country: '',
  skype: '',
  phoneNumbers: [],
  isTextPresent() {
    return this.address() || this.skype() || get(this.phoneNumbers(), 'length');
  },
  updateAddress(e) {
    this.updateProfileProperty(e, 'address', true);
  },
  updateSkype(e) {
    this.updateProfileProperty(e, 'skype', true);
  },
  updateCountry(e) {
    this.updateProfileProperty(e, 'country');
  },
  updatePhoneNumber(viewModel, cb) {
    this.parent().updatePhoneNumber(viewModel, cb);
  },
  addPhoneNumber(viewModel, cb) {
    this.parent().addPhoneNumber(viewModel, cb);
  },
  removePhoneNumber(viewModel, cb) {
    this.parent().removePhoneNumber(viewModel, cb);
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
      phoneNumbers: this.child('UserEdit_PhoneNumbers').getData(),
    };
  },
});
