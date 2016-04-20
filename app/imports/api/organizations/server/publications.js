import { Meteor } from 'meteor/meteor';
import { Organizations } from '../organizations.js';
import { Departments } from '../../departments/departments.js';


Meteor.publishComposite(null, {
  find: function() {
    return Organizations.find({ 'users.userId': this.userId });
  },
  children: [{
    find: function(org) {
      return Departments.find({
        organizationId: org._id
      });
    }
  }]
});
