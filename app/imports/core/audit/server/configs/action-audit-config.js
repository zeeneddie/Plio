import { Meteor } from 'meteor/meteor';

import { Actions } from '/imports/api/actions/actions.js';
import { NonConformities } from '/imports/api/non-conformities/non-conformities.js';
import { Risks } from '/imports/api/risks/risks.js';
import {
  ActionStatuses,
  CollectionNames,
  ProblemTypes,
  SystemName
} from '/imports/api/constants.js';
import {
  getCollectionByDocType,
  getUserFullNameOrEmail,
  getPrettyOrgDate
} from '/imports/api/helpers.js';
import { ChangesKinds } from '../utils/changes-kinds.js';
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


const getNotificationReceivers = ({ linkedTo, ownerId }, user) => {
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
      { collection: NonConformities, type: ProblemTypes.NC },
      { collection: Risks, type: ProblemTypes.RISK }
    ],
    ({ collection, type }) => getIds(collection, type)
  );

  Standards.find({
    _id: { $in: Array.from(standardsIds) }
  }).forEach(({ owner }) => usersIds.add(owner));

  const receivers = Array.from(usersIds);

  const userId = (user === SystemName) ? user : user._id;
  const index = receivers.indexOf(userId);
  (index > -1) && receivers.splice(index, 1);

  return receivers;
};

const receiversFn = function({ newDoc, user }) {
  return getNotificationReceivers(newDoc, user);
};

const getLinkedDocAuditConfig = (documentType) => {
  return {
    [ProblemTypes.NC]: NCAuditConfig,
    [ProblemTypes.RISK]: RiskAuditConfig
  }[documentType];
};

const getLinkedDocName = (documentId, documentType) => {
  const collection = getCollectionByDocType(documentType);
  const doc = collection.findOne({ _id: documentId });
  const docAuditConfig = getLinkedDocAuditConfig(documentType);

  return docAuditConfig.docDescription(doc);
};

const {
  FIELD_ADDED, FIELD_CHANGED, FIELD_REMOVED,
  ITEM_ADDED, ITEM_REMOVED
} = ChangesKinds;


