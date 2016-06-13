import { Meteor } from 'meteor/meteor';
import { Analysis } from '../analysis.js';

Meteor.publish('analysis', function(nonConformityId) {
  if (this.userId) {
    return Analysis.find({ nonConformityId });
  } else {
    return this.ready();
  }
});
