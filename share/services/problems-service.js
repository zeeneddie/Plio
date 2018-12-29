import { generateSerialNumber, getWorkflowDefaultStepDate } from '../helpers';
import { WorkflowTypes, ANALYSIS_STATUSES, ProblemTypes } from '../constants';
import { Organizations, Actions } from '../collections';
import ActionService from './action-service';
import WorkItemService from './work-item-service';

export default {

  insert({ organizationId, magnitude, ...args }) {
    const { type } = args;
    const organization = Organizations.findOne({ _id: organizationId });
    const serialNumber = generateSerialNumber(this.collection, { organizationId });
    const abbr = this._getAbbr({ organization, magnitude, ...args });
    const sequentialId = `${abbr}${serialNumber}`;

    const workflowType = type === ProblemTypes.POTENTIAL_GAIN
      ? WorkflowTypes.THREE_STEP
      : organization.workflowType(magnitude);

    const _id = this.collection.insert({
      organizationId,
      serialNumber,
      sequentialId,
      workflowType,
      magnitude,
      ...args,
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
        targetDate: getWorkflowDefaultStepDate({
          organization,
          linkedTo: [{ documentId: _id, documentType: this._getDocType(_id) }],
        }),
      }, doc);
    }

    return _id;
  },

  update(...args) {
    return this._update(...args);
  },

  _update({
    _id, query = {}, options = {}, ...args
  }) {
    if (!Object.keys(query).length) {
      Object.assign(query, { _id });
    }
    if (!Object.keys(options).length) {
      options.$set = args; // eslint-disable-line no-param-reassign
    }

    return this.collection.update(query, options);
  },

  async set({ _id, ...args }) {
    const query = { _id };
    const modifier = {
      $set: args,
    };

    return this.collection.update(query, modifier);
  },

  setAnalysisExecutor({ _id, executor, assignedBy }) {
    const query = { _id };
    const options = {
      $set: {
        'analysis.executor': executor,
        'analysis.assignedBy': assignedBy,
      },
    };

    const ret = this.collection.update(query, options);

    WorkItemService.analysisUserUpdated(_id, this._getDocType(_id), executor);

    return ret;
  },

  setAnalysisDate({ _id, targetDate }) {
    const query = { _id };
    const options = { $set: { 'analysis.targetDate': targetDate } };

    const ret = this.collection.update(query, options);

    WorkItemService.analysisDateUpdated(_id, this._getDocType(_id), targetDate);

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
    const ret = this.collection.update({
      _id,
    }, {
      $set: {
        'analysis.status': ANALYSIS_STATUSES.COMPLETED,
        'analysis.completedAt': new Date(),
        'analysis.completedBy': userId,
        'analysis.completionComments': completionComments,
      },
    });

    WorkItemService.analysisCompleted(_id, this._getDocType(_id));

    return ret;
  },

  undoAnalysis({ _id }) {
    const ret = this.collection.update({
      _id,
    }, {
      $set: { 'analysis.status': 0 }, // Not completed
      $unset: {
        'analysis.completedAt': '',
        'analysis.completedBy': '',
        'analysis.completionComments': '',
        'updateOfStandards.targetDate': '',
        'updateOfStandards.executor': '',
      },
    });

    WorkItemService.analysisCanceled(_id, this._getDocType(_id));

    return ret;
  },

  updateStandards({ _id, completionComments, userId }) {
    const ret = this.collection.update({
      _id,
    }, {
      $set: {
        'updateOfStandards.status': 1, // Completed
        'updateOfStandards.completedAt': new Date(),
        'updateOfStandards.completedBy': userId,
        'updateOfStandards.completionComments': completionComments,
      },
    });

    WorkItemService.standardsUpdated(_id, this._getDocType(_id));

    return ret;
  },

  undoStandardsUpdate({ _id }) {
    const ret = this.collection.update({
      _id,
    }, {
      $set: {
        'updateOfStandards.status': 0, // Not completed
      },
      $unset: {
        'updateOfStandards.completedAt': '',
        'updateOfStandards.completedBy': '',
        'updateOfStandards.completionComments': '',
      },
    });

    WorkItemService.standardsUpdateCanceled(_id, this._getDocType(_id));

    return ret;
  },

  setStandardsUpdateExecutor({ _id, executor, assignedBy }) {
    const query = { _id };
    const options = {
      $set: {
        'updateOfStandards.executor': executor,
        'updateOfStandards.assignedBy': assignedBy,
      },
    };

    const ret = this.collection.update(query, options);

    WorkItemService.updateOfStandardsUserUpdated(_id, this._getDocType(_id), executor);

    return ret;
  },

  setStandardsUpdateDate({ _id, targetDate }) {
    const ret = this.collection.update({
      _id,
    }, {
      $set: { 'updateOfStandards.targetDate': targetDate },
    });

    WorkItemService.updateOfStandardsDateUpdated(_id, this._getDocType(_id), targetDate);

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

    return this._service.remove({
      _id, deletedBy, onSoftDelete, onPermanentDelete,
    });
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

  async linkStandard({ _id, standardId }) {
    const query = { _id };
    const modifier = {
      $addToSet: {
        standardsIds: standardId,
      },
    };

    return this.collection.update(query, modifier);
  },

  async unlinkStandard({ _id, standardId }) {
    const query = { _id };
    const modifier = {
      $pull: {
        standardsIds: standardId,
      },
    };
    return this.collection.update(query, modifier);
  },

  unlinkActions({ _id }) {
    const query = {
      'linkedTo.documentId': _id,
    };

    Actions.find(query).forEach((action) => {
      ActionService.unlinkDocument({
        _id: action._id,
        documentId: _id,
      });
    });
  },
};
