import { Meteor } from 'meteor/meteor';
import { Problems } from '../problems.js';
import Counter from '../../counter/server.js';

Meteor.publish('problems', function(organizationId) {
  if (this.userId) {
    return Problems.find({ organizationId, isDeleted: { $in: [false, null] } });
  } else {
    return this.ready();
  }
});
