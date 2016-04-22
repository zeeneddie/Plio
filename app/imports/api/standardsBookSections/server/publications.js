import { Meteor } from 'meteor/meteor';
import { StandardsBookSections } from '../standardsBookSections.js';

Meteor.publish(null, function() {
  return StandardsBookSections.find({});
});
