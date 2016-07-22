import { Risks } from './risks.js';
import { generateSerialNumber } from '/imports/core/utils.js';
import { Random } from 'meteor/random';
import BaseEntityService from '../base-entity-service.js';

export default {
  collection: Risks,

  _service: new BaseEntityService(Risks),

  insert({ organizationId, ...args }) {
    const serialNumber = Utils.generateSerialNumber(this.collection, { organizationId });

    const sequentialId = `RK${serialNumber}`;

    return this.collection.insert({ organizationId, serialNumber, sequentialId, ...args });
  },

  update({ _id, query = {}, options = {}, ...args }) {
    if (!_.keys(query).length > 0) {
      query = { _id };
    }
    if (!_.keys(options).length > 0) {
      options['$set'] = args;
    }

    return this.collection.update(query, options);
  },

  updateViewedBy({ _id, userId:viewedBy }) {
    this._ensureUserHasNotViewed({ _id, viewedBy });

    this._service.updateViewedBy({ _id, viewedBy });
  },

  remove({ _id, deletedBy }) {
    this._ensureRiskExists(_id);

    this._service.remove({ _id, deletedBy });
  },

  restore({ _id }) {
    this._ensureRiskIsDeleted(_id);

    this._service.restore({ _id });
  },

  'scores.insert'({ _id, ...args }) {
    const id = Random.id();
    const query = { _id };
    const options = {
      $addToSet: {
        scores: { _id: id, ...args }
      }
    };

    return (async () => {
      const res = await this.collection.update(query, options);
      return res ? id : res;
    })();
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
  
  _ensureRiskIsDeleted(_id) {
    const risk = this._getRisk(_id);
    if (!risk.isDeleted) {
      throw new Meteor.Error(400, 'Risk needs to be deleted first');
    }
  },

  _ensureUserHasNotViewed({ _id, viewedBy }) {
    this._ensureRiskExists(_id);

    if (!!this.collection.findOne({ _id, viewedBy })) {
      throw new Meteor.Error(
        400, 'You have been already added to this list'
      );
    }
  },

  _ensureRiskExists(_id) {
    if (!this.collection.findOne({ _id })) {
      throw new Meteor.Error(400, 'Risk does not exist');
    }
  },

  _getRisk(_id) {
    const risk = this.collection.findOne({ _id });
    if (!risk) {
      throw new Meteor.Error(400, 'Risk does not exist');
    }
    return risk;
  }
};
