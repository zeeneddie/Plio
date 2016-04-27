import { Meteor } from 'meteor/meteor';
import { StandardsTypes } from '../standards-types.js';


Meteor.publish('standards-types', function(organizationId) {
  if (this.userId) {
    return StandardsTypes.find({ organizationId });
  } else {
    return this.ready();
  }
});
