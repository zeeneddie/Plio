import { Meteor } from 'meteor/meteor';
import { Standards } from '../standards.js';
import Counter from '../../counter/server.js';

Meteor.publish('standards', function(organizationId) {
  if (this.userId) {
    return Standards.find({ organizationId });
  } else {
    return this.ready();
  }
});

Meteor.publish('standardsCount', function(counterName, organizationId) {
  return new Counter(counterName, Standards.find({ organizationId }));
});
