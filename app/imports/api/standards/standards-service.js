import { Standards } from './standards.js';
import { ImprovementPlans } from '../improvement-plans/improvement-plans.js';
import { LessonsLearned } from '../lessons/lessons.js';
import { canChangeStandards } from '../checkers.js';
import BaseEntityService from '../base-entity-service.js';


export default {
  collection: Standards,

  _service: new BaseEntityService(Standards),

  insert({ ...args }) {
    return this.collection.insert(args);
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
    this._ensureStandardExists(_id);

    this._service.remove({ _id, deletedBy });
  },

  restore({ _id }) {
    this._ensureStandardIsDeleted(_id);

    this._service.restore({ _id });
  },

  _ensureStandardIsDeleted(_id) {
    const { isDeleted } = this._getStandard(_id);
    if (!isDeleted) {
      throw new Meteor.Error(400, 'Standard needs to be deleted first');
    }
  },

  _ensureUserHasNotViewed({ _id, viewedBy }) {
    if (!!this.collection.findOne({ _id, viewedBy })) {
      throw new Meteor.Error(
        400, 'You have been already added to this list'
      );
    }
  },

  _ensureStandardExists(_id) {
    if (!this.collection.findOne({ _id })) {
      throw new Meteor.Error(400, 'Standard does not exist');
    }
  },

  _getStandard(_id) {
    const standard = this.collection.findOne({ _id });
    if (!standard) {
      throw new Meteor.Error(400, 'Standard does not exist');
    }
    return standard;
  }
};
