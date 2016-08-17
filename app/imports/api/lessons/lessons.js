import { Mongo } from 'meteor/mongo';

import { LessonsSchema } from './lessons-schema.js';
import LessonAuditService from './lesson-audit-service.js';


const LessonsLearned = new Mongo.Collection('LessonsLearned');
LessonsLearned.attachSchema(LessonsSchema);


// hooks

LessonsLearned.after.insert(function(userId, doc) {
  if (Meteor.isServer) {
    Meteor.defer(() => LessonAuditService.documentCreated(doc));
  }
});

LessonsLearned.after.update(function(userId, doc, fieldNames, modifier, options) {
  if (Meteor.isServer) {
    Meteor.defer(() => LessonAuditService.documentUpdated(doc, this.previous));
  }
});

LessonsLearned.after.remove(function(userId, doc) {
  if (Meteor.isServer) {
    Meteor.defer(() => LessonAuditService.documentRemoved(doc, userId));
  }
});


export { LessonsLearned };
