import { Meteor } from 'meteor/meteor';
import { StandardTypes } from '../standard-types.js';


Meteor.publish('standard-types', function(organizationId) {
  if (this.userId) {
    return StandardTypes.find({ organizationId });
  } else {
    return this.ready();
  }
});
