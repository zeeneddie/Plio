import { Meteor } from 'meteor/meteor';
import { Standards } from '../standards.js';

Meteor.publish('standards', function(organizationId) {
  if (this.userId) {
    return Standards.find({ organizationId, isDeleted: { $in: [false, null] } });
  } else {
    return this.ready();
  }
});
