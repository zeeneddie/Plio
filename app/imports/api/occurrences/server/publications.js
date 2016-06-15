import { Meteor } from 'meteor/meteor';
import { Occurrences } from '../occurrences.js';

Meteor.publish('occurrences', function(nonConformityId) {
  if (this.userId) {
    return Occurrences.find({ nonConformityId });
  } else {
    return this.ready();
  }
});

Meteor.publish('occurrencesByNCIds', function(ids) {
  if (this.userId) {
    return Occurrences.find({ nonConformityId: { $in: ids } });
  } else {
    return this.ready();
  }
});
