import { Actions, NonConformities, Risks, WorkItems } from '../collections';
import BaseEntityService from './base-entity-service';
import { ProblemTypes, WorkItemsStore } from '../constants';


const {
  COMPLETE_ACTION,
  VERIFY_ACTION,
  COMPLETE_ANALYSIS,
  COMPLETE_UPDATE_OF_DOCUMENTS,
} = WorkItemsStore.TYPES;

export default {
  collection: WorkItems,

  _service: new BaseEntityService(WorkItems),

  insert({ ...args }) {
    return this.collection.insert({ ...args });
  },

  update({
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

  updateViewedBy({ _id, viewedBy }) {
    return this._service.updateViewedBy({ _id, viewedBy });
  },

  remove({ _id, deletedBy }) {
    return this._service.remove({ _id, deletedBy });
  },

  restore({ _id, query }) {
    return this._service.restore({ _id, query });
  },

  removePermanently({ _id, query }) {
    return this._service.removePermanently({ _id, query });
  },

  removeSoftly({ _id, query }) {
    return this._service.removeSoftly({ _id, query });
  },

  actionCreated(actionId) {
    const action = Actions.findOne({ _id: actionId });
    const {
      organizationId,
      type,
      completionTargetDate,
      toBeCompletedBy,
      viewedBy = [],
      createdBy,
    } = action;

    this.collection.insert({
      organizationId,
      targetDate: completionTargetDate,
      assigneeId: toBeCompletedBy,
      type: WorkItemsStore.TYPES.COMPLETE_ACTION,
      viewedBy,
      createdBy,
      linkedDoc: {
        type,
        _id: actionId,
      },
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
      isCompleted: false,
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

  actionWorkflowSetToThreeStep(actionId) {
    this.collection.remove({
      'linkedDoc._id': actionId,
      type: WorkItemsStore.TYPES.VERIFY_ACTION,
      isCompleted: false,
    });
  },

  analysisCompleted(docId, docType) {
    this._completed(docId, COMPLETE_ANALYSIS, docType);
  },

  analysisCanceled(docId, docType) {
    this._canceled(docId, COMPLETE_ANALYSIS, docType);

    this.collection.remove({
      'linkedDoc._id': docId,
      type: WorkItemsStore.TYPES.COMPLETE_UPDATE_OF_DOCUMENTS,
      isCompleted: false,
    });
  },

  standardsUpdated(docId, docType) {
    this._completed(docId, COMPLETE_UPDATE_OF_DOCUMENTS, docType);
  },

  standardsUpdateCanceled(docId, docType) {
    this._canceled(docId, COMPLETE_UPDATE_OF_DOCUMENTS, docType);
  },

  analysisUserUpdated(docId, docType, userId) {
    this._userUpdated(docId, userId, COMPLETE_ANALYSIS, docType);
  },

  analysisDateUpdated(docId, docType, date) {
    this._dateUpdated(docId, date, COMPLETE_ANALYSIS, docType);
  },

  updateOfStandardsUserUpdated(docId, docType, userId) {
    this._userUpdated(docId, userId, COMPLETE_UPDATE_OF_DOCUMENTS, docType);
  },

  updateOfStandardsDateUpdated(docId, docType, date) {
    this._dateUpdated(docId, date, COMPLETE_UPDATE_OF_DOCUMENTS, docType);
  },

  _userUpdated(docId, userId, workItemType, docType) {
    const { _id } = this.collection.findOne({
      'linkedDoc._id': docId,
      type: workItemType,
      isCompleted: false,
    }) || {};

    if (!_id) {
      const {
        organizationId, targetDate, type,
      } = this._getDocData(docId, docType, workItemType);

      this.collection.insert({
        organizationId,
        targetDate,
        assigneeId: userId,
        type: workItemType,
        linkedDoc: {
          type,
          _id: docId,
        },
      });
    } else {
      this.collection.update({ _id }, {
        $set: { assigneeId: userId },
      });
    }
  },

  _dateUpdated(docId, date, workItemType) {
    this.collection.update({
      'linkedDoc._id': docId,
      type: workItemType,
      isCompleted: false,
    }, {
      $set: { targetDate: date },
    });
  },

  _completed(docId, workItemType) {
    this.collection.update({
      'linkedDoc._id': docId,
      type: workItemType,
      isCompleted: false,
    }, {
      $set: { isCompleted: true },
    });
  },

  _canceled(docId, workItemType) {
    this.collection.update({
      'linkedDoc._id': docId,
      type: workItemType,
      isCompleted: true,
    }, {
      $set: { isCompleted: false },
    });
  },

  _getDocData(docId, docType, workItemType) {
    let doc;
    let targetDate;
    let type;

    if (docType) {
      doc = this._getProblemDoc(docId, docType);
      type = docType;

      if (workItemType === COMPLETE_ANALYSIS) {
        ({ targetDate } = doc.analysis);
      } else if (workItemType === COMPLETE_UPDATE_OF_DOCUMENTS) {
        ({ targetDate } = doc.updateOfStandards);
      }
    } else {
      doc = Actions.findOne({ _id: docId });
      ({ type } = doc);

      if (workItemType === COMPLETE_ACTION) {
        targetDate = doc.completionTargetDate;
      } else if (workItemType === VERIFY_ACTION) {
        targetDate = doc.verificationTargetDate;
      }
    }

    return {
      organizationId: doc.organizationId,
      targetDate,
      type,
    };
  },

  _getProblemDoc(docId, docType) {
    const collections = {
      [ProblemTypes.NON_CONFORMITY]: NonConformities,
      [ProblemTypes.POTENTIAL_GAIN]: NonConformities,
      [ProblemTypes.RISK]: Risks,
    };

    const docCollection = collections[docType];

    return docCollection && docCollection.findOne({ _id: docId });
  },
};
