import { Actions } from '/imports/share/collections/actions.js';
import { Organizations } from '/imports/share/collections/organizations.js';
import { NonConformities } from '/imports/share/collections/non-conformities.js';
import { Risks } from '/imports/share/collections/risks.js';
import { ProblemTypes, WorkflowTypes } from '/imports/share/constants.js';
import BaseEntityService from '/imports/share/services/base-entity-service.js';
import WorkItemService from '/imports/share/services/work-item-service.js';
import {
  getCollectionByDocType,
  getWorkflowDefaultStepDate,
  generateSerialNumber
} from '/imports/share/helpers.js';

export default {
  collection: Actions,

  _service: new BaseEntityService(Actions),

  insert({
    organizationId, type, linkedTo,
    completionTargetDate, toBeCompletedBy, ...args
  }) {
    const serialNumber = generateSerialNumber(this.collection, { organizationId, type });

    const sequentialId = `${type}${serialNumber}`;

    const actionId = this.collection.insert({
      organizationId, type, linkedTo,
      serialNumber, sequentialId, completionTargetDate,
      toBeCompletedBy, ...args
    });

    WorkItemService.actionCreated(actionId);

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
    const oldAction = this.collection.findOne({ _id });
    const oldWorkflow = oldAction.getWorkflowType();

    const ret = this.collection.update({ _id }, {
      $addToSet: {
        linkedTo: { documentId, documentType }
      }
    });

    const newAction = this.collection.findOne({ _id });
    const newWorkflow = newAction.getWorkflowType();

    if ((newWorkflow !== oldWorkflow)
          && (newWorkflow === WorkflowTypes.THREE_STEP)) {
      this.collection.update({ _id }, {
        $unset: {
          toBeVerifiedBy: '',
          verificationTargetDate: ''
        }
      });

      WorkItemService.actionWorkflowSetToThreeStep(_id);
    }

    if (doc.areStandardsUpdated() && !action.verified()) {
      const docCollection = getCollectionByDocType(documentType);

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

    const newAction = this.collection.findOne({ _id });
    const newWorkflow = newAction.getWorkflowType();

    if (newWorkflow === WorkflowTypes.THREE_STEP) {
      this.collection.update({ _id }, {
        $unset: {
          toBeVerifiedBy: '',
          verificationTargetDate: ''
        }
      });

      WorkItemService.actionWorkflowSetToThreeStep(_id);
    }

    return ret;
  },

  complete({ _id, userId, completionComments }) {
    const action = this.collection.findOne({ _id });
    const linkedTo = action.linkedTo || [];
    const organization = Organizations.findOne({ _id: action.organizationId });
    const { ownerId } = action;

    // We need to find the owner of the first linked problem to set him as a "To be verified by" user
    const firstLinkedTo = linkedTo[0];

    let set = {
      completionComments,
      isCompleted: true,
      completedBy: userId,
      completedAt: new Date(),
      verificationTargetDate: getWorkflowDefaultStepDate({ organization, linkedTo }),
    };

    const ret = this.collection.update({
      _id
    }, {
      $set: set
    });

    WorkItemService.actionCompleted(_id);
    if (action.getWorkflowType() === WorkflowTypes.SIX_STEP && ownerId) {
      this.setVerificationExecutor({ _id, userId: ownerId, assignedBy: userId });
    }

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
        completionComments: '',
        toBeVerifiedBy: '',
        verificationTargetDate: ''
      }
    });

    WorkItemService.actionCompletionCanceled(_id);

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

    WorkItemService.actionVerified(_id);

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

    WorkItemService.actionVerificationCanceled(_id);

    return ret;
  },

  setCompletionDate({ _id, targetDate }) {
    const ret = this.collection.update({
      _id
    }, {
      $set: { completionTargetDate: targetDate }
    });

    WorkItemService.actionCompletionDateUpdated(_id, targetDate);

    return ret;
  },

  setCompletionExecutor({ _id, userId, assignedBy }) {
    const ret = this.collection.update({
      _id,
    }, {
      $set: {
        toBeCompletedBy: userId,
        completionAssignedBy: assignedBy,
      },
    });

    WorkItemService.actionCompletionUserUpdated(_id, userId);

    return ret;
  },

  setVerificationDate({ _id, targetDate }) {
    const ret = this.collection.update({
      _id
    }, {
      $set: { verificationTargetDate: targetDate }
    });

    WorkItemService.actionVerificationDateUpdated(_id, targetDate);

    return ret;
  },

  setVerificationExecutor({ _id, userId, assignedBy }) {
    const ret = this.collection.update({
      _id,
    }, {
      $set: {
        toBeVerifiedBy: userId,
        verificationAssignedBy: assignedBy,
      },
    });

    WorkItemService.actionVerificationUserUpdated(_id, userId);

    return ret;
  },

  updateViewedBy({ _id, userId:viewedBy }) {
    this._service.updateViewedBy({ _id, viewedBy });
  },

  remove({ _id, deletedBy }) {
    const workQuery = { query: { 'linkedDoc._id': _id } };
    const onSoftDelete = () =>
      WorkItemService.removeSoftly(workQuery);
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

  removeSoftly({ _id, query }) {
    return this._service.removeSoftly({ _id, query });
  },
};
