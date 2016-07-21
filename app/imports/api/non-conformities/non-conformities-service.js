import { Meteor } from 'meteor/meteor';

import { NonConformities } from './non-conformities.js';
import NCWorkflow from './NCWorkflow.js';
import ProblemsService from '../problems/problems-service.js';


export default _.extend({}, ProblemsService, {
  collection: NonConformities,

  _getDoc(_id) {
    const NC = this.collection.findOne({ _id });
    if (!NC) {
      throw new Meteor.Error(400, 'Non-conformity does not exist');
    }
    return NC;
  },

  _refreshStatus(_id) {
    Meteor.isServer && Meteor.defer(() => {
      new NCWorkflow(_id).refreshStatus();
    });
  }
});
