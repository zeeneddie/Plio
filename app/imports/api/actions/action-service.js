import { Actions } from './actions.js';
import { ProblemTypes } from '../constants.js';
import { NonConformities } from '../non-conformities/non-conformities.js';
import { Risks } from '../risks/risks.js';
import Utils from '/imports/core/utils.js';
import BaseEntityService from '../base-entity-service.js';
import WorkItemService from '../work-items/work-item-service.js';

if (Meteor.isServer) {
  import ActionWorkflow from '/imports/core/workflow/server/ActionWorkflow.js';
  import NCWorkflow from '/imports/core/workflow/server/NCWorkflow.js';
  import RiskWorkflow from '/imports/core/workflow/server/RiskWorkflow.js';
}


export default {
  collection: Actions,

  _service: new BaseEntityService(Actions),

  insert({
    organizationId, type, linkedTo,
    completionTargetDate, toBeCompletedBy, ...args
  }) {
    const serialNumber = Utils.generateSerialNumber(this.collection, { organizationId, type });

    const sequentialId = `${type}${serialNumber}`;

    const actionId = this.collection.insert({
      organizationId, type, linkedTo,
      serialNumber, sequentialId, completionTargetDate,
      toBeCompletedBy, ...args
    });

    Meteor.isServer && Meteor.defer(() => {
      WorkItemService.actionCreated(actionId);
      this._refreshStatus(actionId);
    });

    return actionId;
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

  linkDocument({ _id, documentId, documentType }, { doc, action }) {
    const ret = this.collection.update({
      _id
    }, {
      $addToSet: {
        linkedTo: { documentId, documentType }
      }
    });

    if (doc.areStandardsUpdated() && !action.verified()) {
      docCollection.update({ _id: documentId }, {
        $set: {
          'updateOfStandards.status': 0, // Not completed
        },
        $unset: {
          'updateOfStandards.completedAt': '',
          'updateOfStandards.completedBy': ''
        }
      });
    }

    Meteor.isServer && Meteor.defer(() => {
      WorkItemService.actionUpdated(_id);
      this._refreshLinkedDocStatus(documentId, documentType);
      this._refreshStatus(_id);
    });

    return ret;
  },

  unlinkDocument({ _id, documentId, documentType }) {
    const ret = this.collection.update({
      _id
    }, {
      $pull: {
        linkedTo: { documentId, documentType }
      }
    });

    Meteor.isServer && Meteor.defer(() => {
      WorkItemService.actionUpdated(_id);
      this._refreshLinkedDocStatus(documentId, documentType);
      this._refreshStatus(_id);
    });

    return ret;
  },

  complete({ _id, userId, completionComments }) {
    const ret = this.collection.update({
      _id
    }, {
      $set: {
        completionComments,
        isCompleted: true,
        completedBy: userId,
        completedAt: new Date()
      }
    });

    Meteor.isServer && Meteor.defer(() => {
      WorkItemService.actionCompleted(_id);
      this._refreshStatus(_id);
    });

    return ret;
  },

  undoCompletion({ _id, userId }) {
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

    Meteor.isServer && Meteor.defer(() => {
      WorkItemService.actionCompletionCanceled(_id);
      this._refreshStatus(_id);
    });

    return ret;
  },

  verify({ _id, userId, success, verificationComments }) {
    const ret = this.collection.update({
      _id
    }, {
      $set: {
        verificationComments,
        isVerified: true,
        isVerifiedAsEffective: success,
        verifiedBy: userId,
        verifiedAt: new Date
      }
    });

    Meteor.isServer && Meteor.defer(() => {
      WorkItemService.actionVerified(_id);
      this._refreshStatus(_id);
    });

    return ret;
  },

  undoVerification({ _id, userId }, { action }) {
    const query = {
      'updateOfStandards.status': 1, // Completed
      'updateOfStandards.completedAt': { $exists: true },
      'updateOfStandards.completedBy': { $exists: true }
    };

    const modifier = {
      $set: {
        'updateOfStandards.status': 0, // Not completed
      },
      $unset: {
        'updateOfStandards.completedAt': '',
        'updateOfStandards.completedBy': ''
      }
    };

    const linkedNCsIds = action.getLinkedNCsIds();
    const linkedRisksIds = action.getLinkedRisksIds();

    if (linkedNCsIds.length) {
      const NCQuery = _.extend({ _id: { $in: linkedNCsIds } }, query);
      NonConformities.update(NCQuery, modifier, { multi: true });
    }

    if (linkedRisksIds.length) {
      const riskQuery = _.extend({ _id: { $in: linkedRisksIds } }, query);
      Risks.update(riskQuery, modifier, { multi: true });
    }

    const ret = this.collection.update({
      _id
    }, {
      $set: {
        isVerified: false,
        isVerifiedAsEffective: false
      },
      $unset: {
        verifiedBy: '',
        verifiedAt: '',
        verificationComments: ''
      }
    });

    Meteor.isServer && Meteor.defer(() => {
      WorkItemService.actionVerificationCanceled(_id);
      this._refreshStatus(_id);
    });

    return ret;
  },

  setCompletionDate({ _id, targetDate }) {
    const ret = this.collection.update({
      _id
    }, {
      $set: { completionTargetDate: targetDate }
    });

    Meteor.isServer && Meteor.defer(() => {
      WorkItemService.actionUpdated(_id);
      this._refreshStatus(_id);
    });

    return ret;
  },

  setCompletionExecutor({ _id, userId }) {
    const ret = this.collection.update({
      _id
    }, {
      $set: { toBeCompletedBy: userId }
    });

    Meteor.isServer && Meteor.defer(() => WorkItemService.actionUpdated(_id));

    return ret;
  },

  setVerificationDate({ _id, targetDate }) {
    const ret = this.collection.update({
      _id
    }, {
      $set: { verificationTargetDate: targetDate }
    });

    Meteor.isServer && Meteor.defer(() => {
      WorkItemService.actionUpdated(_id);
      this._refreshStatus(_id);
    });

    return ret;
  },

  setVerificationExecutor({ _id, userId }) {
    const ret = this.collection.update({
      _id
    }, {
      $set: { toBeVerifiedBy: userId }
    });

    Meteor.isServer && Meteor.defer(() => WorkItemService.actionUpdated(_id));

    return ret;
  },

  updateViewedBy({ _id, userId:viewedBy }) {
    this._service.updateViewedBy({ _id, viewedBy });
  },

  remove({ _id, deletedBy }) {
    const ret = this._service.remove({ _id, deletedBy });

    Meteor.isServer && Meteor.defer(() => this._refreshStatus(_id));

    return ret;
  },

  restore({ _id }) {
    const ret = this._service.restore({ _id });

    Meteor.isServer && Meteor.defer(() => this._refreshStatus(_id));

    return ret;
  },

  _refreshStatus(_id) {
    const workflow = new ActionWorkflow(_id);
    workflow.refreshStatus();
  },

  _refreshLinkedDocStatus(documentId, documentType) {
    const workflowConstructors = {
      [ProblemTypes.NC]: NCWorkflow,
      [ProblemTypes.RISK]: RiskWorkflow
    };

    new workflowConstructors[documentType](documentId).refreshStatus();
  }
};
