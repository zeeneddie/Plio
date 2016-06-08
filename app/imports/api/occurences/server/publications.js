import { Meteor } from 'meteor/meteor';
import { Occurences } from '../occurences.js';

Meteor.publish('occurences', function(nonConformityId) {
  if (this.userId) {
    return Occurences.find({ nonConformityId });
  } else {
    return this.ready();
  }
});

Meteor.publish('occurencesByNCIds', function(ids) {
  if (this.userId) {
    return Occurences.find({ nonConformityId: { $in: ids } });
  } else {
    return this.ready();
  }
});
