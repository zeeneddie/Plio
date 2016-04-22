import { Meteor } from 'meteor/meteor';
import { StandardTypes } from '../standardTypes.js';

Meteor.publish(null, function() {
  return StandardTypes.find({});
});
