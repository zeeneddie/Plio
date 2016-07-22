import { NonConformities } from './non-conformities.js';
import { generateSerialNumber } from '/imports/core/utils.js';
import BaseEntityService from '../base-entity-service.js';


export default {
  collection: NonConformities,

  _service: new BaseEntityService(NonConformities),

  insert({ organizationId, ...args }) {
    const serialNumber = Utils.generateSerialNumber(this.collection, { organizationId });

    const sequentialId = `NC${serialNumber}`;

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
    this._ensureNCExists(_id);

    this._service.remove({ _id, deletedBy });
  },

  restore({ _id }) {
    this._ensureNCIsDeleted(_id);

    return this._service.restore({ _id });
  },

  _ensureNCIsDeleted(_id) {
    const NC = this._getNC(_id);
    if (!NC.isDeleted) {
      throw new Meteor.Error(400, 'Non-conformity needs to be deleted first');
    }
  },

  _ensureUserHasNotViewed({ _id, viewedBy }) {
    this._ensureNCExists(_id);

    if (!!this.collection.findOne({ _id, viewedBy })) {
      throw new Meteor.Error(
        400, 'You have been already added to this list'
      );
    }
  },

  _ensureNCExists(_id) {
    if (!this.collection.findOne({ _id })) {
      throw new Meteor.Error(400, 'Non-conformity does not exist');
    }
  },

  _getNC(_id) {
    const NC = this.collection.findOne({ _id });
    if (!NC) {
      throw new Meteor.Error(400, 'Non-conformity does not exist');
    }
    return NC;
  }
};
