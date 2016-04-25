import { Meteor } from 'meteor/meteor';
import { StandardsBookSections } from '../standards-book-sections.js';


Meteor.publish('standards-book-sections', function(organizationId) {
  if (this.userId) {
    return StandardsBookSections.find({ organizationId });
  } else {
    return this.ready();
  }
});
