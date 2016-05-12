import { Meteor } from 'meteor/meteor';
import { LessonsLearned } from '../lessons.js';

Meteor.publish('lessons', function(standardId) {
  if (this.userId) {
    return LessonsLearned.find({ standardId });
  } else {
    return this.ready();
  }
});