export default ActionAuditConfig = {

  collection: Actions,

  collectionName: CollectionNames.ACTIONS,

  onCreated: {
    logs: [
      {
        template: 'Document created',
        templateData() { }
      },
      {
        template: '{{{docDesc}}} was linked to this document',
        templateData({ newDoc }) {
          return _(newDoc.linkedTo.length).times(() => {
            return { docDesc: this.docDescription(newDoc) };
          });
        },
        logData({ newDoc: { linkedTo } }) {
          return _(linkedTo).map(({ documentId, documentType }) => {
            const auditConfig = getLinkedDocAuditConfig(documentType);

            return {
              collection: auditConfig.collectionName,
              documentId
            };
          });
        }
      }
    ],
    notifications: [
      {
        template: '{{userName}} created action {{{docDesc}}} for {{{linkedDocDesc}}}',
        templateData({ newDoc }) {
          const docDesc = this.docDescription(newDoc);
          const userName = getUserFullNameOrEmail(newDoc.createdBy);

          return _(newDoc.linkedTo).map(({ documentId, documentType }) => {
            const auditConfig = getLinkedDocAuditConfig(documentType);

            return {
              linkedDocDesc: getLinkedDocName(documentId, documentType),
              docDesc,
              userName
            };
          });
        },
        receivers({ newDoc, user }) {
          return _(newDoc.linkedTo).map(({ documentId, documentType }) => {
            const collection = getCollectionByDocType(documentType);
            const { identifiedBy } = collection.findOne({ _id: documentId });
            const userId = (user === SystemName) ? user : user._id;

            return (identifiedBy !== userId) ? [identifiedBy]: [];
          });
        }
      },
      {
        template: '{{userName}} assigned you to complete {{{docDesc}}}',
        templateData({ newDoc, user }) {
          return {
            docDesc: this.docDescription(newDoc),
            userName: getUserFullNameOrEmail(user)
          };
        },
        subjectTemplate: 'You have been assigned to complete an action',
        subjectTemplateData() { },
        notificationData({ newDoc }) {
          return {
            templateData: {
              button: {
                label: 'View action',
                url: this.docUrl(newDoc)
              }
            }
          };
        },
        receivers({ newDoc, user }) {
          const { toBeCompletedBy } = newDoc;
          const userId = (user === SystemName) ? user : user._id;
          return (toBeCompletedBy !== userId) ? [toBeCompletedBy]: [];
        }
      }
    ]
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
          templateData({ diffs: { completedAt }, newDoc }) {
            const orgId = this.docOrgId(newDoc);

            return {
              newValue: getPrettyOrgDate(completedAt.newValue, orgId),
              oldValue: getPrettyOrgDate(completedAt.oldValue, orgId)
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
              '{{userName}} set completion date of {{{docDesc}}} to "{{newValue}}"',
            [FIELD_CHANGED]:
              '{{userName}} changed completion date of {{{docDesc}}} from "{{oldValue}}" to "{{newValue}}"',
            [FIELD_REMOVED]:
              '{{userName}} removed completion date of {{{docDesc}}}'
          },
          templateData({ diffs: { completedAt }, newDoc, user }) {
            const orgId = this.docOrgId(newDoc);

            return {
              docDesc: this.docDescription(newDoc),
              userName: getUserFullNameOrEmail(user),
              newValue: getPrettyOrgDate(completedAt.newValue, orgId),
              oldValue: getPrettyOrgDate(completedAt.oldValue, orgId)
            };
          },
          receivers: receiversFn
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
              newValue: getUserFullNameOrEmail(completedBy.newValue),
              oldValue: getUserFullNameOrEmail(completedBy.oldValue)
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
          templateData({ diffs: { completedBy }, newDoc, user }) {
            return {
              docDesc: this.docDescription(newDoc),
              userName: getUserFullNameOrEmail(user),
              newValue: getUserFullNameOrEmail(completedBy.newValue),
              oldValue: getUserFullNameOrEmail(completedBy.oldValue)
            };
          },
          receivers: receiversFn
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
          templateData({ diffs: { completionComments }, newDoc, user }) {
            return {
              docDesc: this.docDescription(newDoc),
              userName: getUserFullNameOrEmail(user),
              newValue: completionComments.newValue,
              oldValue: completionComments.oldValue
            };
          },
          receivers: receiversFn
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
          templateData({ diffs: { completionTargetDate }, newDoc }) {
            const orgId = this.docOrgId(newDoc);

            return {
              newValue: getPrettyOrgDate(completionTargetDate.newValue, orgId),
              oldValue: getPrettyOrgDate(completionTargetDate.oldValue, orgId)
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
          templateData({ diffs: { completionTargetDate }, newDoc, user }) {
            const orgId = this.docOrgId(newDoc);

            return {
              docDesc: this.docDescription(newDoc),
              userName: getUserFullNameOrEmail(user),
              newValue: getPrettyOrgDate(completionTargetDate.newValue, orgId),
              oldValue: getPrettyOrgDate(completionTargetDate.oldValue, orgId)
            };
          },
          receivers: receiversFn
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
          templateData({ diffs: { isCompleted, completionComments }, newDoc, user }) {
            return {
              docDesc: this.docDescription(newDoc),
              completed: isCompleted.newValue,
              comments: completionComments && completionComments.newValue,
              userName: getUserFullNameOrEmail(user)
            };
          },
          receivers: receiversFn
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
          templateData({ diffs: { isVerified, isVerifiedAsEffective, verificationComments }, newDoc, user }) {
            return {
              docDesc: this.docDescription(newDoc),
              verified: isVerified.newValue,
              verifiedAsEffective: isVerifiedAsEffective && isVerifiedAsEffective.newValue,
              comments: verificationComments && verificationComments.newValue,
              userName: getUserFullNameOrEmail(user)
            };
          },
          receivers: receiversFn
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
            const auditConfig = getLinkedDocAuditConfig(documentType);

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
          templateData({ diffs: { linkedTo }, newDoc, user }) {
            const { item: { documentId, documentType } } = linkedTo;

            return {
              docDesc: this.docDescription(newDoc),
              linkedDocDesc: getLinkedDocName(documentId, documentType),
              userName: getUserFullNameOrEmail(user)
            };
          },
          receivers({ diffs: { linkedTo }, newDoc, oldDoc, user }) {
            const doc = (linkedTo.kind === ITEM_ADDED) ? newDoc : oldDoc;
            return getNotificationReceivers(doc, user);
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
          templateData({ diffs: { planInPlace }, newDoc, user }) {
            return {
              docDesc: this.docDescription(newDoc),
              userName: getUserFullNameOrEmail(user),
              newValue: planInPlace.newValue,
              oldValue: planInPlace.oldValue
            };
          },
          receivers: receiversFn
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
          receivers: receiversFn
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
              newValue: getUserFullNameOrEmail(toBeCompletedBy.newValue),
              oldValue: getUserFullNameOrEmail(toBeCompletedBy.oldValue)
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
          templateData({ diffs: { toBeCompletedBy }, newDoc, user }) {
            return {
              docDesc: this.docDescription(newDoc),
              userName: getUserFullNameOrEmail(user),
              newValue: getUserFullNameOrEmail(toBeCompletedBy.newValue),
              oldValue: getUserFullNameOrEmail(toBeCompletedBy.oldValue)
            };
          },
          receivers({ diffs: { toBeCompletedBy }, newDoc, user }) {
            const receivers = getNotificationReceivers(newDoc, user);
            const index = receivers.indexOf(toBeCompletedBy.newValue);
            (index > -1) && receivers.splice(index, 1);

            return receivers;
          }
        },
        {
          shouldSendNotification({ diffs: { toBeCompletedBy: { kind } } }) {
            return _([FIELD_ADDED, FIELD_CHANGED]).contains(kind);
          },
          template: '{{userName}} assigned you to complete {{{docDesc}}}',
          templateData({ newDoc, user }) {
            return {
              docDesc: this.docDescription(newDoc),
              userName: getUserFullNameOrEmail(user)
            };
          },
          subjectTemplate: 'You have been assigned to complete an action',
          subjectTemplateData() { },
          notificationData({ newDoc }) {
            return {
              templateData: {
                button: {
                  label: 'View action',
                  url: this.docUrl(newDoc)
                }
              }
            };
          },
          receivers({ diffs: { toBeCompletedBy: { newValue } }, newDoc, user }) {
            const userId = (user === SystemName) ? user : user._id;
            return (newValue !== userId) ? [newValue]: [];
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
              newValue: getUserFullNameOrEmail(toBeVerifiedBy.newValue),
              oldValue: getUserFullNameOrEmail(toBeVerifiedBy.oldValue)
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
          templateData({ diffs: { toBeVerifiedBy }, newDoc, user }) {
            return {
              docDesc: this.docDescription(newDoc),
              userName: getUserFullNameOrEmail(user),
              newValue: getUserFullNameOrEmail(toBeVerifiedBy.newValue),
              oldValue: getUserFullNameOrEmail(toBeVerifiedBy.oldValue)
            };
          },
          receivers({ diffs: { toBeVerifiedBy }, newDoc, user }) {
            const receivers = getNotificationReceivers(newDoc, user);
            const index = receivers.indexOf(toBeVerifiedBy.newValue);
            (index > -1) && receivers.splice(index, 1);

            return receivers;
          }
        },
        {
          shouldSendNotification({ diffs: { toBeVerifiedBy: { kind } } }) {
            return _([FIELD_ADDED, FIELD_CHANGED]).contains(kind);
          },
          template: '{{userName}} assigned you to verify {{{docDesc}}}',
          templateData({ newDoc, user }) {
            return {
              docDesc: this.docDescription(newDoc),
              userName: getUserFullNameOrEmail(user)
            };
          },
          subjectTemplate: 'You have been assigned to verify an action',
          subjectTemplateData() { },
          notificationData({ newDoc }) {
            return {
              templateData: {
                button: {
                  label: 'View action',
                  url: this.docUrl(newDoc)
                }
              }
            };
          },
          receivers({ diffs: { toBeVerifiedBy: { newValue } }, newDoc, user }) {
            const userId = (user === SystemName) ? user : user._id;
            return (newValue !== userId) ? [newValue]: [];
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
          templateData({ diffs: { verificationComments }, newDoc, user }) {
            return {
              docDesc: this.docDescription(newDoc),
              userName: getUserFullNameOrEmail(user),
            };
          },
          receivers: receiversFn
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
          templateData({ diffs: { verificationTargetDate }, newDoc }) {
            const orgId = this.docOrgId(newDoc);

            return {
              newValue: getPrettyOrgDate(verificationTargetDate.newValue, orgId),
              oldValue: getPrettyOrgDate(verificationTargetDate.oldValue, orgId)
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
          templateData({ diffs: { verificationTargetDate }, newDoc, user }) {
            const orgId = this.docOrgId(newDoc);

            return {
              docDesc: this.docDescription(newDoc),
              userName: getUserFullNameOrEmail(user),
              newValue: getPrettyOrgDate(verificationTargetDate.newValue, orgId),
              oldValue: getPrettyOrgDate(verificationTargetDate.oldValue, orgId)
            };
          },
          receivers: receiversFn
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
          templateData({ diffs: { verifiedAt }, newDoc }) {
            const orgId = this.docOrgId(newDoc);

            return {
              newValue: getPrettyOrgDate(verifiedAt.newValue, orgId),
              oldValue: getPrettyOrgDate(verifiedAt.oldValue, orgId)
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
          templateData({ diffs: { verifiedAt }, newDoc, user }) {
            const orgId = this.docOrgId(newDoc);

            return {
              docDesc: this.docDescription(newDoc),
              userName: getUserFullNameOrEmail(user),
              newValue: getPrettyOrgDate(verifiedAt.newValue, orgId),
              oldValue: getPrettyOrgDate(verifiedAt.oldValue, orgId)
            };
          },
          receivers: receiversFn
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
              newValue: getUserFullNameOrEmail(verifiedBy.newValue),
              oldValue: getUserFullNameOrEmail(verifiedBy.oldValue)
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
          templateData({ diffs: { verifiedBy }, newDoc, user }) {
            return {
              docDesc: this.docDescription(newDoc),
              userName: getUserFullNameOrEmail(user),
              newValue: getUserFullNameOrEmail(verifiedBy.newValue),
              oldValue: getUserFullNameOrEmail(verifiedBy.oldValue)
            };
          },
          receivers: receiversFn
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
          receivers: receiversFn
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
          receivers: receiversFn
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
          receivers: receiversFn
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
          receivers: receiversFn
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
          receivers: receiversFn
        })
      ]
    }
  ],

  onRemoved: {
    logs: [
      {
        template: 'Document removed',
        templateData() { }
      }
    ],
    notifications: []
  },

  docId({ _id }) {
    return _id;
  },

  docDescription({ sequentialId, title }) {
    return `${sequentialId} "${title}"`;
  },

  docOrgId({ organizationId }) {
    return organizationId;
  },

  docUrl({ _id, organizationId }) {
    const { serialNumber } = Organizations.findOne({ _id: organizationId });
    const { _id:workItemId } = WorkItems.findOne({ 'linkedDoc._id': _id });

    return Meteor.absoluteUrl(`${serialNumber}/work-inbox/${workItemId}`);
  }

};
