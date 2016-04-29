import { Meteor } from 'meteor/meteor';
import { Departments } from '../departments.js';


Meteor.publish('departments', function(organizationId) {
  if (this.userId) {
    return Departments.find({ organizationId });
  } else {
    return this.ready();
  }
});
