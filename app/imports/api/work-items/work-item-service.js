import { WorkItems } from './work-items.js';
import BaseEntityService from '../base-entity-service.js';
import { WorkItemsStore } from '../constants.js';

export default {
  collection: WorkItems,

  _service: new BaseEntityService(WorkItems),

  insert({ ...args }) {
    return this.collection.insert({ ...args });
  },

  updateViewedBy({ _id, viewedBy }) {
    this._ensureWorkItemExists(_id);

    return this._service.updateViewedBy({ _id, viewedBy });
  },

  remove({ _id, deletedBy }) {
    this._ensureWorkItemExists(_id);

    return this._service.remove({ _id, deletedBy });
  },

  restore({ _id }) {
    this._ensureWorkItemIsDeleted(_id);

    return this._service.restore({ _id });
  },

  onProblemUpdated(type, docType, { _id, organizationId, targetDate, assigneeId }) {
    if (!targetDate || !assigneeId) return;

    const update = () => {
      const query = { linkedDoc: { _id }, status: { $ne: 3 } }; // 3 - completed
      const options = { $set: { targetDate, assigneeId } };

      return this.collection.update(query, options);
    };

    const insert = () => {
      this.collection.insert({
        organizationId,
        targetDate,
        assigneeId,
        type,
        status: 0, // in progress
        linkedDoc: {
          _id,
          type: docType
        }
      });
    };

    if (this.collection.findOne({ linkedDoc: { _id } })) {
      return update();
    } else {
      return insert();
    }
  },

  connectedAnalysisUpdated(type, docType, { _id, organizationId, analysis: { targetDate, executor:assigneeId } = {}, ...args }) {
    this.onProblemUpdated(type, docType, { _id, organizationId, targetDate, assigneeId });
  },

  connectedStandardsUpdated(type, docType, { _id, organizationId, updateOfStandards: { targetDate, executor:assigneeId } = {}, ...args }) {
    this.onProblemUpdated(type, docType, { _id, organizationId, targetDate, assigneeId });
  },

  _ensureWorkItemIsDeleted(_id) {
    const workItem = this._getWorkItem(_id);
    if (!workItem.isDeleted) {
      throw new Meteor.Error(400, 'Work item needs to be deleted first');
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
