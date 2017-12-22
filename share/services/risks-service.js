import { Meteor } from 'meteor/meteor';
import Random from 'meteor/random';

import { Risks } from '../collections';
import { ProblemTypes } from '../constants';
import BaseEntityService from './base-entity-service';
import ProblemsService from './problems-service';

if (Meteor.isServer) {
  // import RiskWorkflow from '/imports/core/workflow/server/RiskWorkflow.js';
}


export default Object.assign({}, ProblemsService, {
  collection: Risks,

  _service: new BaseEntityService(Risks),

  _abbr: 'RK',

  _docType: ProblemTypes.RISK,

  'scores.insert': function ({ _id, ...args }) {
    const id = Random.id();
    const query = { _id };
    const options = {
      $addToSet: {
        scores: { _id: id, ...args },
      },
    };

    this.collection.update(query, options);

    return id;
  },

  'scores.remove': function ({ _id, score }) {
    const query = { _id };
    const options = {
      $pull: {
        scores: score,
      },
    };

    return this.collection.update(query, options);
  },

  getLinkable({ organizationId, ids }) {
    const query = {
      organizationId,
      _id: {
        $nin: ids,
      },
      isDeleted: {
        $ne: true,
      },
    };
    const options = {
      sort: {
        serialNumber: 1,
      },
      fields: {
        _id: 1,
        title: 1,
        sequentialId: 1,
        serialNumber: 1,
        organizationId: 1,
      },
    };
    const risks = Risks.find(query, options).fetch();

    return risks;
  },

  _getDoc(_id) {
    const risk = this.collection.findOne({ _id });
    if (!risk) {
      throw new Meteor.Error(400, 'Risk does not exist');
    }
    return risk;
  },

  _refreshStatus(_id) {
    /* Meteor.isServer && Meteor.defer(() => {
      new RiskWorkflow(_id).refreshStatus();
    }); */
  },
});
