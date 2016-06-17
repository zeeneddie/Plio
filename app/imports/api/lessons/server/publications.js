import { Meteor } from 'meteor/meteor';
import { LessonsLearned } from '../lessons.js';
import { isOrgMember } from '../../checkers.js';


Meteor.publish('lessons', function(organizationId) {
  const userId = this.userId;
  if (!userId || !isOrgMember(userId, organizationId)) {
    return this.ready();
  }

  return LessonsLearned.find({ organizationId });
});
