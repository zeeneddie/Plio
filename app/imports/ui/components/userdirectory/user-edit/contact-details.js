import { Template } from 'meteor/templating';
import { CountryCodes } from '/imports/api/country-codes.js';


Template.UserEdit_ContactDetails.viewmodel({
  mixin: ['collapse', 'clearableField'],
  isPropChanged(propName, newVal) {
    const savedVal = this.templateInstance.data[propName];
    return newVal && newVal !== savedVal;
  },
  updateAddress() {
    const address = this.getData().address;
    if (this.isPropChanged('address', address)) {
      this.parent().updateProfile('address', address);
    }
  },
  updateSkype(e) {
    const skype = this.getData().skype;
    if (this.isPropChanged('skype', skype)) {
      this.callWithFocusCheck(e, () => {
        this.parent().updateProfile('skype', skype);
      });
    }
  },
  updateCountry() {
    const country = this.getData().country;
    if (this.isPropChanged('country', country)) {
      this.parent().updateProfile('country', country);
    }
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
