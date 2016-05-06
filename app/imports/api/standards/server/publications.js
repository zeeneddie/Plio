import { Meteor } from 'meteor/meteor';
import { Standards } from '../standards.js';

Meteor.publish('standards', function() {
  if (this.userId) {
    return Standards.find({});
  } else {
    return this.ready();
  }
});
