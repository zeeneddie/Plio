import { Actions } from '/imports/share/collections/actions.js';
import { NonConformities } from '/imports/share/collections/non-conformities.js';
import { Risks } from '/imports/share/collections/risks.js';
import { WorkItems } from '/imports/share/collections/work-items.js';
import BaseEntityService from '../base-entity-service.js';
import { ProblemTypes, WorkItemsStore, WorkflowTypes } from '/imports/share/constants.js';


const {
  COMPLETE_ACTION,
  VERIFY_ACTION,
  COMPLETE_ANALYSIS,
  COMPLETE_UPDATE_OF_STANDARDS
} = WorkItemsStore.TYPES;

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
    this._completed(actionId, COMPLETE_ACTION);
  },

  actionCompletionCanceled(actionId) {
    this._canceled(actionId, COMPLETE_ACTION);

    this.collection.remove({
      'linkedDoc._id': actionId,
      type: WorkItemsStore.TYPES.VERIFY_ACTION,
      isCompleted: false
    });
  },

  actionVerified(actionId) {
    this._completed(actionId, VERIFY_ACTION);
  },

  actionVerificationCanceled(actionId) {
    this._canceled(actionId, VERIFY_ACTION);
  },

  actionCompletionUserUpdated(actionId, userId) {
    this._userUpdated(actionId, userId, COMPLETE_ACTION);
  },

  actionCompletionDateUpdated(actionId, date) {
    this._dateUpdated(actionId, date, COMPLETE_ACTION);
  },

  actionVerificationUserUpdated(actionId, userId) {
    this._userUpdated(actionId, userId, VERIFY_ACTION);
  },

  actionVerificationDateUpdated(actionId, date) {
    this._dateUpdated(actionId, date, VERIFY_ACTION);
  },

  actionWorkflowChanged(actionId, workflowType) {
    if (workflowType === WorkflowTypes.THREE_STEP) {
      this.collection.remove({
        'linkedDoc._id': actionId,
        type: WorkItemsStore.TYPES.VERIFY_ACTION,
        isCompleted: false
      });
    }
  },

  analysisCompleted(docId, docType) {
    this._completed(docId, COMPLETE_ANALYSIS, docType);
  },

  analysisCanceled(docId, docType) {
    this._canceled(docId, COMPLETE_ANALYSIS, docType);

    this.collection.remove({
      'linkedDoc._id': docId,
      type: WorkItemsStore.TYPES.COMPLETE_UPDATE_OF_STANDARDS,
      isCompleted: false
    });
  },

  standardsUpdated(docId, docType) {
    this._completed(docId, COMPLETE_UPDATE_OF_STANDARDS, docType);
  },

  standardsUpdateCanceled(docId, docType) {
    this._canceled(docId, COMPLETE_UPDATE_OF_STANDARDS, docType);
  },

  analysisUserUpdated(docId, docType, userId) {
    this._userUpdated(docId, userId, COMPLETE_ANALYSIS, docType);
  },

  analysisDateUpdated(docId, docType, date) {
    this._dateUpdated(docId, date, COMPLETE_ANALYSIS, docType);
  },

  updateOfStandardsUserUpdated(docId, docType, userId) {
    this._userUpdated(docId, userId, COMPLETE_UPDATE_OF_STANDARDS, docType);
  },

  updateOfStandardsDateUpdated(docId, docType, date) {
    this._dateUpdated(docId, date, COMPLETE_UPDATE_OF_STANDARDS, docType);
  },

  _userUpdated(docId, userId, workItemType, docType) {
    const { _id } = this.collection.findOne({
      'linkedDoc._id': docId,
      type: workItemType,
      isCompleted: false
    }) || {};

    if (!_id) {
      const {
        organizationId, targetDate, type
      } = this._getDocData(docId, docType, workItemType);

      const newId = this.collection.insert({
        organizationId,
        targetDate,
        assigneeId: userId,
        type: workItemType,
        linkedDoc: {
          type,
          _id: docId
        }
      });
    } else {
      this.collection.update({ _id }, {
        $set: { assigneeId: userId }
      });
    }
  },

  _dateUpdated(docId, date, workItemType, docType) {
    this.collection.update({
      'linkedDoc._id': docId,
      type: workItemType,
      isCompleted: false
    }, {
      $set: { targetDate: date }
    });
  },

  _completed(docId, workItemType, docType) {
    this.collection.update({
      'linkedDoc._id': docId,
      type: workItemType,
      isCompleted: false
    }, {
      $set: { isCompleted: true }
    });
  },

  _canceled(docId, workItemType, docType) {
    this.collection.update({
      'linkedDoc._id': docId,
      type: workItemType,
      isCompleted: true
    }, {
      $set: { isCompleted: false }
    });
  },

  _getDocData(docId, docType, workItemType) {
    let doc, targetDate, type;

    if (docType) {
      doc = this._getProblemDoc(docId, docType);
      type = docType;

      if (workItemType === COMPLETE_ANALYSIS) {
        targetDate = doc.analysis.targetDate;
      } else if (workItemType === COMPLETE_UPDATE_OF_STANDARDS) {
        targetDate = doc.updateOfStandards.targetDate;
      }
    } else {
      doc = Actions.findOne({ _id: docId });
      type = doc.type;

      if (workItemType === COMPLETE_ACTION) {
        targetDate = doc.completionTargetDate;
      } else if (workItemType === VERIFY_ACTION) {
        targetDate = doc.verificationTargetDate;
      }
    }

    return {
      organizationId: doc.organizationId,
      targetDate,
      type
    };
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
