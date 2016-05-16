import { Meteor } from 'meteor/meteor';
import { StandardTypes } from '../standards-types.js';


Meteor.publish('standards-types', function(organizationId) {
  if (this.userId) {
    return StandardTypes.find({ organizationId });
  } else {
    return this.ready();
  }
});
