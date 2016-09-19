import { Meteor } from 'meteor/meteor';

import { Organizations } from '../organizations/organizations.js';
import { Actions } from '../actions/actions.js';
import Utils from '/imports/core/utils.js';
import WorkItemService from '../work-items/work-item-service.js';
import { WorkItemsStore } from '../constants.js';

export default {

  insert({ organizationId, magnitude, ...args }) {
    const organization = Organizations.findOne({ _id: organizationId });

    const serialNumber = Utils.generateSerialNumber(this.collection, { organizationId });
    const sequentialId = `${this._abbr}${serialNumber}`;

    const workflowType = organization.workflowType(magnitude);

    const _id = this.collection.insert({
      organizationId, serialNumber, sequentialId,
      workflowType, magnitude, ...args
    });

    this._refreshStatus(_id);

    return _id;
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

  setAnalysisExecutor({ _id, executor }, doc) {
    const { analysis = {}, ...rest } = doc;

    const query = { _id };
    const options = { $set: { 'analysis.executor': executor } };

    const ret = this.collection.update(query, options);

    WorkItemService.analysisUserUpdated(_id, this._docType, executor);

    this._refreshStatus(_id);

    return ret;
  },

  setAnalysisDate({ _id, targetDate }, doc) {
    const { analysis: { targetDate:td, ...analysis } = {}, ...rest } = doc;

    const query = { _id };
    const options = { $set: { 'analysis.targetDate': targetDate } };

    const ret = this.collection.update(query, options);

    WorkItemService.analysisDateUpdated(_id, this._docType, targetDate);

    this._refreshStatus(_id);

    return ret;
  },

  setAnalysisCompletedBy({ _id, completedBy }) {
    const query = { _id };
    const options = { $set: { 'analysis.completedBy': completedBy } };

    const ret = this.collection.update(query, options);

    this._refreshStatus(_id);

    return ret;
  },

  setAnalysisCompletedDate({ _id, completedAt }) {
    const query = { _id };
    const options = { $set: { 'analysis.completedAt': completedAt } };

    const ret = this.collection.update(query, options);

    this._refreshStatus(_id);

    return ret;
  },

  setAnalysisComments({ _id, completionComments }) {
    const query = { _id };
    const options = { $set: { 'analysis.completionComments': completionComments } };

    const ret = this.collection.update(query, options);

    this._refreshStatus(_id);

    return ret;
  },

  completeAnalysis({ _id, completionComments, userId }) {
    const ret = this.collection.update({
      _id
    }, {
      $set: {
        'analysis.status': 1, // Completed
        'analysis.completedAt': new Date(),
        'analysis.completedBy': userId,
        'analysis.completionComments': completionComments
      }
    });

    WorkItemService.analysisCompleted(_id, this._docType);

    this._refreshStatus(_id);

    return ret;
  },

  undoAnalysis({ _id, userId }) {
    const ret = this.collection.update({
      _id
    }, {
      $set: { 'analysis.status': 0 }, // Not completed
      $unset: {
        'analysis.completedAt': '',
        'analysis.completedBy': '',
        'analysis.completionComments': '',
        'updateOfStandards.targetDate': '',
        'updateOfStandards.executor': ''
      }
    });

    WorkItemService.analysisCanceled(_id, this._docType);

    this._refreshStatus(_id);

    return ret;
  },

  updateStandards({ _id, completionComments, userId }) {
    const ret = this.collection.update({
      _id
    }, {
      $set: {
        'updateOfStandards.status': 1, // Completed
        'updateOfStandards.completedAt': new Date(),
        'updateOfStandards.completedBy': userId,
        'updateOfStandards.completionComments': completionComments
      }
    });

    WorkItemService.standardsUpdated(_id, this._docType);

    this._refreshStatus(_id);

    return ret;
  },

  undoStandardsUpdate({ _id, userId }) {
    const ret = this.collection.update({
      _id
    }, {
      $set: {
        'updateOfStandards.status': 0 // Not completed
      },
      $unset: {
        'updateOfStandards.completedAt': '',
        'updateOfStandards.completedBy': '',
        'updateOfStandards.completionComments': ''
      }
    });

    WorkItemService.standardsUpdateCanceled(_id, this._docType);

    this._refreshStatus(_id);

    return ret;
  },

  setStandardsUpdateExecutor({ _id, executor }, doc) {
    const { updateOfStandards = {}, ...rest } = doc;

    const query = { _id };
    const options = { $set: { 'updateOfStandards.executor': executor } };

    const ret = this.collection.update(query, options);

    WorkItemService.updateOfStandardsUserUpdated(_id, this._docType, executor);

    this._refreshStatus(_id);

    return ret;
  },

  setStandardsUpdateDate({ _id, targetDate }, doc) {
    const { updateOfStandards: { targetDate:td, ...updateOfStandards } = {}, ...rest } = doc;

    const ret = this.collection.update({
      _id
    }, {
      $set: { 'updateOfStandards.targetDate': targetDate }
    });

    this._refreshStatus(_id);

    WorkItemService.updateOfStandardsDateUpdated(_id, this._docType, targetDate);

    return ret;
  },

  setStandardsUpdateCompletedBy({ _id, completedBy }) {
    const query = { _id };
    const options = { $set: { 'updateOfStandards.completedBy': completedBy } };

    const ret = this.collection.update(query, options);

    this._refreshStatus(_id);

    return ret;
  },

  setStandardsUpdateCompletedDate({ _id, completedAt }) {
    const query = { _id };
    const options = { $set: { 'updateOfStandards.completedAt': completedAt } };

    const ret = this.collection.update(query, options);

    this._refreshStatus(_id);

    return ret;
  },

  setStandardsUpdateComments({ _id, completionComments }) {
    const query = { _id };
    const options = { $set: { 'updateOfStandards.completionComments': completionComments } };

    const ret = this.collection.update(query, options);

    this._refreshStatus(_id);

    return ret;
  },


  updateViewedBy({ _id, viewedBy }) {
    return this._service.updateViewedBy({ _id, viewedBy });
  },

  remove({ _id, deletedBy }) {
    const ret = this._service.remove({ _id, deletedBy });

    this._refreshStatus(_id);

    return ret;
  },

  restore({ _id }) {
    const ret = this._service.restore({ _id });

    this._refreshStatus(_id);

    return ret;
  }
};
