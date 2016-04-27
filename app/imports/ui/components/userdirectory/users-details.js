import { Template } from 'meteor/templating';

import {Organizations} from '/imports/api/organizations/organizations.js';

Template.UsersDetails.viewmodel({
  activeUser() {
    const userId = this.parent().activeUser();
    return Meteor.users.findOne({ _id: userId });
  },
  initials(user) {
    const { firstName='', lastName='' } = user.profile;
    let initials = '';
    if (firstName) {
      initials += firstName.charAt(0);
    }
    
    if (lastName) {
      initials += lastName.charAt(0);
    }
    
    return initials.toUpperCase(); 
  },
  email(user) {
    return user.emails[0].address;
  },
  address(user) {
    const { address='' } = user.profile;
    return address;
  },
  organization() {
    const serialNumber = Number(FlowRouter.getParam('orgSerialNumber'));
    return Organizations.findOne({ serialNumber });
  }
});