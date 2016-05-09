import { ViewModel } from 'meteor/manuel:viewmodel';
import { Blaze } from 'meteor/blaze';


Template.UserEdit_PhoneNumbers.viewmodel({
  mixin: ['addForm'],
  addPhoneForm() {
    this.addForm('UserEdit_PhoneNumber');
  },
  phoneNumbersData() {
    return _.map(this.phoneNumbers(), ({ number, type }, index) => {
      return { number, type, index };
    });
  },
  onChangeCb() {
    return this.onChange.bind(this);
  },
  onChange(viewModel) {
    if (viewModel.index) {
      this.parent().updatePhoneNumber(viewModel);
    } else {
      this.parent().addPhoneNumber(viewModel);
    }
  }
});
