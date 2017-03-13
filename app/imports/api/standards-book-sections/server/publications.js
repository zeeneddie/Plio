import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { StandardsBookSections } from '/imports/share/collections/standards-book-sections';
import { isOrgMember } from '../../checkers';


Meteor.publish('standards-book-sections', function (organizationId) {
  check(organizationId, String);

  const userId = this.userId;

  if (!userId || !isOrgMember(userId, organizationId)) {
    return this.ready();
  }

  return StandardsBookSections.find({ organizationId });
});
