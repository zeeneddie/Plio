import { Actions } from '../actions/actions.js';
import { NonConformities } from '../non-conformities/non-conformities.js';
import { Risks } from '../risks/risks.js';
import { WorkItems } from './work-items.js';
import BaseEntityService from '../base-entity-service.js';
import { ProblemTypes, WorkItemsStore, WorkflowTypes } from '../constants.js';

if (Meteor.isServer) {
  import WorkItemWorkflow from '/imports/core/workflow/server/WorkItemWorkflow.js';
}


export default {
  collection: WorkItems,

  _service: new BaseEntityService(WorkItems),

  insert({ ...args }) {
    return this.collection.insert({ ...args });
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

  updateViewedBy({ _id, viewedBy }) {
    return this._service.updateViewedBy({ _id, viewedBy });
  },

  remove({ _id, deletedBy }) {
    return this._service.remove({ _id, deletedBy });
  },

  restore({ _id }) {
    return this._service.restore({ _id });
  },

  actionCreated(actionId) {
    const action = Actions.findOne({ _id: actionId });
    const { organizationId, type, completionTargetDate, toBeCompletedBy } = action;

    this.collection.insert({
      organizationId,
      targetDate: completionTargetDate,
      assigneeId: toBeCompletedBy,
      type: WorkItemsStore.TYPES.COMPLETE_ACTION,
      linkedDoc: {
        type,
        _id: actionId
      }
    });
  },

  actionCompleted(actionId) {
    const action = Actions.findOne({ _id: actionId });

    this.collection.update({
      'linkedDoc._id': actionId,
      type: WorkItemsStore.TYPES.COMPLETE_ACTION,
      isCompleted: false
    }, {
      $set: { isCompleted: true }
    });

    const { verificationTargetDate, toBeVerifiedBy } = action;
    if ((action.getWorkflowType() === WorkflowTypes.SIX_STEP)
          && verificationTargetDate
          && toBeVerifiedBy) {
      const { organizationId, type } = action;

      const verifyWorkItemsLength = this.collection.find({
        type: WorkItemsStore.TYPES.VERIFY_ACTION,
        'linkedDoc._id': actionId,
        isCompleted: false
      }).count();

      if (!verifyWorkItemsLength) {
        this.collection.insert({
          organizationId,
          targetDate: verificationTargetDate,
          assigneeId: toBeVerifiedBy,
          type: WorkItemsStore.TYPES.VERIFY_ACTION,
          isCompleted: false,
          linkedDoc: {
            _id: actionId,
            type
          }
        });
      }
    }
  },

  actionCompletionCanceled(actionId) {
    return this._undo(actionId, WorkItemsStore.TYPES.VERIFY_ACTION);
  },

  actionVerified(actionId) {
    this.collection.update({
      'linkedDoc._id': actionId,
      type: WorkItemsStore.TYPES.VERIFY_ACTION,
      isCompleted: false
    }, {
      $set: { isCompleted: true }
    });
  },

  actionVerificationCanceled(actionId) {
    return this._undo(actionId);
  },

  actionUpdated(actionId) {
    const action = Actions.findOne({ _id: actionId });
    const {
      completionTargetDate, toBeCompletedBy,
      verificationTargetDate, toBeVerifiedBy,
      type, organizationId
    } = action;

    if (!action.completed() && completionTargetDate && toBeCompletedBy) {
      const query = {
        'linkedDoc._id': actionId,
        type: WorkItemsStore.TYPES.COMPLETE_ACTION,
        isCompleted: false
      };

      const existingItem = this.collection.findOne(query);

      if (!existingItem) {
        this.collection.insert(_.extend(query, {
          organizationId,
          type: WorkItemsStore.TYPES.COMPLETE_ACTION,
          targetDate: completionTargetDate,
          assigneeId: toBeCompletedBy,
          isCompleted: false,
          linkedDoc: {
            _id: actionId,
            type
          }
        }));
      } else {
        const { targetDate:existingDate, assigneeId:existingExecutor } = existingItem;

        if ((existingDate !== completionTargetDate) ||
              (existingExecutor !== toBeCompletedBy)) {
          this.collection.update(query, {
            $set: {
              targetDate: completionTargetDate,
              assigneeId: toBeCompletedBy
            }
          });
        }
      }
    }

    const workflowType = action.getWorkflowType();
    const query = {
      'linkedDoc._id': actionId,
      type: WorkItemsStore.TYPES.VERIFY_ACTION,
      isCompleted: false
    };
    const existingItem = this.collection.findOne(query);

    if ((workflowType === WorkflowTypes.SIX_STEP)
          && !action.verified()
          && verificationTargetDate
          && toBeVerifiedBy) {

      if (!existingItem) {
        this.collection.insert({
          linkedDoc: {
            _id: actionId,
            type
          },
          type: WorkItemsStore.TYPES.VERIFY_ACTION,
          targetDate: verificationTargetDate,
          assigneeId: toBeVerifiedBy,
          isCompleted: false,
          organizationId
        });
      } else {
        const { targetDate:existingDate, assigneeId:existingExecutor } = existingItem;

        if ((existingDate !== verificationTargetDate) ||
              (existingExecutor !== toBeVerifiedBy)) {
          this.collection.update(query, {
            $set: {
              targetDate: verificationTargetDate,
              assigneeId: toBeVerifiedBy
            }
          });
        }
      }
    } else if ((workflowType === WorkflowTypes.THREE_STEP) && existingItem) {
      this.collection.remove({ _id: existingItem._id });
    }
  },

  analysisCompleted(docId, docType) {
    this.collection.update({
      'linkedDoc._id': docId,
      type: WorkItemsStore.TYPES.COMPLETE_ANALYSIS,
      isCompleted: false
    }, {
      $set: { isCompleted: true }
    });

    const updateStandardWorkItemsLength = this.collection.find({
      type: WorkItemsStore.TYPES.COMPLETE_UPDATE_OF_STANDARDS,
      'linkedDoc._id': docId,
      isCompleted: false
    }).count();

    if (!updateStandardWorkItemsLength) {
      const doc = this._getProblemDoc(docId, docType);
      const { organizationId, updateOfStandards: { targetDate, executor } } = doc;

      targetDate && executor && this.collection.insert({
        organizationId,
        targetDate,
        assigneeId: executor,
        type: WorkItemsStore.TYPES.COMPLETE_UPDATE_OF_STANDARDS,
        isCompleted: false,
        linkedDoc: {
          _id: docId,
          type: docType
        }
      });
    }
  },

  analysisCanceled(docId, docType) {
    return this._undo(docId, WorkItemsStore.TYPES.COMPLETE_UPDATE_OF_STANDARDS);
  },

  standardsUpdated(docId, docType) {
    this.collection.update({
      'linkedDoc._id': docId,
      type: WorkItemsStore.TYPES.COMPLETE_UPDATE_OF_STANDARDS,
      isCompleted: false
    }, {
      $set: { isCompleted: true }
    });
  },

  standardsUpdateCanceled(docId, docType) {
    return this._undo(docId);
  },

  onProblemUpdated(type, docType, { _id, organizationId, targetDate, assigneeId }) {
    if (!targetDate || !assigneeId) return;

    const query = {
      type,
      'linkedDoc._id': _id,
      isCompleted: false
    };

    const update = () => {
      const options = { $set: { targetDate, assigneeId } };

      return this.collection.update(query, options);
    };

    const insert = () => {
      const workItemId = this.collection.insert({
        organizationId,
        targetDate,
        assigneeId,
        type,
        linkedDoc: {
          _id,
          type: docType
        }
      });

      this._refreshStatus(workItemId);
    };

    if (this.collection.findOne(query)) {
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

  _refreshStatus(_id) {
    Meteor.isServer && Meteor.defer(() => {
      const workflow = new WorkItemWorkflow(_id);
      workflow.refreshStatus();
    });
  },

  _undo(linkedDocId, type) {
    const query = { 'linkedDoc._id': linkedDocId };
    const options = {
      $set: {
        isCompleted: false
      }
    };

    (() => {
      // if document is completed and "to be verified by" is chosen then completion is undone we need to remove the "verify" item
      const { _id } = Object.assign({}, this.collection.findOne({ ...query, type }));

      _id && this.collection.remove({ _id });
    })();

    const ret = this.collection.update(query, options);

    (() => {
      const { _id } = Object.assign({}, this.collection.findOne(query));

      this._refreshStatus(_id);
    })();

    return ret;
  },

  _getProblemDoc(docId, docType) {
    const collections = {
      [ProblemTypes.NC]: NonConformities,
      [ProblemTypes.RISK]: Risks
    };

    const docCollection = collections[docType];

    return docCollection && docCollection.findOne({ _id: docId });
  }
}
