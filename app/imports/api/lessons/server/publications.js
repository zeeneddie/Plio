import { Meteor } from 'meteor/meteor';
import { LessonsLearned } from '../lessons.js';

Meteor.publish('lessons', function(organizationId) {
  if (this.userId) {
    return LessonsLearned.find({ organizationId });
  } else {
    return this.ready();
  }
});
