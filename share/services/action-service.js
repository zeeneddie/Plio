import { Actions, Organizations, NonConformities, Risks, Files } from '../../share/collections';
import { WorkflowTypes, ProblemTypes } from '../../share/constants';
import BaseEntityService from './base-entity-service';
import WorkItemService from './work-item-service';
import {
  getCollectionByDocType,
  getWorkflowDefaultStepDate,
  generateSerialNumber,
  getActionWorkflowType,
} from '../../share/helpers';
import { isActionsCompletionSimplified } from '../../share/checkers';

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
      organizationId,
      type,
      linkedTo,
      serialNumber,
      sequentialId,
      completionTargetDate,
      toBeCompletedBy,
      ...args,
    });

    WorkItemService.actionCreated(actionId);

    return actionId;
  },

  update({
    _id,
    query = {},
    options = {},
    ...args
  }) {
    if (!Object.keys(query).length) {
      Object.assign(query, { _id });
    }

    if (!Object.keys(options).length) {
      Object.assign(options, { $set: args });
    }

    return this.collection.update(query, options);
  },

  linkDocument({ _id, documentId, documentType }) {
    const oldAction = this.collection.findOne({ _id });
    const oldWorkflow = oldAction.getWorkflowType();

    const ret = this.collection.update({ _id }, {
      $addToSet: {
        linkedTo: { documentId, documentType },
      },
    });

    const newAction = this.collection.findOne({ _id });
    const newWorkflow = newAction.getWorkflowType();

    if ((newWorkflow !== oldWorkflow)
          && (newWorkflow === WorkflowTypes.THREE_STEP)) {
      this.collection.update({ _id }, {
        $unset: {
          toBeVerifiedBy: '',
          verificationTargetDate: '',
        },
      });

      WorkItemService.actionWorkflowSetToThreeStep(_id);
    }

    if (Object.keys(ProblemTypes).includes(documentType)) {
      const collection = getCollectionByDocType(documentType);
      const doc = collection.findOne({ documentId });

      if (doc.areStandardsUpdated() && !oldAction.verified()) {
        collection.update({ _id: documentId }, {
          $set: {
            'updateOfStandards.status': 0, // Not completed
          },
          $unset: {
            'updateOfStandards.completedAt': '',
            'updateOfStandards.completedBy': '',
          },
        });
      }
    }

    return ret;
  },

  unlinkDocument({ _id, documentId }) {
    const ret = this.collection.update({
      _id,
    }, {
      $pull: {
        linkedTo: { documentId },
      },
    });

    const newAction = this.collection.findOne({ _id });
    const newWorkflow = getActionWorkflowType(newAction);

    if (newWorkflow === WorkflowTypes.THREE_STEP) {
      this.collection.update({ _id }, {
        $unset: {
          toBeVerifiedBy: '',
          verificationTargetDate: '',
        },
      });

      WorkItemService.actionWorkflowSetToThreeStep(_id);
    }

    return ret;
  },

  complete({ _id, completionComments }, { userId }) {
    const action = this.collection.findOne({ _id });
    const {
      linkedTo = [],
      organizationId,
      ownerId,
    } = action;
    const organization = Organizations.findOne({ _id: organizationId });

    const set = {
      completionComments,
      isCompleted: true,
      completedBy: userId,
      completedAt: new Date(),
      verificationTargetDate: getWorkflowDefaultStepDate({ organization, linkedTo }),
    };

    const ret = this.collection.update({
      _id,
    }, {
      $set: set,
    });

    WorkItemService.actionCompleted(_id);

    if (action.getWorkflowType() === WorkflowTypes.SIX_STEP) {
      if (ownerId) this.setVerificationExecutor({ _id, userId: ownerId, assignedBy: userId });

      // Simplified completion of own actions
      if (isActionsCompletionSimplified(action, userId, organization)) {
        return this.verify({
          _id,
          success: true,
          verificationComments: '',
        }, { userId });
      }
    }

    return ret;
  },

  undoCompletion({ _id }) {
    const ret = this.collection.update({
      _id,
    }, {
      $set: {
        isCompleted: false,
      },
      $unset: {
        completedBy: '',
        completedAt: '',
        completionComments: '',
        toBeVerifiedBy: '',
        verificationTargetDate: '',
      },
    });

    WorkItemService.actionCompletionCanceled(_id);

    return ret;
  },

  verify({
    _id,
    success,
    verificationComments,
  }, {
    userId,
  }) {
    const ret = this.collection.update({
      _id,
    }, {
      $set: {
        verificationComments,
        isVerified: true,
        isVerifiedAsEffective: success,
        verifiedBy: userId,
        verifiedAt: new Date(),
      },
    });

    WorkItemService.actionVerified(_id);

    return ret;
  },

  undoVerification({ _id }, { doc: action }) {
    const query = {
      'updateOfStandards.status': 1, // Completed
      'updateOfStandards.completedAt': { $exists: true },
      'updateOfStandards.completedBy': { $exists: true },
    };

    const modifier = {
      $set: {
        'updateOfStandards.status': 0, // Not completed
      },
      $unset: {
        'updateOfStandards.completedAt': '',
        'updateOfStandards.completedBy': '',
      },
    };

    const linkedNCsIds = action.getLinkedNCsIds();
    const linkedRisksIds = action.getLinkedRisksIds();

    if (linkedNCsIds.length) {
      const NCQuery = Object.assign({ _id: { $in: linkedNCsIds } }, query);
      NonConformities.update(NCQuery, modifier, { multi: true });
    }

    if (linkedRisksIds.length) {
      const riskQuery = Object.assign({ _id: { $in: linkedRisksIds } }, query);
      Risks.update(riskQuery, modifier, { multi: true });
    }

    const ret = this.collection.update({
      _id,
    }, {
      $set: {
        isVerified: false,
        isVerifiedAsEffective: false,
      },
      $unset: {
        verifiedBy: '',
        verifiedAt: '',
        verificationComments: '',
      },
    });

    WorkItemService.actionVerificationCanceled(_id);

    return ret;
  },

  remove({ _id, deletedBy }) {
    const workQuery = { query: { 'linkedDoc._id': _id } };
    const onSoftDelete = () =>
      WorkItemService.removeSoftly(workQuery);
    const onPermanentDelete = ({ fileIds }) => {
      WorkItemService.removePermanently(workQuery);

      if (fileIds) Files.remove({ _id: { $in: fileIds } });
    };

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

  removeSoftly({ _id, query }) {
    return this._service.removeSoftly({ _id, query });
  },

  async set({ _id, ...args }) {
    const query = { _id };
    const options = { $set: args };
    return this.collection.update(query, options);
  },
};
