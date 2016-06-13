import { Meteor } from 'meteor/meteor';
import { NonConformities } from '../non-conformities.js';
import Counter from '../../counter/server.js';

Meteor.publish('non-conformities', function(organizationId) {
  if (this.userId) {
    return NonConformities.find({ organizationId, isDeleted: { $in: [false, null] } });
  } else {
    return this.ready();
  }
});
