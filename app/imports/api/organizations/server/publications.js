import { Meteor } from 'meteor/meteor';
import { Organizations } from '../organizations.js';
import { Departments } from '../../departments/departments.js';
import { StandardTypes } from '../../standard-types/standard-types.js';


Meteor.publishComposite('organizationsByUserId', {
  find: function() {
    return Organizations.find({ 'users.userId': this.userId });
  },
  children: [{
    find: function(org) {
      return Departments.find({
        organizationId: org._id
      });
    }
  }, {
    find: function(org) {
      return StandardTypes.find({
        organizationId: org._id
      });
    }
  }]
});
