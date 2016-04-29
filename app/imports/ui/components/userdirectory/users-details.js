import { Template } from 'meteor/templating';

import {Organizations} from '/imports/api/organizations/organizations.js';

Template.UsersDetails.viewmodel({
  mixin: ['user', 'organization'],
  initials() {
    return this.user().profile.initials;
  },
  skype() {
    return this.user().profile.skype;
  }
});