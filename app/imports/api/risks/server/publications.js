import { Meteor } from 'meteor/meteor';
import { Risks } from '../risks.js';
import Counter from '../../counter/server.js';

Meteor.publish('risks', function(organizationId) {
  if (this.userId) {
    return Risks.find({ organizationId, isDeleted: { $in: [false, null] } });
  } else {
    return this.ready();
  }
});
