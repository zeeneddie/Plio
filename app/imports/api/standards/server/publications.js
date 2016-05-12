import { Meteor } from 'meteor/meteor';
import { Standards } from '../standards.js';

Meteor.publish('standards', function(organizationId) {
  if (this.userId) {
    return Standards.find({ organizationId });
  } else {
    return this.ready();
  }
});
