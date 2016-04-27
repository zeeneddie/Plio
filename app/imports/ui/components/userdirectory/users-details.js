import { Template } from 'meteor/templating';

import {Organizations} from '/imports/api/organizations/organizations.js';

Template.UsersDetails.viewmodel({
  activeUser() {
    const userId = this.parent().activeUser();
    return Meteor.users.findOne({ _id: userId });
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