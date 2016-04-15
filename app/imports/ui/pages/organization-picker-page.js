import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { Organizations } from '/imports/api/organizations/organizations.js';

Template.OrganizationPickerPage.helpers({
  organizations() {
    return Organizations.find({'users.userId': Meteor.userId()});
  }
});
