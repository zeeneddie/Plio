import { WorkItems } from './work-items.js';
import BaseEntityService from '../base-entity-service.js';

export default {
  collection: WorkItems,

  _service: new BaseEntityService(WorkItems),

  insert({ ...args }) {
    return this.collection.insert({ ...args });
  },

  updateViewedBy({ _id, userId:viewedBy }) {
    this._ensureUserHasNotViewed({ _id, viewedBy });

    return this._service.updateViewedBy({ _id, viewedBy });
  },

  remove({ _id, deletedBy }) {
    this._ensureWorkItemExists(_id);

    return this._service.remove({ _id, deletedBy });
  },

  restore({ _id }) {
    this._ensureWorkItemExists(_id);

    try {
      const res = this._service.restore({ _id });
    } catch(err) {
      throw new Meteor.Error(400, 'Work item needs to be deleted first');
    }

    return res;
  },

  _ensureUserHasNotViewed({ _id, viewedBy }) {
    this._ensureWorkItemExists(_id);

    if (!!this.collection.findOne({ _id, viewedBy })) {
      throw new Meteor.Error(
        400, 'You have been already added to this list'
      );
    }
  },

  _ensureWorkItemExists(_id) {
    if (!this.collection.findOne({ _id })) {
      throw new Meteor.Error(400, 'Work item does not exist');
    }
  },

  _getWorkItem(_id) {
    const workItem = this.collection.findOne({ _id });
    if (!workItem) {
      throw new Meteor.Error(400, 'Work item does not exist');
    }
    return workItem;
  },
}
