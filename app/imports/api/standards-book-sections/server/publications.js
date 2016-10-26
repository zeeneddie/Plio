import { Meteor } from 'meteor/meteor';
import { StandardsBookSections } from '/imports/share/collections/standards-book-sections.js';
import { isOrgMember } from '../../checkers.js';


Meteor.publish('standards-book-sections', function(organizationId) {
  const userId = this.userId;
  if (!userId || !isOrgMember(userId, organizationId)) {
    return this.ready();
  }

  return StandardsBookSections.find({ organizationId });
});
