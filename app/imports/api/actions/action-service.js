import { Actions } from './actions.js';
import { ActionTypes, ProblemTypes, WorkflowTypes } from '../constants.js';
import { NonConformities } from '../non-conformities/non-conformities.js';
import { Risks } from '../risks/risks.js';
import ActionWorkflow from './ActionWorkflow.js';
import NCWorkflow from '../non-conformities/NCWorkflow.js';
import RiskWorkflow from '../risks/RiskWorkflow.js';
import Utils from '/imports/core/utils.js';


export default {
  collection: Actions,

  insert({ organizationId, type, linkedTo, ...args }) {
    linkedTo && this._checkLinkedDocs(linkedTo);

    const serialNumber = Utils.generateSerialNumber(this.collection, { organizationId });

    const sequentialId = `${type}${serialNumber}`;

    const actionId = this.collection.insert({
      organizationId, type, linkedTo, serialNumber, sequentialId, ...args
    });

    this._refreshStatus(actionId);

    return actionId;
  },

  update({ _id, query = {}, options = {}, ...args }) {
    this._ensureActionExists(_id);

    if (!_.keys(query).length > 0) {
      query = { _id };
    }
    if (!_.keys(options).length > 0) {
      options['$set'] = args;
    }

    return this.collection.update(query, options);
  },

  linkDocument({ _id, documentId, documentType }) {
    const action = this._getAction(_id);

    let docCollection;
    if (documentType === ProblemTypes.NC) {
      if (action.type === ActionTypes.RISK_CONTROL) {
        throw new Meteor.Error(
          400, 'Risk control cannot be linked to a non-conformity'
        );
      }

      docCollection = NonConformities;
    } else if (documentType === ProblemTypes.RISK) {
      if (action.type === ActionTypes.PREVENTATIVE_ACTION) {
        throw new Meteor.Error(
          400, 'Preventative action cannot be linked to a risk'
        );
      }

      docCollection = Risks;
    }

    if (!docCollection) {
      throw new Meteor.Error(400, 'Invalid document type');
    }

    const doc = docCollection.findOne({ _id: documentId });
    if (!doc) {
      throw new Meteor.Error(400, 'Document does not exist');
    }

    if (action.isLinkedToDocument(documentId, documentType)) {
      throw new Meteor.Error(
        400, 'This action is already linked to specified document'
      );
    }

    this._checkLinkedDocs([{ documentId, documentType }]);

    const ret = this.collection.update({
      _id
    }, {
      $addToSet: {
        linkedTo: { documentId, documentType }
      }
    });

    this._refreshStatus(_id);

    return ret;
  },

  unlinkDocument({ _id, documentId, documentType }) {
    const action = this._getAction(_id);

    if (!action.isLinkedToDocument(documentId, documentType)) {
      throw new Meteor.Error(
        400, 'This action is not linked to specified document'
      );
    }

    const ret = this.collection.update({
      _id
    }, {
      $pull: {
        linkedTo: { documentId, documentType }
      }
    });

    Meteor.isServer && Meteor.defer(() => {
      const workflowConstructors = {
        [ProblemTypes.NC]: NCWorkflow,
        [ProblemTypes.RISK]: RiskWorkflow
      };
      new workflowConstructors[documentType](documentId).refreshStatus();

      const workflow = new ActionWorkflow(_id);
      workflow.refreshStatus();
      workflow.refreshLinkedDocsStatuses();
    });

    return ret;
  },

  complete({ _id, userId, completionComments }) {
    const action = this._getAction(_id);

    if (userId !== action.toBeCompletedBy) {
      throw new Meteor.Error(400, 'You cannot complete this action');
    }

    if (!action.canBeCompleted()) {
      throw new Meteor.Error(400, 'This action cannot be completed');
    }

    const ret = this.collection.update({
      _id
    }, {
      $set: {
        isCompleted: true,
        completedBy: userId,
        completedAt: new Date(),
        completionComments
      }
    });

    this._refreshStatus(_id);

    return ret;
  },

  undoCompletion({ _id, userId }) {
    const action = this._getAction(_id);

    if (userId !== action.completedBy) {
      throw new Meteor.Error(400, 'You cannot undo completion of this action');
    }

    if (!action.canCompletionBeUndone()) {
      throw new Meteor.Error(400, 'Completion of this action cannot be undone');
    }

    const ret = this.collection.update({
      _id
    }, {
      $set: {
        isCompleted: false
      },
      $unset: {
        completedBy: '',
        completedAt: '',
        completionComments: ''
      }
    });

    this._refreshStatus(_id);

    return ret;
  },

  verify({ _id, userId, success, verificationComments }) {
    const action = this._getAction(_id);

    if (userId !== action.toBeVerifiedBy) {
      throw new Meteor.Error(400, 'You cannot verify this action');
    }

    if (!action.canBeVerified()) {
      throw new Meteor.Error(400, 'This action cannot be verified');
    }

    const ret = this.collection.update({
      _id
    }, {
      $set: {
        isVerified: true,
        isVerifiedAsEffective: success,
        verifiedBy: userId,
        verifiedAt: new Date,
        verificationComments
      }
    });

    this._refreshStatus(_id);

    return ret;
  },

  undoVerification({ _id, userId }) {
    const action = this._getAction(_id);

    if (userId !== action.verifiedBy) {
      throw new Meteor.Error(400, 'You cannot undo verification of this action');
    }

    if (!action.canVerificationBeUndone()) {
      throw new Meteor.Error(400, 'Verification of this action cannot be undone');
    }

    const ret = this.collection.update({
      _id
    }, {
      $set: {
        isVerified: false
      },
      $unset: {
        verifiedBy: '',
        verifiedAt: '',
        verificationComments: ''
      }
    });

    this._refreshStatus(_id);

    return ret;
  },

  setCompletionDate({ _id, targetDate }) {
    const action = this._getAction(_id);

    if (action.completed()) {
      throw new Meteor.Error(
        400, 'Cannot set completion date for completed action'
      );
    }

    const ret = this.collection.update({
      _id
    }, {
      $set: { completionTargetDate: targetDate }
    });

    this._refreshStatus(_id);

    return ret;
  },

  setVerificationDate({ _id, targetDate }) {
    const action = this._getAction(_id);

    if (action.verified()) {
      throw new Meteor.Error(
        400, 'Cannot set verification date for verified action'
      );
    }

    const ret = this.collection.update({
      _id
    }, {
      $set: { verificationTargetDate: targetDate }
    });

    this._refreshStatus(_id);

    return ret;
  },

  updateViewedBy({ _id, userId }) {
    this._ensureActionExists(_id);

    if (!!this.collection.findOne({ _id, viewedBy: userId })) {
      throw new Meteor.Error(
        400, 'You have been already added to this list'
      );
    }

    return this.collection.update({ _id }, {
      $addToSet: {
        viewedBy: userId
      }
    });
  },

  remove({ _id, deletedBy, isDeleted }) {
    this._ensureActionExists(_id);

    const query = { _id };

    if (isDeleted) {
      return this.collection.remove(query);
    } else {
      const options = {
        $set: {
          isDeleted: true,
          deletedBy,
          deletedAt: new Date()
        }
      };

      const ret = this.collection.update(query, options);

      this._refreshStatus(_id);

      return ret;
    }
  },

  _ensureActionExists(_id) {
    if (!this.collection.findOne({ _id })) {
      throw new Meteor.Error(400, 'Action does not exist');
    }
  },

  _getAction(_id) {
    const action = this.collection.findOne({ _id });
    if (!action) {
      throw new Meteor.Error(400, 'Action does not exist');
    }
    return action;
  },

  _refreshStatus(_id) {
    Meteor.isServer && Meteor.defer(() => {
      const workflow = new ActionWorkflow(_id);
      workflow.refreshStatus();
      workflow.refreshLinkedDocsStatuses();
    });
  },

  _checkLinkedDocs(linkedTo) {
    const linkedToByType = _.groupBy(linkedTo, doc => doc.documentType);

    const NCsIds = _.pluck(linkedToByType[ProblemTypes.NC], 'documentId');
    const risksIds = _.pluck(linkedToByType[ProblemTypes.RISK], 'documentId');

    const docWithUncompletedAnalysis = NonConformities.findOne({
      _id: { $in: NCsIds },
      workflowType: WorkflowTypes.SIX_STEP,
      'analysis.status': 0 // Not completed
    }) || Risks.findOne({
      _id: { $in: risksIds },
      workflowType: WorkflowTypes.SIX_STEP,
      'analysis.status': 0 // Not completed
    });

    if (docWithUncompletedAnalysis) {
      const { sequentialId, title } = docWithUncompletedAnalysis;
      const docName = `${sequentialId} ${title}`;

      throw new Meteor.Error(
        400,
        `Action can not be linked to "${docName}" while its root cause analysis is uncompleted`
      );
    }
  }
};
