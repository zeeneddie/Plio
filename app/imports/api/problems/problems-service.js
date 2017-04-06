import { Meteor } from 'meteor/meteor';

import { Organizations } from '/imports/share/collections/organizations.js';
import { Actions } from '/imports/share/collections/actions.js';
import { generateSerialNumber, getWorkflowDefaultStepDate } from '/imports/share/helpers.js';
import ActionService from '../actions/action-service';
import WorkItemService from '../work-items/work-item-service.js';
import { WorkItemsStore, WorkflowTypes } from '/imports/share/constants.js';

export default {

  insert({ organizationId, magnitude, ...args }) {
    const organization = Organizations.findOne({ _id: organizationId });

    const serialNumber = generateSerialNumber(this.collection, { organizationId });
    const sequentialId = `${this._abbr}${serialNumber}`;

    const workflowType = organization.workflowType(magnitude);

    const _id = this.collection.insert({
      organizationId, serialNumber, sequentialId,
      workflowType, magnitude, ...args
    });

    if (workflowType === WorkflowTypes.SIX_STEP) {

      const doc = this.collection.findOne({ _id });

      this.setAnalysisExecutor({
        _id,
        executor: args.ownerId,
        assignedBy: args.originatorId,
      }, doc);

      this.setAnalysisDate({
        _id,
        targetDate: getWorkflowDefaultStepDate({ organization, linkedTo: [{ documentId: _id, documentType: this._docType, }] }),
      }, doc);
    }

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

  setAnalysisExecutor({ _id, executor, assignedBy }, doc) {
    const { analysis = {}, ...rest } = doc;

    const query = { _id };
    const options = {
      $set: {
        'analysis.executor': executor,
        'analysis.assignedBy': assignedBy,
      },
    };

    const ret = this.collection.update(query, options);

    WorkItemService.analysisUserUpdated(_id, this._docType, executor);

    return ret;
  },

  setAnalysisDate({ _id, targetDate }, doc) {
    const { analysis: { targetDate:td, ...analysis } = {}, ...rest } = doc;

    const query = { _id };
    const options = { $set: { 'analysis.targetDate': targetDate } };

    const ret = this.collection.update(query, options);

    WorkItemService.analysisDateUpdated(_id, this._docType, targetDate);

    return ret;
  },

  setAnalysisCompletedBy({ _id, completedBy }) {
    const query = { _id };
    const options = { $set: { 'analysis.completedBy': completedBy } };

    return this.collection.update(query, options);
  },

  setAnalysisCompletedDate({ _id, completedAt }) {
    const query = { _id };
    const options = { $set: { 'analysis.completedAt': completedAt } };

    return this.collection.update(query, options);
  },

  setAnalysisComments({ _id, completionComments }) {
    const query = { _id };
    const options = { $set: { 'analysis.completionComments': completionComments } };

    return this.collection.update(query, options);
  },

  completeAnalysis({ _id, completionComments, userId }) {
    const doc = this.collection.findOne({ _id }) || {};

    const ret = this.collection.update({
      _id
    }, {
      $set: {
        'analysis.status': 1, // Completed
        'analysis.completedAt': new Date(),
        'analysis.completedBy': userId,
        'analysis.completionComments': completionComments,
        'updateOfStandards.executor': doc.originatorId,
        'updateOfStandards.assignedBy': userId,
      }
    });

    WorkItemService.analysisCompleted(_id, this._docType);
    WorkItemService.updateOfStandardsUserUpdated(_id, this._docType, doc.originatorId);

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

    return ret;
  },

  setStandardsUpdateExecutor({ _id, executor, assignedBy }, doc) {
    const { updateOfStandards = {}, ...rest } = doc;

    const query = { _id };
    const options = {
      $set: {
        'updateOfStandards.executor': executor,
        'updateOfStandards.assignedBy': assignedBy,
      },
    };

    const ret = this.collection.update(query, options);

    WorkItemService.updateOfStandardsUserUpdated(_id, this._docType, executor);

    return ret;
  },

  setStandardsUpdateDate({ _id, targetDate }, doc) {
    const { updateOfStandards: { targetDate:td, ...updateOfStandards } = {}, ...rest } = doc;

    const ret = this.collection.update({
      _id
    }, {
      $set: { 'updateOfStandards.targetDate': targetDate }
    });

    WorkItemService.updateOfStandardsDateUpdated(_id, this._docType, targetDate);

    return ret;
  },

  setStandardsUpdateCompletedBy({ _id, completedBy }) {
    const query = { _id };
    const options = { $set: { 'updateOfStandards.completedBy': completedBy } };

    return this.collection.update(query, options);
  },

  setStandardsUpdateCompletedDate({ _id, completedAt }) {
    const query = { _id };
    const options = { $set: { 'updateOfStandards.completedAt': completedAt } };

    return this.collection.update(query, options);
  },

  setStandardsUpdateComments({ _id, completionComments }) {
    const query = { _id };
    const options = { $set: { 'updateOfStandards.completionComments': completionComments } };

    return this.collection.update(query, options);
  },

  updateViewedBy({ _id, viewedBy }) {
    return this._service.updateViewedBy({ _id, viewedBy });
  },

  remove({ _id, deletedBy }) {
    const workQuery = { query: { 'linkedDoc._id': _id } };
    const onSoftDelete = () => WorkItemService.removeSoftly(workQuery);
    const onPermanentDelete = () =>
      WorkItemService.removePermanently(workQuery);

    return this._service.remove({ _id, deletedBy, onSoftDelete, onPermanentDelete });
  },

  restore({ _id }) {
    const onRestore = () => {
      WorkItemService.restore({ query: { 'linkedDoc._id': _id } });
    };

    return this._service.restore({ _id, onRestore });
  },

  removePermanently({ _id, query }) {
    return this._service.removePermanently({ _id, query });
  },

  unlinkStandard({ _id, standardId }) {
    this.collection.update({ _id }, {
      $pull: { standardsIds: standardId }
    });
  },

  unlinkActions({ _id }) {
    const query = {
      'linkedTo.documentId': _id,
      'linkedTo.documentType': this._docType
    };

    Actions.find(query).forEach((action) => {
      ActionService.unlinkDocument({
        _id: action._id,
        documentId: _id,
        documentType: this._docType
      });
    });
  }
};
