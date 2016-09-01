import { Meteor } from 'meteor/meteor';

import { Actions } from '/imports/api/actions/actions.js';
import { NonConformities } from '/imports/api/non-conformities/non-conformities.js';
import { Risks } from '/imports/api/risks/risks.js';
import { ActionStatuses, CollectionNames, ProblemTypes } from '/imports/api/constants.js';
import { ChangesKinds } from './audit-utils.js';
import {
  isDeletedField,
  filesField,
  fileUrlField,
  notesField,
  notifyField,
  ownerIdField,
  titleField
} from './reusable-update-handlers.js';
import NCAuditConfig from './nc-audit-config.js';
import RiskAuditConfig from './risk-audit-config.js';
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

  const getIds = (collection, problemType) => {
    const query = {
      _id: { $in: getLinkedDocsIds(linkedTo, problemType) }
    };

    collection.find(query).forEach((doc) => {
      _(doc.standardsIds).each(id => standardsIds.add(id));
      usersIds.add(doc.identifiedBy);
    });
  };

  _.each(
    [
      { type: ProblemTypes.NC, collection: NonConformities },
      { type: ProblemTypes.RISK, collection: Risks }
    ],
    ({ type, collection }) => getIds(collection, type)
  );

  Standards.find({
    _id: { $in: Array.from(standardsIds) }
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

const { FIELD_ADDED, FIELD_CHANGED, FIELD_REMOVED, ITEM_ADDED, ITEM_REMOVED } = ChangesKinds;


export default ActionAuditConfig = {

  collection: Actions,

  collectionName: CollectionNames.ACTIONS,

  onCreated: {
    logs: [
      {
        template: 'Document created',
        templateData() { }
      }
    ],
    notifications: []
  },

  updateHandlers: [
    {
      field: 'completedAt',
      logs: [
        {
          shouldCreateLog({ diffs: { isCompleted } }) {
            return !isCompleted;
          },
          template: {
            [FIELD_ADDED]:
              'Completion date set to "{{newValue}}"',
            [FIELD_CHANGED]:
              'Completion date changed from "{{oldValue}}" to "{{newValue}}"',
            [FIELD_REMOVED]:
              'Completion date removed'
          },
          templateData({ diffs: { completedAt } }) {
            return {
              newValue: Utils.getPrettyUTCDate(completedAt.newValue),
              oldValue: Utils.getPrettyUTCDate(completedAt.oldValue)
            };
          }
        }
      ],
      notifications: [
        {
          template: {
            [FIELD_ADDED]:
              '{{userName}} set completion date of {{{docDesc}}} to "{{newValue}}"',
            [FIELD_CHANGED]:
              '{{userName}} changed completion date of {{{docDesc}}} from "{{oldValue}}" to "{{newValue}}"',
            [FIELD_REMOVED]:
              '{{userName}} removed completion date of {{{docDesc}}}'
          },
          templateData({ diffs: { completedAt }, newDoc }) {
            return {
              docDesc: this.docDescription(newDoc),
              userName: Utils.getUserFullNameOrEmail(newDoc.updatedBy),
              newValue: Utils.getPrettyUTCDate(completedAt.newValue),
              oldValue: Utils.getPrettyUTCDate(completedAt.oldValue)
            };
          },
          receivers({ newDoc }) {
            return getNotificationReceivers(newDoc);
          }
        }
      ]
    },

    {
      field: 'completedBy',
      logs: [
        {
          shouldCreateLog({ diffs: { isCompleted } }) {
            return !isCompleted;
          },
          template: {
            [FIELD_ADDED]:
              'Completion executor set to {{newValue}}',
            [FIELD_CHANGED]:
              'Completion executor changed from {{oldValue}} to {{newValue}}',
            [FIELD_REMOVED]:
              'Completion executor removed'
          },
          templateData({ diffs: { completedBy } }) {
            return {
              newValue: Utils.getUserFullNameOrEmail(completedBy.newValue),
              oldValue: Utils.getUserFullNameOrEmail(completedBy.oldValue)
            };
          }
        }
      ],
      notifications: [
        {
          shouldSendNotification({ diffs: { isCompleted } }) {
            return !isCompleted;
          },
          template: {
            [FIELD_ADDED]:
              '{{userName}} set completion executor of {{{docDesc}}} to {{newValue}}',
            [FIELD_CHANGED]:
              '{{userName}} changed completion executor of {{{docDesc}}} from {{oldValue}} to {{newValue}}',
            [FIELD_REMOVED]:
              '{{userName}} removed completion executor of {{{docDesc}}}'
          },
          templateData({ diffs: { completedBy }, newDoc }) {
            return {
              docDesc: this.docDescription(newDoc),
              userName: Utils.getUserFullNameOrEmail(newDoc.updatedBy),
              newValue: Utils.getUserFullNameOrEmail(completedBy.newValue),
              oldValue: Utils.getUserFullNameOrEmail(completedBy.oldValue)
            };
          },
          receivers({ newDoc }) {
            return getNotificationReceivers(newDoc);
          }
        }
      ]
    },

    {
      field: 'completionComments',
      logs: [
        {
          shouldCreateLog({ diffs: { isCompleted } }) {
            return !isCompleted;
          },
          template: {
            [FIELD_ADDED]: 'Completion comments set',
            [FIELD_CHANGED]: 'Completion comments changed',
            [FIELD_REMOVED]: 'Completion comments removed'
          },
          templateData() { }
        }
      ],
      notifications: [
        {
          shouldSendNotification({ diffs: { isCompleted } }) {
            return !isCompleted;
          },
          template: {
            [FIELD_ADDED]:
              '{{userName}} set completion comments of {{{docDesc}}}',
            [FIELD_CHANGED]:
              '{{userName}} changed completion comments of {{{docDesc}}}',
            [FIELD_REMOVED]:
              '{{userName}} removed completion comments of {{{docDesc}}}'
          },
          templateData({ diffs: { completionComments }, newDoc }) {
            return {
              docDesc: this.docDescription(newDoc),
              userName: Utils.getUserFullNameOrEmail(newDoc.updatedBy),
              newValue: completionComments.newValue,
              oldValue: completionComments.oldValue
            };
          },
          receivers({ newDoc }) {
            return getNotificationReceivers(newDoc);
          }
        }
      ]
    },

    {
      field: 'completionTargetDate',
      logs: [
        {
          template: {
            [FIELD_ADDED]:
              'Completion target date set to "{{newValue}}"',
            [FIELD_CHANGED]:
              'Completion target date changed from "{{oldValue}}" to "{{newValue}}"',
            [FIELD_REMOVED]:
              'Completion target date removed'
          },
          templateData({ diffs: { completionTargetDate } }) {
            return {
              newValue: Utils.getPrettyUTCDate(completionTargetDate.newValue),
              oldValue: Utils.getPrettyUTCDate(completionTargetDate.oldValue)
            };
          }
        }
      ],
      notifications: [
        {
          template: {
            [FIELD_ADDED]:
              '{{userName}} set completion target date of {{{docDesc}}} to "{{newValue}}"',
            [FIELD_CHANGED]:
              '{{userName}} changed completion target date of {{{docDesc}}} from "{{oldValue}}" to "{{newValue}}"',
            [FIELD_REMOVED]:
              '{{userName}} removed completion target date of {{{docDesc}}}'
          },
          templateData({ diffs: { completionTargetDate }, newDoc }) {
            return {
              docDesc: this.docDescription(newDoc),
              userName: Utils.getUserFullNameOrEmail(newDoc.updatedBy),
              newValue: Utils.getPrettyUTCDate(completionTargetDate.newValue),
              oldValue: Utils.getPrettyUTCDate(completionTargetDate.oldValue)
            };
          },
          receivers({ newDoc }) {
            return getNotificationReceivers(newDoc);
          }
        }
      ]
    },

    {
      field: 'isCompleted',
      logs: [
        {
          shouldCreateLog({ diffs: { completedAt, completedBy } }) {
            return completedAt && completedBy;
          },
          template: {
            [FIELD_CHANGED]:
              '{{#if completed}}' +
                'Action completed{{#if comments}}: {{comments}}{{/if}}' +
              '{{else}}' +
                'Action completion canceled' +
              '{{/if}}'
          },
          templateData({ diffs: { isCompleted, completionComments } }) {
            return {
              completed: isCompleted.newValue,
              comments: completionComments && completionComments.newValue
            };
          }
        }
      ],
      notifications: [
        {
          shouldSendNotification({ diffs: { completedAt, completedBy } }) {
            return completedAt && completedBy;
          },
          template: {
            [FIELD_CHANGED]:
              '{{#if completed}}' +
                '{{userName}} completed {{{docDesc}}}' +
                '{{#if comments}} with following comments: {{comments}}{{/if}}' +
              '{{else}}' +
                '{{userName}} canceled completion of {{{docDesc}}}' +
              '{{/if}}'
          },
          templateData({ diffs: { isCompleted, completionComments }, newDoc }) {
            return {
              docDesc: this.docDescription(newDoc),
              completed: isCompleted.newValue,
              comments: completionComments && completionComments.newValue,
              userName: Utils.getUserFullNameOrEmail(newDoc.updatedBy)
            };
          },
          receivers({ newDoc }) {
            return getNotificationReceivers(newDoc);
          }
        }
      ]
    },

    {
      field: 'isVerified',
      logs: [
        {
          shouldCreateLog({ diffs: { verifiedAt, verifiedBy } }) {
            return verifiedAt && verifiedBy;
          },
          logTemplate: {
            [FIELD_CHANGED]:
              '{{#if verified}}' +
                '{{#if verifiedAsEffective}}' +
                  'Action verified as effective{{#if comments}}: {{comments}}{{/if}}' +
                '{{else}}' +
                  'Action failed verification{{#if comments}}: {{comments}}{{/if}}' +
                '{{/if}}' +
              '{{else}}' +
                'Action verification canceled' +
              '{{/if}}'
          },
          logData({ diffs: { isVerified, isVerifiedAsEffective, verificationComments } }) {
            return {
              verified: isVerified.newValue,
              verifiedAsEffective: isVerifiedAsEffective && isVerifiedAsEffective.newValue,
              comments: verificationComments && verificationComments.newValue
            };
          }
        }
      ],
      notifications: [
        {
          shouldSendNotification({ diffs: { verifiedAt, verifiedBy } }) {
            return verifiedAt && verifiedBy;
          },
          template: {
            [FIELD_CHANGED]:
              '{{#if verified}}' +
                '{{#if verifiedAsEffective}}' +
                  '{{userName}} verified {{{docDesc}}} as effective' +
                  '{{#if comments}} with following comments: {{comments}}{{/if}}' +
                '{{else}}' +
                  '{{userName}} failed verification of {{{docDesc}}}' +
                  '{{#if comments}} with following comments: {{comments}}{{/if}}' +
                '{{/if}}' +
              '{{else}}' +
                '{{userName}} canceled verification of {{{docDesc}}}' +
              '{{/if}}'
          },
          templateData({ diffs: { isVerified, isVerifiedAsEffective, verificationComments }, newDoc }) {
            return {
              docDesc: this.docDescription(newDoc),
              verified: isVerified.newValue,
              verifiedAsEffective: isVerifiedAsEffective && isVerifiedAsEffective.newValue,
              comments: verificationComments && verificationComments.newValue,
              userName: Utils.getUserFullNameOrEmail(newDoc.updatedBy)
            };
          },
          receivers({ newDoc }) {
            return getNotificationReceivers(newDoc);
          }
        }
      ]
    },

    {
      field: 'linkedTo',
      logs: [
        {
          template: {
            [ITEM_ADDED]: 'Document was linked to {{{linkedDocDesc}}}',
            [ITEM_REMOVED]: 'Document was unlinked from {{{linkedDocDesc}}}'
          },
          templateData({ diffs: { linkedTo } }) {
            const { item: { documentId, documentType } } = linkedTo;

            return {
              linkedDocDesc: getLinkedDocName(documentId, documentType)
            };
          }
        },
        {
          template: {
            [ITEM_ADDED]: '{{{docDesc}}} was linked to this document',
            [ITEM_REMOVED]: '{{{docDesc}}} was unlinked from this document'
          },
          templateData({ newDoc }) {
            return { docDesc: this.docDescription(newDoc) };
          },
          logData({ diffs: { linkedTo } }) {
            const { item: { documentId, documentType } } = linkedTo;

            const auditConfig = {
              [ProblemTypes.NC]: NCAuditConfig,
              [ProblemTypes.RISK]: RiskAuditConfig
            }[documentType];

            return {
              collection: auditConfig.collectionName,
              documentId
            };
          }
        }
      ],
      notifications: [
        {
          template: {
            [ITEM_ADDED]: '{{userName}} linked {{{docDesc}}} to {{{linkedDocDesc}}}',
            [ITEM_REMOVED]: '{{userName}} unlinked {{{docDesc}}} from {{{linkedDocDesc}}}'
          },
          templateData({ diffs: { linkedTo }, newDoc }) {
            const { item: { documentId, documentType } } = linkedTo;

            return {
              docDesc: this.docDescription(newDoc),
              linkedDocDesc: getLinkedDocName(documentId, documentType),
              userName: Utils.getUserFullNameOrEmail(newDoc.updatedBy)
            };
          },
          receivers({ newDoc }) {
            return getNotificationReceivers(newDoc);
          }
        }
      ]
    },

    {
      field: 'planInPlace',
      logs: [
        {
          template: {
            [FIELD_ADDED]: 'Plan in place set to "{{newValue}}"',
            [FIELD_CHANGED]: 'Plan in place changed from "{{oldValue}}" to "{{newValue}}"',
            [FIELD_REMOVED]: 'Plan in place removed'
          },
          templateData({ diffs: { planInPlace }, newDoc }) {
            return {
              newValue: planInPlace.newValue,
              oldValue: planInPlace.oldValue
            };
          }
        }
      ],
      notifications: [
        {
          template: {
            [FIELD_ADDED]:
              '{{userName}} set plan in place of {{{docDesc}}} to "{{newValue}}"',
            [FIELD_CHANGED]:
              '{{userName}} changed plan in place of {{{docDesc}}} from "{{oldValue}}" to "{{newValue}}"',
            [FIELD_REMOVED]:
              '{{userName}} removed plan in place of {{{docDesc}}}'
          },
          templateData({ diffs: { planInPlace }, newDoc }) {
            return {
              docDesc: this.docDescription(newDoc),
              userName: Utils.getUserFullNameOrEmail(newDoc.updatedBy),
              newValue: planInPlace.newValue,
              oldValue: planInPlace.oldValue
            };
          },
          receivers({ newDoc }) {
            return getNotificationReceivers(newDoc);
          }
        }
      ]
    },

    {
      field: 'status',
      logs: [
        {
          template: {
            [FIELD_ADDED]: 'Status set to "{{newValue}}"',
            [FIELD_CHANGED]: 'Status changed from "{{oldValue}}" to "{{newValue}}"',
            [FIELD_REMOVED]: 'Status removed'
          },
          templateData({ diffs: { status } }) {
            return {
              newValue: ActionStatuses[status.newValue],
              oldValue: ActionStatuses[status.oldValue]
            };
          }
        }
      ],
      notifications: [
        {
          template: {
            [FIELD_ADDED]:
              'Status of {{{docDesc}}} was set to "{{newValue}}"',
            [FIELD_CHANGED]:
              'Status of {{{docDesc}}} was changed from "{{oldValue}}" to "{{newValue}}"',
            [FIELD_REMOVED]:
              'Status of {{{docDesc}}} removed'
          },
          templateData({ diffs: { status }, newDoc }) {
            return {
              docDesc: this.docDescription(newDoc),
              newValue: ActionStatuses[status.newValue],
              oldValue: ActionStatuses[status.oldValue]
            };
          },
          receivers({ newDoc }) {
            return getNotificationReceivers(newDoc);
          }
        }
      ]
    },

    {
      field: 'toBeCompletedBy',
      logs: [
        {
          template: {
            [FIELD_ADDED]:
              'Completion executor set to {{newValue}}',
            [FIELD_CHANGED]:
              'Completion executor changed from {{oldValue}} to {{newValue}}',
            [FIELD_REMOVED]:
              'Completion executor removed'
          },
          templateData({ diffs: { toBeCompletedBy } }) {
            return {
              newValue: Utils.getUserFullNameOrEmail(toBeCompletedBy.newValue),
              oldValue: Utils.getUserFullNameOrEmail(toBeCompletedBy.oldValue)
            };
          }
        }
      ],
      notifications: [
        {
          template: {
            [FIELD_ADDED]:
              '{{userName}} set completion executor of {{{docDesc}}} to {{newValue}}',
            [FIELD_CHANGED]:
              '{{userName}} changed completion executor of {{{docDesc}}} from {{oldValue}} to {{newValue}}',
            [FIELD_REMOVED]:
              '{{userName}} removed completion executor of {{{docDesc}}}'
          },
          templateData({ diffs: { toBeCompletedBy }, newDoc }) {
            return {
              docDesc: this.docDescription(newDoc),
              userName: Utils.getUserFullNameOrEmail(newDoc.updatedBy),
              newValue: Utils.getUserFullNameOrEmail(toBeCompletedBy.newValue),
              oldValue: Utils.getUserFullNameOrEmail(toBeCompletedBy.oldValue)
            };
          },
          receivers({ newDoc }) {
            return getNotificationReceivers(newDoc);
          }
        },
        {
          shouldSendNotification({ diffs: { toBeCompletedBy: { kind } } }) {
            return _([FIELD_ADDED, FIELD_CHANGED]).contains(kind);
          },
          template: '{{userName}} assigned you as a completion executor for {{{docDesc}}}',
          templateData({ newDoc }) {
            return {
              docDesc: this.docDescription(newDoc),
              userName: Utils.getUserFullNameOrEmail(newDoc.updatedBy)
            };
          },
          subjectTemplate: 'You have been assigned as a completion executor',
          subjectTemplateData() { },
          emailTemplateData({ newDoc }) {
            return {
              button: {
                label: 'View action',
                url: this.docUrl(newDoc)
              }
            };
          },
          receivers({ diffs: { toBeCompletedBy: { newValue } } }) {
            return [newValue];
          }
        }
      ]
    },

    {
      field: 'toBeVerifiedBy',
      logs: [
        {
          template: {
            [FIELD_ADDED]:
              'Verification executor set to {{newValue}}',
            [FIELD_CHANGED]:
              'Verification executor changed from {{oldValue}} to {{newValue}}',
            [FIELD_REMOVED]:
              'Verification executor removed'
          },
          templateData({ diffs: { toBeVerifiedBy } }) {
            return {
              newValue: Utils.getUserFullNameOrEmail(toBeVerifiedBy.newValue),
              oldValue: Utils.getUserFullNameOrEmail(toBeVerifiedBy.oldValue)
            };
          }
        }
      ],
      notifications: [
        {
          template: {
            [FIELD_ADDED]:
              '{{userName}} set verification executor of {{{docDesc}}} to {{newValue}}',
            [FIELD_CHANGED]:
              '{{userName}} changed verification executor of {{{docDesc}}} from {{oldValue}} to {{newValue}}',
            [FIELD_REMOVED]:
              '{{userName}} removed verification executor of {{{docDesc}}}'
          },
          templateData({ diffs: { toBeVerifiedBy }, newDoc }) {
            return {
              docDesc: this.docDescription(newDoc),
              userName: Utils.getUserFullNameOrEmail(newDoc.updatedBy),
              newValue: Utils.getUserFullNameOrEmail(toBeVerifiedBy.newValue),
              oldValue: Utils.getUserFullNameOrEmail(toBeVerifiedBy.oldValue)
            };
          },
          receivers({ newDoc }) {
            return getNotificationReceivers(newDoc);
          }
        },
        {
          shouldSendNotification({ diffs: { toBeVerifiedBy: { kind } } }) {
            return _([FIELD_ADDED, FIELD_CHANGED]).contains(kind);
          },
          template: '{{userName}} assigned you as a verification executor for {{{docDesc}}}',
          templateData({ newDoc }) {
            return {
              docDesc: this.docDescription(newDoc),
              userName: Utils.getUserFullNameOrEmail(newDoc.updatedBy)
            };
          },
          subjectTemplate: 'You have been assigned as a verification executor',
          subjectTemplateData() { },
          emailTemplateData({ newDoc }) {
            return {
              button: {
                label: 'View action',
                url: this.docUrl(newDoc)
              }
            };
          },
          receivers({ diffs: { toBeVerifiedBy: { newValue } } }) {
            return [newValue];
          }
        }
      ]
    },

    {
      field: 'verificationComments',
      logs: [
        {
          shouldCreateLog({ diffs: { isVerified } }) {
            return !isVerified;
          },
          template: {
            [FIELD_ADDED]: 'Verification comments set',
            [FIELD_CHANGED]: 'Verification comments changed',
            [FIELD_REMOVED]: 'Verification comments removed'
          },
          templateData() { },
        }
      ],
      notifications: [
        {
          shouldSendNotification({ diffs: { isVerified } }) {
            return !isVerified;
          },
          template: {
            [FIELD_ADDED]:
              '{{userName}} set verification comments of {{{docDesc}}}',
            [FIELD_CHANGED]:
              '{{userName}} changed verification comments of {{{docDesc}}}',
            [FIELD_REMOVED]:
              '{{userName}} removed verification comments of {{{docDesc}}}'
          },
          templateData({ diffs: { verificationComments }, newDoc }) {
            return {
              docDesc: this.docDescription(newDoc),
              userName: Utils.getUserFullNameOrEmail(newDoc.updatedBy),
            };
          },
          receivers({ newDoc }) {
            return getNotificationReceivers(newDoc);
          }
        }
      ]
    },

    {
      field: 'verificationTargetDate',
      logs: [
        {
          template: {
            [FIELD_ADDED]:
              'Verification target date set to "{{newValue}}"',
            [FIELD_CHANGED]:
              'Verification target date changed from "{{oldValue}}" to "{{newValue}}"',
            [FIELD_REMOVED]:
              'Verification target date removed'
          },
          templateData({ diffs: { verificationTargetDate } }) {
            return {
              newValue: Utils.getPrettyUTCDate(verificationTargetDate.newValue),
              oldValue: Utils.getPrettyUTCDate(verificationTargetDate.oldValue)
            };
          }
        }
      ],
      notifications: [
        {
          template: {
            [FIELD_ADDED]:
              '{{userName}} set verification target date of {{{docDesc}}} to "{{newValue}}"',
            [FIELD_CHANGED]:
              '{{userName}} changed verification target date of {{{docDesc}}} from "{{oldValue}}" to "{{newValue}}"',
            [FIELD_REMOVED]:
              '{{userName}} removed verification target date of {{{docDesc}}}'
          },
          templateData({ diffs: { verificationTargetDate }, newDoc }) {
            return {
              docDesc: this.docDescription(newDoc),
              userName: Utils.getUserFullNameOrEmail(newDoc.updatedBy),
              newValue: Utils.getPrettyUTCDate(verificationTargetDate.newValue),
              oldValue: Utils.getPrettyUTCDate(verificationTargetDate.oldValue)
            };
          },
          receivers({ newDoc }) {
            return getNotificationReceivers(newDoc);
          }
        }
      ]
    },

    {
      field: 'verifiedAt',
      logs: [
        {
          shouldCreateLog({ diffs: { isVerified } }) {
            return !isVerified;
          },
          template: {
            [FIELD_ADDED]:
              'Verification date set to "{{newValue}}"',
            [FIELD_CHANGED]:
              'Verification date changed from "{{oldValue}}" to "{{newValue}}"',
            [FIELD_REMOVED]:
              'Verification date removed'
          },
          templateData({ diffs: { verifiedAt } }) {
            return {
              newValue: Utils.getPrettyUTCDate(verifiedAt.newValue),
              oldValue: Utils.getPrettyUTCDate(verifiedAt.oldValue)
            };
          }
        }
      ],
      notifications: [
        {
          shouldSendNotification({ diffs: { isVerified } }) {
            return !isVerified;
          },
          template: {
            [FIELD_ADDED]:
              '{{userName}} set verification date of {{{docDesc}}} to "{{newValue}}"',
            [FIELD_CHANGED]:
              '{{userName}} changed verification date of {{{docDesc}}} from "{{oldValue}}" to "{{newValue}}"',
            [FIELD_REMOVED]:
              '{{userName}} removed verification date of {{{docDesc}}}'
          },
          templateData({ diffs: { verifiedAt }, newDoc }) {
            return {
              docDesc: this.docDescription(newDoc),
              userName: Utils.getUserFullNameOrEmail(newDoc.updatedBy),
              newValue: Utils.getPrettyUTCDate(verifiedAt.newValue),
              oldValue: Utils.getPrettyUTCDate(verifiedAt.oldValue)
            };
          },
          receivers({ newDoc }) {
            return getNotificationReceivers(newDoc);
          }
        }
      ]
    },

    {
      field: 'verifiedBy',
      logs: [
        {
          shouldCreateLog({ diffs: { isVerified } }) {
            return !isVerified;
          },
          template: {
            [FIELD_ADDED]:
              'Verification executor set to {{newValue}}',
            [FIELD_CHANGED]:
              'Verification executor changed from {{oldValue}} to {{newValue}}',
            [FIELD_REMOVED]:
              'Verification executor removed'
          },
          templateData({ diffs: { verifiedBy } }) {
            return {
              newValue: Utils.getUserFullNameOrEmail(verifiedBy.newValue),
              oldValue: Utils.getUserFullNameOrEmail(verifiedBy.oldValue)
            };
          }
        }
      ],
      notifications: [
        {
          shouldSendNotification({ diffs: { isVerified } }) {
            return !isVerified;
          },
          template: {
            [FIELD_ADDED]:
              '{{userName}} set verification executor of {{{docDesc}}} to {{newValue}}',
            [FIELD_CHANGED]:
              '{{userName}} changed verification executor of {{{docDesc}}} from {{oldValue}} to {{newValue}}',
            [FIELD_REMOVED]:
              '{{userName}} removed verification executor of {{{docDesc}}}'
          },
          templateData({ diffs: { verifiedBy }, newDoc }) {
            return {
              docDesc: this.docDescription(newDoc),
              userName: Utils.getUserFullNameOrEmail(newDoc.updatedBy),
              newValue: Utils.getUserFullNameOrEmail(verifiedBy.newValue),
              oldValue: Utils.getUserFullNameOrEmail(verifiedBy.oldValue)
            };
          },
          receivers({ newDoc }) {
            return getNotificationReceivers(newDoc);
          }
        }
      ]
    },

    {
      field: 'isDeleted',
      logs: [
        isDeletedField.logConfig
      ],
      notifications: [
        _({}).extend(isDeletedField.notificationConfig, {
          receivers({ newDoc }) {
            return getNotificationReceivers(newDoc);
          }
        })
      ]
    },

    {
      field: 'files',
      logs: [
        filesField.logConfig
      ],
      notifications: [
        _({}).extend(filesField.notificationConfig, {
          receivers({ newDoc }) {
            return getNotificationReceivers(newDoc);
          }
        })
      ]
    },

    {
      field: 'files.$.url',
      logs: [
        fileUrlField.logConfig
      ],
      notifications: [
        _({}).extend(fileUrlField.notificationConfig, {
          receivers({ newDoc }) {
            return getNotificationReceivers(newDoc);
          }
        })
      ]
    },

    {
      field: 'notes',
      logs: [
        notesField.logConfig
      ],
      notifications: [
        _({}).extend(notesField.notificationConfig, {
          receivers({ newDoc }) {
            return getNotificationReceivers(newDoc);
          }
        })
      ]
    },

    {
      field: 'notify',
      logs: [
        notifyField.logConfig
      ],
      notifications: [
        _({}).extend(notifyField.notificationConfig, {
          receivers({ newDoc }) {
            return getNotificationReceivers(newDoc);
          }
        })
      ]
    },

    {
      field: 'ownerId',
      logs: [
        ownerIdField.logConfig
      ],
      notifications: [
        _({}).extend(ownerIdField.notificationConfig, {
          receivers({ newDoc }) {
            return getNotificationReceivers(newDoc);
          }
        })
      ]
    },

    {
      field: 'title',
      logs: [
        titleField.logConfig
      ],
      notifications: [
        _({}).extend(titleField.notificationConfig, {
          receivers({ newDoc }) {
            return getNotificationReceivers(newDoc);
          }
        })
      ]
    }
  ],

  onCreated: {
    logs: [
      {
        template: 'Document created',
        templateData() { }
      }
    ],
    notifications: []
  },

  docId({ _id }) {
    return _id;
  },

  docDescription(docOrId) {
    let action = docOrId;
    if (_(docOrId).isString()) {
      action = Actions.findOne({ _id: docOrId });
    }

    return `${action.sequentialId} "${action.title}"`;
  },

  docOrganizationId({ organizationId }) {
    return organizationId;
  },

  docUrl({ _id, organizationId }) {
    const { serialNumber } = Organizations.findOne({ _id: organizationId });
    const { _id:workItemId } = WorkItems.findOne({ 'linkedDoc._id': _id });

    return Meteor.absoluteUrl(`${serialNumber}/work-inbox/${workItemId}`);
  }

};
