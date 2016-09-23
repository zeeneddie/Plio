import { Meteor } from 'meteor/meteor';

import { Risks } from '/imports/share/collections/risks.js';
import { ProblemTypes } from '/imports/share/constants.js';
import BaseEntityService from '../base-entity-service.js';
import ProblemsService from '../problems/problems-service.js';

if (Meteor.isServer) {
  import RiskWorkflow from '/imports/core/workflow/server/RiskWorkflow.js';
}


export default _.extend({}, ProblemsService, {
  collection: Risks,

  _service: new BaseEntityService(Risks),

  _abbr: 'RK',

  _docType: ProblemTypes.RISK,

  'scores.insert'({ _id, ...args }) {
    const id = Random.id();
    const query = { _id };
    const options = {
      $addToSet: {
        scores: { _id: id, ...args }
      }
    };

    this.collection.update(query, options);

    return id;
  },

  'scores.remove'({ _id, score }) {
    const query = { _id };
    const options = {
      '$pull': {
        'scores': score
      }
    };

    return this.collection.update(query, options);
  },

  _getDoc(_id) {
    const risk = this.collection.findOne({ _id });
    if (!risk) {
      throw new Meteor.Error(400, 'Risk does not exist');
    }
    return risk;
  },

  _refreshStatus(_id) {
    Meteor.isServer && Meteor.defer(() => {
      new RiskWorkflow(_id).refreshStatus();
    });
  }
});
