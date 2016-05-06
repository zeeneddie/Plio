import { Meteor } from 'meteor/meteor';
import { Standards } from '../standards.js';

Meteor.publish(null, function() {
  return Standards.find({});
});
