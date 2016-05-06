import { PhoneTypes } from '/imports/api/constants.js';


Template.UserEdit_PhoneNumber.viewmodel({
  phoneTypes() {
    return _.values(PhoneTypes);
  }
});
