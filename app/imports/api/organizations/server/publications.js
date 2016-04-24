import { Meteor } from 'meteor/meteor';
import { Organizations } from '../organizations.js';

Meteor.publish("currentUserOrganizations", function() {
  return Organizations.find({ 'users.userId': this.userId });
});
