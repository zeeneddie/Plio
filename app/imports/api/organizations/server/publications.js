import { Meteor } from 'meteor/meteor';
import { Organizations } from '../organizations.js';

Meteor.publish(null, function() {
  return Organizations.find({ 'users.userId': this.userId });
});
