import { Meteor } from 'meteor/meteor';
import { LessonsLearned } from '/imports/share/collections/lessons.js';
import { isOrgMember } from '../../checkers.js';


Meteor.publish('lessons', function(organizationId) {
  const userId = this.userId;
  if (!userId || !isOrgMember(userId, organizationId)) {
    return this.ready();
  }

  return LessonsLearned.find({ organizationId });
});

Meteor.publish('standardLessons', function(standardId) {
  const userId = this.userId;
  const standard = Standards.findOne({ _id: standardId });
  if (standard && !userId || !isOrgMember(userId, standard.organizationId)) {
    return this.ready();
  }

  return LessonsLearned.find({ documentId: standard._id });
});
