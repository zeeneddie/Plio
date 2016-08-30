import { Actions } from '/imports/api/actions/actions.js';
import { CollectionNames } from '/imports/api/constants.js';
import Auditor from './auditor.js';
import ChangesKinds from './changes-kinds.js';
import {
  isDeletedField,
  filesField,
  fileUrlField,
  notesField,
  notifyField,
  ownerIdField,
  titleField
} from './reusable-update-cases.js';
import Utils from '../../utils.js';


const getNotificationReceivers = ({ linkedTo, ownerId }) => {
  const getLinkedDocsIds = (linkedDocs, docType) => {
    return _.pluck(
      _.filter(linkedDocs, ({ documentType }) => documentType === docType),
      'documentId'
    );
  };

  const usersIds = new Set([ownerId]);
  const standardsIds = new Set();

  const NCsIds = getLinkedDocsIds(linkedTo, ProblemTypes.NC);
  const risksIds = getLinkedDocsIds(linkedTo, ProblemTypes.RISK);

  const ids = { NonConformities: NCsIds, Risks: risksIds };

  const getIds = (collection) => {
    const query = { _id: { $in: ids[collection] } };

    collection.find(query).forEach(({ standardsIds, identifiedBy }) => {
      _(standardsIds).each(id => standardsIds.add(id));
      usersIds.add(identifiedBy);
    });
  };

  _([NonConformities, Risks]).each(collection => getIds(collection));

  Standards.find({
    _id: { $in: standardsIds }
  }).forEach(({ owner }) => usersIds.add(owner));

  return Array.from(usersIds);
};

const getLinkedDocName = (documentId, documentType) => {
  const docAuditConfigs = {
    [ProblemTypes.NC]: NCAuditConfig,
    [ProblemTypes.RISK]: RiskAuditConfig
  };

  return docAuditConfigs[documentType].docDescription(documentId);
};


