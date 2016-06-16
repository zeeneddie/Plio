import { Meteor } from 'meteor/meteor';
import { NonConformities } from '../non-conformities.js';
import Counter from '../../counter/server.js';

Meteor.publish('nonConformities', function(organizationId, isDeleted = { $in: [null, false] }) {
  if (this.userId) {
    return NonConformities.find({ organizationId, isDeleted });
  } else {
    return this.ready();
  }
});

Meteor.publish('nonConformitiesCount', function(counterName, organizationId) {
  return new Counter(counterName, NonConformities.find({ organizationId, isDeleted: { $in: [false, null] } }));
});

Meteor.publish('nonConformitiesNotViewedCount', function(counterName, organizationId) {
  return new Counter(counterName, NonConformities.find({ organizationId, viewedBy: { $ne: this.userId }, isDeleted: { $in: [false, null] } }));
});
