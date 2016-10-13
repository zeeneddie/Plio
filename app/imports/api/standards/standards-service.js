import { Standards } from './standards.js';
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
    return this._service.updateViewedBy({ _id, viewedBy });
  },

  remove({ _id, deletedBy }) {
    return this._service.remove({ _id, deletedBy });
  },

  restore({ _id }) {
    return this._service.restore({ _id });
  }
};