const ActionAuditConfig = {

  collectionName: CollectionNames.ACTIONS,

  onCreated: {
    logTemplate: 'Document created',
    notificationTemplate: '',
    logData() { },
    notificationData() { },
    notificationReceivers() { },
    additionalHandlers({ newDoc }) {
      return _(newDoc.linkedTo).map(({ documentId, documentType }) => {
        const docAuditConfigs = {
          [ProblemTypes.NC]: NCAuditConfig,
          [ProblemTypes.RISK]: RiskAuditConfig
        };

        return {
          config: docAuditConfigs[documentType],
          handler: actionLinkChanged,
          args: [{
            action: newDoc,
            kind: ChangesKinds.ITEM_ADDED,
            documentId
          }]
        };
      });
    }
  },

  updateCases: [
    {
      field: 'completedAt',
      logTemplate: {
        [ChangesKinds.FIELD_ADDED]:
          'Completion date set to "{{newValue}}"',
        [ChangesKinds.FIELD_CHANGED]:
          'Completion date changed from "{{oldValue}}" to "{{newValue}}"',
        [ChangesKinds.FIELD_REMOVED]:
          'Completion date removed'
      },
      notificationTemplate: {
        [ChangesKinds.FIELD_ADDED]:
          '{{userName}} set completion date of {{docDesc}} to "{{newValue}}"',
        [ChangesKinds.FIELD_CHANGED]:
          '{{userName}} changed completion date of {{docDesc}} from "{{oldValue}}" to "{{newValue}}"',
        [ChangesKinds.FIELD_REMOVED]:
          '{{userName}} removed completion date of {{docDesc}}'
      },
      logData({ diffs: { completedAt } }) {
        return {
          newValue: Utils.getPrettyUTCDate(completedAt.newValue),
          oldValue: Utils.getPrettyUTCDate(completedAt.oldValue)
        };
      },
      notificationData({ diffs: { completedAt }, newDoc }) {
        return {
          docDesc: this.docDescription(newDoc),
          userName: Utils.getUserFullNameOrEmail(completedAt.executor),
          newValue: Utils.getPrettyUTCDate(completedAt.newValue),
          oldValue: Utils.getPrettyUTCDate(completedAt.oldValue)
        };
      },
      notificationReceivers({ newDoc }) {
        return getNotificationReceivers(newDoc);
      }
    },

    {
      field: 'completedBy',
      logTemplate: {
        [ChangesKinds.FIELD_ADDED]:
          'Completion executor set to {{newValue}}',
        [ChangesKinds.FIELD_CHANGED]:
          'Completion executor changed from {{oldValue}} to {{newValue}}',
        [ChangesKinds.FIELD_REMOVED]:
          'Completion executor removed'
      },
      notificationTemplate: {
        [ChangesKinds.FIELD_ADDED]:
          '{{userName}} set completion executor of {{docDesc}} to {{newValue}}',
        [ChangesKinds.FIELD_CHANGED]:
          '{{userName}} changed completion executor of {{docDesc}} from {{oldValue}} to {{newValue}}',
        [ChangesKinds.FIELD_REMOVED]:
          '{{userName}} removed completion executor of {{docDesc}}'
      },
      logData({ diffs: { completedBy } }) {
        return {
          newValue: Utils.getUserFullNameOrEmail(completedBy.newValue),
          oldValue: Utils.getUserFullNameOrEmail(completedBy.oldValue)
        };
      },
      notificationData({ diffs: { completedBy }, newDoc }) {
        return {
          docDesc: this.docDescription(newDoc),
          userName: Utils.getUserFullNameOrEmail(completedBy.executor),
          newValue: Utils.getUserFullNameOrEmail(completedBy.newValue),
          oldValue: Utils.getUserFullNameOrEmail(completedBy.oldValue)
        };
      },
      notificationReceivers({ newDoc }) {
        return getNotificationReceivers(newDoc);
      }
    },

    {
      field: 'completionComments',
      logTemplate: {
        [ChangesKinds.FIELD_ADDED]: 'Completion comments set',
        [ChangesKinds.FIELD_CHANGED]: 'Completion comments changed',
        [ChangesKinds.FIELD_REMOVED]: 'Completion comments removed'
      },
      notificationTemplate: {
        [ChangesKinds.FIELD_ADDED]:
          '{{userName}} set completion comments of {{docDesc}}',
        [ChangesKinds.FIELD_CHANGED]:
          '{{userName}} changed completion comments of {{docDesc}}',
        [ChangesKinds.FIELD_REMOVED]:
          '{{userName}} removed completion comments of {{docDesc}}'
      },
      logData() { },
      notificationData({ diffs: { completionComments }, newDoc }) {
        return {
          docDesc: this.docDescription(newDoc),
          userName: Utils.getUserFullNameOrEmail(completionComments.executor),
          newValue: completionComments.newValue,
          oldValue: completionComments.oldValue
        };
      },
      notificationReceivers({ newDoc }) {
        return getNotificationReceivers(newDoc);
      }
    },

    {
      field: 'completionTargetDate',
      logTemplate: {
        [ChangesKinds.FIELD_ADDED]:
          'Completion target date set to "{{newValue}}"',
        [ChangesKinds.FIELD_CHANGED]:
          'Completion target date changed from "{{oldValue}}" to "{{newValue}}"',
        [ChangesKinds.FIELD_REMOVED]:
          'Completion target date removed'
      },
      notificationTemplate: {
        [ChangesKinds.FIELD_ADDED]:
          '{{userName}} set completion target date of {{docDesc}} to "{{newValue}}"',
        [ChangesKinds.FIELD_CHANGED]:
          '{{userName}} changed completion target date of {{docDesc}} from "{{oldValue}}" to "{{newValue}}"',
        [ChangesKinds.FIELD_REMOVED]:
          '{{userName}} removed completion target date of {{docDesc}}'
      },
      logData({ diffs: { completionTargetDate } }) {
        return {
          newValue: Utils.getPrettyUTCDate(completionTargetDate.newValue),
          oldValue: Utils.getPrettyUTCDate(completionTargetDate.oldValue)
        };
      },
      notificationData({ diffs: { completionTargetDate }, newDoc }) {
        return {
          docDesc: this.docDescription(newDoc),
          userName: Utils.getUserFullNameOrEmail(completionTargetDate.executor),
          newValue: Utils.getPrettyUTCDate(completionTargetDate.newValue),
          oldValue: Utils.getPrettyUTCDate(completionTargetDate.oldValue)
        };
      },
      notificationReceivers({ newDoc }) {
        return getNotificationReceivers(newDoc);
      }
    },

    {
      field: 'isCompleted',
      additionalFields: ['completedAt', 'completedBy', 'completionComments'],
      shouldCreateLog({ diffs: { completedAt, completedBy } }) {
        return completedAt && completedBy;
      },
      shouldSendNotification({ diffs: { completedAt, completedBy } }) {
        return completedAt && completedBy;
      },
      logTemplate: {
        [ChangesKinds.FIELD_CHANGED]:
          '{{#if completed}}' +
            'Action completed{{#if comments}}: {{comments}}{{/if}}' +
          '{{else}}' +
            'Action completion canceled' +
          '{{/if}}'
      },
      notificationTemplate: {
        [ChangesKinds.FIELD_CHANGED]:
          '{{#if completed}}' +
            '{{userName}} completed {{docDesc}}' +
            '{{#if comments}} with following comments: {{comments}}{{/if}}' +
          '{{else}}' +
            '{{userName}} canceled completion of {{docDesc}}' +
          '{{/if}}'
      },
      logData({ diffs: { isCompleted, completionComments } }) {
        return {
          completed: isCompleted.newValue,
          comments: completionComments && completionComments.newValue
        };
      },
      notificationData({ diffs: { isCompleted, completionComments }, newDoc }) {
        return {
          docDesc: this.docDescription(newDoc),
          completed: isCompleted.newValue,
          comments: completionComments && completionComments.newValue,
          userName: Utils.getUserFullNameOrEmail(isCompleted.executor)
        };
      },
      notificationReceivers({ newDoc }) {
        return getNotificationReceivers(newDoc);
      }
    },

    {
      field: 'isVerified',
      additionalFields: [
        'isVerified',
        'verifiedAt',
        'verifiedBy',
        'isVerifiedAsEffective',
        'verificationComments'
      ],
      shouldCreateLog({ diffs: { verifiedAt, verifiedBy } }) {
        return verifiedAt && verifiedBy;
      },
      shouldSendNotification({ diffs: { verifiedAt, verifiedBy } }) {
        return verifiedAt && verifiedBy;
      },
      logTemplate: {
        [ChangesKinds.FIELD_CHANGED]:
          '{{#if verified}}' +
            '{{#if verifiedAsEffective}}' +
              'Action verified as effective {{#if comments}}: {{comments}}{{/if}}' +
            '{{else}}' +
              'Action failed verification {{#if comments}}: {{comments}}{{/if}}' +
            '{{/if}}' +
          '{{else}}' +
            'Action verification canceled' +
          '{{/if}}'
      },
      notificationTemplate: {
        [ChangesKinds.FIELD_CHANGED]:
          '{{#if verified}}' +
            '{{#if verifiedAsEffective}}' +
              '{{userName}} verified {{docDesc}} as effective' +
              '{{#if comments}} with following comments: {{comments}}{{/if}}' +
            '{{else}}' +
              '{{userName}} failed verification of {{docDesc}}' +
              '{{#if comments}} with following comments: {{comments}}{{/if}}' +
            '{{/if}}' +
          '{{else}}' +
            '{{userName}} canceled verification of {{docDesc}}' +
          '{{/if}}'
      },
      logData({ diffs: { isVerified, verificationComments } }) {
        return {
          verified: isVerified.newValue,
          comments: verificationComments && verificationComments.newValue
        };
      },
      notificationData({ diffs: { isVerified, verificationComments }, newDoc }) {
        return {
          docDesc: this.docDescription(newDoc),
          completed: isVerified.newValue,
          comments: verificationComments && verificationComments.newValue,
          userName: Utils.getUserFullNameOrEmail(isVerified.executor)
        };
      },
      notificationReceivers({ newDoc }) {
        return getNotificationReceivers(newDoc);
      }
    },

    {
      field: 'linkedTo',
      logTemplate: {
        [ChangesKinds.ITEM_ADDED]: 'Document was linked to {{linkedDocDesc}}',
        [ChangesKinds.ITEM_REMOVED]: 'Document was unlinked from {{linkedDocDesc}}'
      },
      notificationTemplate: {
        [ChangesKinds.ITEM_ADDED]: '{{userName}} linked {{docDesc}} to {{linkedDocDesc}}',
        [ChangesKinds.ITEM_REMOVED]: '{{userName}} unlinked {{docDesc}} from {{linkedDocDesc}}'
      },
      logData({ diffs: { linkedTo } }) {
        const { item: { documentId, documentType } } = linkedTo;

        return {
          linkedDocDesc: getLinkedDocName(documentId, documentType)
        };
      },
      notificationData({ diffs: { linkedTo }, newDoc }) {
        const { item: { documentId, documentType } } = linkedTo;

        return {
          docDesc: this.docDescription(newDoc),
          linkedDocDesc: getLinkedDocName(documentId, documentType),
          userName: Utils.getUserFullNameOrEmail(linkedTo.executor)
        };
      },
      notificationReceivers({ newDoc }) {
        return getNotificationReceivers(newDoc);
      },
      additionalHandlers({ diffs: { linkedTo }, newDoc }) {
        const { kind, item: { documentId, documentType } } = linkedTo;

        const docAuditConfigs = {
          [ProblemTypes.NC]: NCAuditConfig,
          [ProblemTypes.RISK]: RiskAuditConfig
        };

        return [{
          config: docAuditConfigs[documentType],
          handler: actionLinkChanged,
          args: [{
            action: newDoc,
            documentId,
            kind
          }]
        }];
      }
    },

    {
      field: 'planInPlace',
      logTemplate: {
        [ChangesKinds.FIELD_ADDED]: 'Plan in place set to "{{newValue}}"',
        [ChangesKinds.FIELD_CHANGED]: 'Plan in place changed from "{{oldValue}}" to "{{newValue}}"',
        [ChangesKinds.FIELD_REMOVED]: 'Plan in place removed'
      },
      notificationTemplate: {
        [ChangesKinds.FIELD_ADDED]:
          '{{userName}} set plan in place of {{docDesc}} to "{{newValue}}"',
        [ChangesKinds.FIELD_CHANGED]:
          '{{userName}} changed plan in place of {{docDesc}} from "{{oldValue}}" to "{{newValue}}"',
        [ChangesKinds.FIELD_REMOVED]:
          '{{userName}} removed plan in place of {{docDesc}}'
      },
      logData({ diffs: { planInPlace }, newDoc }) {
        return {
          newValue: planInPlace.newValue,
          oldValue: planInPlace.oldValue
        };
      },
      notificationData({ diffs: { planInPlace }, newDoc }) {
        return {
          docDesc: this.docDescription(newDoc),
          userName: Utils.getUserFullNameOrEmail(planInPlace.executor),
          newValue: planInPlace.newValue,
          oldValue: planInPlace.oldValue
        };
      },
      notificationReceivers(diffs, newDoc, oldDoc) {
        return getNotificationReceivers(newDoc);
      }
    },

    {
      field: 'status',
      logTemplate: {
        [ChangesKinds.FIELD_ADDED]: 'Status set to "{{newValue}}"',
        [ChangesKinds.FIELD_CHANGED]: 'Status changed from "{{oldValue}}" to "{{newValue}}"',
        [ChangesKinds.FIELD_REMOVED]: 'Status removed'
      },
      notificationTemplate: {
        [ChangesKinds.FIELD_ADDED]:
          'Status of {{docDesc}} was set to "{{newValue}}"',
        [ChangesKinds.FIELD_CHANGED]:
          'Status of {{docDesc}} was changed from "{{oldValue}}" to "{{newValue}}"',
        [ChangesKinds.FIELD_REMOVED]:
          'Status of {{docDesc}} removed'
      },
      logData({ diffs: { status } }) {
        return {
          newValue: ActionStatuses[status.newValue],
          oldValue: ActionStatuses[status.oldValue]
        };
      },
      notificationData({ diffs: { status }, newDoc }) {
        return {
          docDesc: this.docDescription(newDoc),
          newValue: ActionStatuses[status.newValue],
          oldValue: ActionStatuses[status.oldValue]
        };
      },
      notificationReceivers({ newDoc }) {
        return getNotificationReceivers(newDoc);
      }
    },

    {
      field: 'toBeCompletedBy',
      logTemplate: {
        [ChangesKinds.FIELD_ADDED]:
          'Completion executor set to {{newValue}}',
        [ChangesKinds.FIELD_CHANGED]:
          'Completion executor changed from {{oldValue}} to {{newValue}}',
        [ChangesKinds.FIELD_REMOVED]:
          'Completion executor removed'
      },
      notificationTemplate: {
        [ChangesKinds.FIELD_ADDED]:
          '{{userName}} set executor of {{docDesc}} completion to {{newValue}}',
        [ChangesKinds.FIELD_CHANGED]:
          '{{userName}} changed executor of {{docDesc}} completion from {{oldValue}} to {{newValue}}',
        [ChangesKinds.FIELD_REMOVED]:
          '{{userName}} removed executor of {{docDesc}} completion'
      },
      logData({ diffs: { toBeCompletedBy } }) {
        return {
          newValue: Utils.getUserFullNameOrEmail(toBeCompletedBy.newValue),
          oldValue: Utils.getUserFullNameOrEmail(toBeCompletedBy.oldValue)
        };
      },
      notificationData({ diffs: { toBeCompletedBy }, newDoc }) {
        return {
          docDesc: this.docDescription(newDoc),
          userName: Utils.getUserFullNameOrEmail(toBeCompletedBy.executor),
          newValue: Utils.getUserFullNameOrEmail(toBeCompletedBy.newValue),
          oldValue: Utils.getUserFullNameOrEmail(toBeCompletedBy.oldValue)
        };
      },
      notificationReceivers({ newDoc }) {
        return getNotificationReceivers(newDoc);
      }
    },

    {
      field: 'toBeVerifiedBy',
      logTemplate: {
        [ChangesKinds.FIELD_ADDED]:
          'Verification executor set to {{newValue}}',
        [ChangesKinds.FIELD_CHANGED]:
          'Verification executor changed from {{oldValue}} to {{newValue}}',
        [ChangesKinds.FIELD_REMOVED]:
          'Verification executor removed'
      },
      notificationTemplate: {
        [ChangesKinds.FIELD_ADDED]:
          '{{userName}} set executor of {{docDesc}} verification to {{newValue}}',
        [ChangesKinds.FIELD_CHANGED]:
          '{{userName}} changed executor of {{docDesc}} verification from {{oldValue}} to {{newValue}}',
        [ChangesKinds.FIELD_REMOVED]:
          '{{userName}} removed executor of {{docDesc}} verification'
      },
      logData({ diffs: { toBeVerifiedBy } }) {
        return {
          newValue: Utils.getUserFullNameOrEmail(newValue),
          oldValue: Utils.getUserFullNameOrEmail(oldValue)
        };
      },
      notificationData({ diffs: { toBeVerifiedBy }, newDoc }) {
        return {
          docDesc: this.docDescription(newDoc),
          userName: Utils.getUserFullNameOrEmail(toBeVerifiedBy.executor),
          newValue: Utils.getUserFullNameOrEmail(toBeVerifiedBy.newValue),
          oldValue: Utils.getUserFullNameOrEmail(toBeVerifiedBy.oldValue)
        };
      },
      notificationReceivers({ newDoc }) {
        return getNotificationReceivers(newDoc);
      }
    },

    {
      field: 'verificationComments',
      logTemplate: {
        [ChangesKinds.FIELD_ADDED]: 'Verification comments set',
        [ChangesKinds.FIELD_CHANGED]: 'Verification comments changed',
        [ChangesKinds.FIELD_REMOVED]: 'Verification comments removed'
      },
      notificationTemplate: {
        [ChangesKinds.FIELD_ADDED]:
          '{{userName}} set verification comments of {{docDesc}}',
        [ChangesKinds.FIELD_CHANGED]:
          '{{userName}} changed verification comments of {{docDesc}}',
        [ChangesKinds.FIELD_REMOVED]:
          '{{userName}} removed verification comments of {{docDesc}}'
      },
      logData() { },
      notificationData({ diffs: { verificationComments }, newDoc }) {
        return {
          docDesc: this.docDescription(newDoc),
          userName: Utils.getUserFullNameOrEmail(verificationComments.executor),
        };
      },
      notificationReceivers({ newDoc }) {
        return getNotificationReceivers(newDoc);
      }
    },

    {
      field: 'verificationTargetDate',
      logTemplate: {
        [ChangesKinds.FIELD_ADDED]:
          'Verification target date set to "{{newValue}}"',
        [ChangesKinds.FIELD_CHANGED]:
          'Verification target date changed from "{{oldValue}}" to "{{newValue}}"',
        [ChangesKinds.FIELD_REMOVED]:
          'Verification target date removed'
      },
      notificationTemplate: {
        [ChangesKinds.FIELD_ADDED]:
          '{{userName}} set verification target date of {{docDesc}} to "{{newValue}}"',
        [ChangesKinds.FIELD_CHANGED]:
          '{{userName}} changed verification target date of {{docDesc}} from "{{oldValue}}" to "{{newValue}}"',
        [ChangesKinds.FIELD_REMOVED]:
          '{{userName}} removed verification target date of {{docDesc}}'
      },
      logData({ diffs: { verificationTargetDate } }) {
        return {
          newValue: Utils.getPrettyUTCDate(verificationTargetDate.newValue),
          oldValue: Utils.getPrettyUTCDate(verificationTargetDate.oldValue)
        };
      },
      notificationData({ diffs: { verificationTargetDate }, newDoc }) {
        return {
          docDesc: this.docDescription(newDoc),
          userName: Utils.getUserFullNameOrEmail(verificationTargetDate.executor),
          newValue: Utils.getPrettyUTCDate(verificationTargetDate.newValue),
          oldValue: Utils.getPrettyUTCDate(verificationTargetDate.oldValue)
        };
      },
      notificationReceivers({ newDoc }) {
        return getNotificationReceivers(newDoc);
      }
    },

    {
      field: 'verifiedAt',
      logTemplate: {
        [ChangesKinds.FIELD_ADDED]:
          'Verification date set to "{{newValue}}"',
        [ChangesKinds.FIELD_CHANGED]:
          'Verification date changed from "{{oldValue}}" to "{{newValue}}"',
        [ChangesKinds.FIELD_REMOVED]:
          'Verification date removed'
      },
      notificationTemplate: {
        [ChangesKinds.FIELD_ADDED]:
          '{{userName}} set verification date of {{docDesc}} to "{{newValue}}"',
        [ChangesKinds.FIELD_CHANGED]:
          '{{userName}} changed verification date of {{docDesc}} from "{{oldValue}}" to "{{newValue}}"',
        [ChangesKinds.FIELD_REMOVED]:
          '{{userName}} removed verification date of {{docDesc}}'
      },
      logData({ diffs: { verifiedAt } }) {
        return {
          newValue: Utils.getPrettyUTCDate(verifiedAt.newValue),
          oldValue: Utils.getPrettyUTCDate(verifiedAt.oldValue)
        };
      },
      notificationData({ diffs: { verifiedAt }, newDoc }) {
        return {
          docDesc: this.docDescription(newDoc),
          userName: Utils.getUserFullNameOrEmail(verifiedAt.executor),
          newValue: Utils.getPrettyUTCDate(verifiedAt.newValue),
          oldValue: Utils.getPrettyUTCDate(verifiedAt.oldValue)
        };
      },
      notificationReceivers({ newDoc }) {
        return getNotificationReceivers(newDoc);
      }
    },

    {
      field: 'verifiedBy',
      logTemplate: {
        [ChangesKinds.FIELD_ADDED]:
          'Verification executor set to {{newValue}}',
        [ChangesKinds.FIELD_CHANGED]:
          'Verification executor changed from {{oldValue}} to {{newValue}}',
        [ChangesKinds.FIELD_REMOVED]:
          'Verification executor removed'
      },
      notificationTemplate: {
        [ChangesKinds.FIELD_ADDED]:
          '{{userName}} set verification executor of {{docDesc}} to {{newValue}}',
        [ChangesKinds.FIELD_CHANGED]:
          '{{userName}} changed verification executor of {{docDesc}} from {{oldValue}} to {{newValue}}',
        [ChangesKinds.FIELD_REMOVED]:
          '{{userName}} removed verification executor of {{docDesc}}'
      },
      logData({ diffs: { verifiedBy } }) {
        return {
          newValue: Utils.getUserFullNameOrEmail(verifiedBy.newValue),
          oldValue: Utils.getUserFullNameOrEmail(verifiedBy.oldValue)
        };
      },
      notificationData({ diffs: { verifiedBy }, newDoc }) {
        return {
          docDesc: this.docDescription(newDoc),
          userName: Utils.getUserFullNameOrEmail(verifiedBy.executor),
          newValue: Utils.getUserFullNameOrEmail(verifiedBy.newValue),
          oldValue: Utils.getUserFullNameOrEmail(verifiedBy.oldValue)
        };
      },
      notificationReceivers({ newDoc }) {
        return getNotificationReceivers(newDoc);
      }
    },

    _(isDeletedField).extend({
      notificationReceivers({ newDoc }) {
        return getNotificationReceivers(newDoc);
      }
    }),

    _(filesField).extend({
      notificationReceivers({ newDoc }) {
        return getNotificationReceivers(newDoc);
      }
    }),

    _(fileUrlField).extend({
      notificationReceivers({ newDoc }) {
        return getNotificationReceivers(newDoc);
      }
    }),

    _(notesField).extend({
      notificationReceivers({ newDoc }) {
        return getNotificationReceivers(newDoc);
      }
    }),

    _(notifyField).extend({
      notificationReceivers({ newDoc }) {
        return getNotificationReceivers(newDoc);
      }
    }),

    _(ownerIdField).extend({
      notificationReceivers({ newDoc }) {
        return getNotificationReceivers(newDoc);
      }
    }),

    _(titleField).extend({
      notificationReceivers({ newDoc }) {
        return getNotificationReceivers(newDoc);
      }
    })
  ],

  onRemoved: {
    logTemplate: 'Document removed',
    notificationTemplate: '',
    logData() { },
    notificationData() { },
    notificationReceivers() { },
    additionalHandlers() { }
  },

  docId({ _id }) {
    return _id;
  },

  docDescription(docOrId) {
    let action = docOrId;
    if (_(docOrId).isString()) {
      action = Actions.findOne({ _id: docOrId });
    }

    return `${action.seqentialId} "${action.title}"`;
  }

};
