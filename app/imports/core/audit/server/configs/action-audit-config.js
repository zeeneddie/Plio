import { Meteor } from 'meteor/meteor';

import { Actions } from '/imports/api/actions/actions.js';
import { NonConformities } from '/imports/api/non-conformities/non-conformities.js';
import { Risks } from '/imports/api/risks/risks.js';
import { ActionStatuses, CollectionNames, ProblemTypes } from '/imports/api/constants.js';
import { getCollectionByDocType } from '/imports/api/helpers.js';
import { ChangesKinds } from '../utils/changes-kinds.js';
import { getUserFullNameOrEmail, getPrettyOrgDate, getUserId } from '../utils/helpers.js';
import {
  fileIdsField,
  isDeletedField,
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

  const userId = getUserId(user);
  const index = receivers.indexOf(userId);
  (index > -1) && receivers.splice(index, 1);

  return receivers;
};

const getReceivers = function({ newDoc, user }) {
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
        message: 'Document created',
      },
      {
        message: '{{{docDesc}}} was linked to this document',
        data({ newDoc }) {
          const auditConfig = this;

          return _(newDoc.linkedTo.length).times(() => {
            return { docDesc: () => auditConfig.docDescription(newDoc) };
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
        text: '{{userName}} created action {{{docDesc}}} for {{{linkedDocDesc}}}',
        data({ newDoc }) {
          const auditConfig = this;
          const docDesc = auditConfig.docDescription(newDoc);
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
            const userId = getUserId(user);

            const collection = getCollectionByDocType(documentType);
            const { identifiedBy, standardsIds } = collection.findOne({
              _id: documentId
            }) || {};

            const receivers = new Set();
            Standards.find({ _id: { $in: standardsIds }  }).forEach(({ owner }) => {
              (owner !== userId) && receivers.add(owner);
            });

            (identifiedBy !== userId) && receivers.add(identifiedBy);

            return Array.from(receivers);
          });
        }
      },
      {
        text: '{{userName}} assigned you to complete {{{docDesc}}}',
        title: 'You have been assigned to complete an action',
        sendBoth: true,
        emailTemplateData({ newDoc }) {
          return {
            button: {
              label: 'View action',
              url: this.docUrl(newDoc)
            }
          };
        },
        data({ newDoc, user }) {
          const auditConfig = this;

          return {
            docDesc: () => auditConfig.docDescription(newDoc),
            userName: () => getUserFullNameOrEmail(user)
          };
        },
        receivers({ newDoc, user }) {
          const { toBeCompletedBy } = newDoc;
          const userId = getUserId(user);

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
          message: {
            [FIELD_ADDED]:
              'Completion date set to "{{newValue}}"',
            [FIELD_CHANGED]:
              'Completion date changed from "{{oldValue}}" to "{{newValue}}"',
            [FIELD_REMOVED]:
              'Completion date removed'
          }
        }
      ],
      notifications: [
        {
          shouldSendNotification({ diffs: { isCompleted } }) {
            return !isCompleted;
          },
          text: {
            [FIELD_ADDED]:
              '{{userName}} set completion date of {{{docDesc}}} to "{{newValue}}"',
            [FIELD_CHANGED]:
              '{{userName}} changed completion date of {{{docDesc}}} from "{{oldValue}}" to "{{newValue}}"',
            [FIELD_REMOVED]:
              '{{userName}} removed completion date of {{{docDesc}}}'
          }
        }
      ],
      data({ diffs: { completedAt }, newDoc, user }) {
        const { newValue, oldValue } = completedAt;
        const auditConfig = this;
        const orgId = () => auditConfig.docOrgId(newDoc);

        return {
          docDesc: () => auditConfig.docDescription(newDoc),
          userName: () => getUserFullNameOrEmail(user),
          newValue: () => getPrettyOrgDate(newValue, orgId()),
          oldValue: () => getPrettyOrgDate(oldValue, orgId())
        };
      },
      receivers: getReceivers
    },

    {
      field: 'completedBy',
      logs: [
        {
          shouldCreateLog({ diffs: { isCompleted } }) {
            return !isCompleted;
          },
          message: {
            [FIELD_ADDED]:
              'Completion executor set to {{newValue}}',
            [FIELD_CHANGED]:
              'Completion executor changed from {{oldValue}} to {{newValue}}',
            [FIELD_REMOVED]:
              'Completion executor removed'
          }
        }
      ],
      notifications: [
        {
          shouldSendNotification({ diffs: { isCompleted } }) {
            return !isCompleted;
          },
          text: {
            [FIELD_ADDED]:
              '{{userName}} set completion executor of {{{docDesc}}} to {{newValue}}',
            [FIELD_CHANGED]:
              '{{userName}} changed completion executor of {{{docDesc}}} from {{oldValue}} to {{newValue}}',
            [FIELD_REMOVED]:
              '{{userName}} removed completion executor of {{{docDesc}}}'
          }
        }
      ],
      data({ diffs: { completedBy }, newDoc, user }) {
        const { newValue, oldValue } = completedBy;
        const auditConfig = this;

        return {
          docDesc: () => auditConfig.docDescription(newDoc),
          userName: () => getUserFullNameOrEmail(user),
          newValue: () => getUserFullNameOrEmail(newValue),
          oldValue: () => getUserFullNameOrEmail(oldValue)
        };
      },
      receivers: getReceivers
    },

    {
      field: 'completionComments',
      logs: [
        {
          shouldCreateLog({ diffs: { isCompleted } }) {
            return !isCompleted;
          },
          message: {
            [FIELD_ADDED]: 'Completion comments set',
            [FIELD_CHANGED]: 'Completion comments changed',
            [FIELD_REMOVED]: 'Completion comments removed'
          }
        }
      ],
      notifications: [
        {
          shouldSendNotification({ diffs: { isCompleted } }) {
            return !isCompleted;
          },
          text: {
            [FIELD_ADDED]:
              '{{userName}} set completion comments of {{{docDesc}}}',
            [FIELD_CHANGED]:
              '{{userName}} changed completion comments of {{{docDesc}}}',
            [FIELD_REMOVED]:
              '{{userName}} removed completion comments of {{{docDesc}}}'
          }
        }
      ],
      data({ diffs: { completionComments }, newDoc, user }) {
        const { newValue, oldValue } = completionComments;
        const auditConfig = this;

        return {
          docDesc: () => auditConfig.docDescription(newDoc),
          userName: () => getUserFullNameOrEmail(user),
          newValue: () => newValue,
          oldValue: () => oldValue
        };
      },
      receivers: getReceivers
    },

    {
      field: 'completionTargetDate',
      logs: [
        {
          message: {
            [FIELD_ADDED]:
              'Completion target date set to "{{newValue}}"',
            [FIELD_CHANGED]:
              'Completion target date changed from "{{oldValue}}" to "{{newValue}}"',
            [FIELD_REMOVED]:
              'Completion target date removed'
          }
        }
      ],
      notifications: [
        {
          text: {
            [FIELD_ADDED]:
              '{{userName}} set completion target date of {{{docDesc}}} to "{{newValue}}"',
            [FIELD_CHANGED]:
              '{{userName}} changed completion target date of {{{docDesc}}} from "{{oldValue}}" to "{{newValue}}"',
            [FIELD_REMOVED]:
              '{{userName}} removed completion target date of {{{docDesc}}}'
          }
        }
      ],
      data({ diffs: { completionTargetDate }, newDoc, user }) {
        const { newValue, oldValue } = completionTargetDate;
        const auditConfig = this;
        const orgId = () => auditConfig.docOrgId(newDoc);

        return {
          docDesc: () => auditConfig.docDescription(newDoc),
          userName: () => getUserFullNameOrEmail(user),
          newValue: () => getPrettyOrgDate(newValue, orgId()),
          oldValue: () => getPrettyOrgDate(oldValue, orgId())
        };
      },
      receivers: getReceivers
    },

    {
      field: 'isCompleted',
      logs: [
        {
          shouldCreateLog({ diffs: { completedAt, completedBy } }) {
            return completedAt && completedBy;
          },
          message: {
            [FIELD_CHANGED]:
              '{{#if completed}}' +
                'Action completed{{#if comments}}: {{comments}}{{/if}}' +
              '{{else}}' +
                'Action completion canceled' +
              '{{/if}}'
          }
        }
      ],
      notifications: [
        {
          shouldSendNotification({ diffs: { completedAt, completedBy } }) {
            return completedAt && completedBy;
          },
          text: {
            [FIELD_CHANGED]:
              '{{#if completed}}' +
                '{{userName}} completed {{{docDesc}}}' +
                '{{#if comments}} with following comments: {{comments}}{{/if}}' +
              '{{else}}' +
                '{{userName}} canceled completion of {{{docDesc}}}' +
              '{{/if}}'
          }
        }
      ],
      data({ diffs: { isCompleted, completionComments }, newDoc, user }) {
        const auditConfig = this;

        return {
          docDesc: () => auditConfig.docDescription(newDoc),
          completed: () => isCompleted.newValue,
          comments: () => completionComments && completionComments.newValue,
          userName: () => getUserFullNameOrEmail(user)
        };
      },
      receivers: getReceivers
    },

    {
      field: 'isVerified',
      logs: [
        {
          shouldCreateLog({ diffs: { verifiedAt, verifiedBy } }) {
            return verifiedAt && verifiedBy;
          },
          message: {
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
          }
        }
      ],
      notifications: [
        {
          shouldSendNotification({ diffs: { verifiedAt, verifiedBy } }) {
            return verifiedAt && verifiedBy;
          },
          text: {
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
          }
        }
      ],
      data({ diffs, newDoc, user }) {
        const { isVerified, isVerifiedAsEffective, verificationComments } = diffs;
        const auditConfig = this;

        return {
          docDesc: () => auditConfig.docDescription(newDoc),
          verified: () => isVerified.newValue,
          verifiedAsEffective: () => isVerifiedAsEffective && isVerifiedAsEffective.newValue,
          comments: () => verificationComments && verificationComments.newValue,
          userName: () => getUserFullNameOrEmail(user)
        };
      },
      receivers: getReceivers
    },

    {
      field: 'linkedTo',
      logs: [
        {
          message: {
            [ITEM_ADDED]: 'Document was linked to {{{linkedDocDesc}}}',
            [ITEM_REMOVED]: 'Document was unlinked from {{{linkedDocDesc}}}'
          }
        },
        {
          message: {
            [ITEM_ADDED]: '{{{docDesc}}} was linked to this document',
            [ITEM_REMOVED]: '{{{docDesc}}} was unlinked from this document'
          },
          data({ newDoc }) {
            const auditConfig = this;

            return { docDesc: () => auditConfig.docDescription(newDoc) };
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
          text: {
            [ITEM_ADDED]: '{{userName}} linked {{{docDesc}}} to {{{linkedDocDesc}}}',
            [ITEM_REMOVED]: '{{userName}} unlinked {{{docDesc}}} from {{{linkedDocDesc}}}'
          }
        }
      ],
      data({ diffs: { linkedTo }, newDoc, user }) {
        const { item: { documentId, documentType } } = linkedTo;
        const auditConfig = this;

        return {
          docDesc: () => auditConfig.docDescription(newDoc),
          linkedDocDesc: () => getLinkedDocName(documentId, documentType),
          userName: () => getUserFullNameOrEmail(user)
        };
      },
      receivers({ diffs: { linkedTo }, newDoc, oldDoc, user }) {
        const doc = (linkedTo.kind === ITEM_ADDED) ? newDoc : oldDoc;
        return getNotificationReceivers(doc, user);
      }
    },

    {
      field: 'planInPlace',
      logs: [
        {
          message: {
            [FIELD_ADDED]: 'Plan in place set to "{{newValue}}"',
            [FIELD_CHANGED]: 'Plan in place changed from "{{oldValue}}" to "{{newValue}}"',
            [FIELD_REMOVED]: 'Plan in place removed'
          }
        }
      ],
      notifications: [
        {
          text: {
            [FIELD_ADDED]:
              '{{userName}} set plan in place of {{{docDesc}}} to "{{newValue}}"',
            [FIELD_CHANGED]:
              '{{userName}} changed plan in place of {{{docDesc}}} from "{{oldValue}}" to "{{newValue}}"',
            [FIELD_REMOVED]:
              '{{userName}} removed plan in place of {{{docDesc}}}'
          }
        }
      ],
      data({ diffs: { planInPlace }, newDoc, user }) {
        const { newValue, oldValue } = planInPlace;
        const auditConfig = this;

        return {
          docDesc: () => auditConfig.docDescription(newDoc),
          userName: () => getUserFullNameOrEmail(user),
          newValue: () => newValue,
          oldValue: () => oldValue
        };
      },
      receivers: getReceivers
    },

    {
      field: 'status',
      logs: [
        {
          message: {
            [FIELD_ADDED]: 'Status set to "{{newValue}}"',
            [FIELD_CHANGED]: 'Status changed from "{{oldValue}}" to "{{newValue}}"',
            [FIELD_REMOVED]: 'Status removed'
          }
        }
      ],
      notifications: [
        /*{
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
          receivers: getReceivers
        }*/
      ],
      data({ diffs: { status } }) {
        const { newValue, oldValue } = status;

        return {
          newValue: () => ActionStatuses[newValue],
          oldValue: () => ActionStatuses[oldValue]
        };
      },
      receivers: getReceivers
    },

    {
      field: 'toBeCompletedBy',
      logs: [
        {
          message: {
            [FIELD_ADDED]:
              'Completion executor set to {{newValue}}',
            [FIELD_CHANGED]:
              'Completion executor changed from {{oldValue}} to {{newValue}}',
            [FIELD_REMOVED]:
              'Completion executor removed'
          }
        }
      ],
      notifications: [
        {
          text: {
            [FIELD_ADDED]:
              '{{userName}} set completion executor of {{{docDesc}}} to {{newValue}}',
            [FIELD_CHANGED]:
              '{{userName}} changed completion executor of {{{docDesc}}} from {{oldValue}} to {{newValue}}',
            [FIELD_REMOVED]:
              '{{userName}} removed completion executor of {{{docDesc}}}'
          }
        },
        {
          shouldSendNotification({ diffs: { toBeCompletedBy: { kind } } }) {
            return _([FIELD_ADDED, FIELD_CHANGED]).contains(kind);
          },
          text: '{{userName}} assigned you to complete {{{docDesc}}}',
          title: 'You have been assigned to complete an action',
          sendBoth: true,
          data({ newDoc, user }) {
            const auditConfig = this;

            return {
              docDesc: () => auditConfig.docDescription(newDoc),
              userName: () => getUserFullNameOrEmail(user)
            };
          },
          emailTemplateData({ newDoc }) {
            return {
              button: {
                label: 'View action',
                url: this.docUrl(newDoc)
              }
            };
          },
          receivers({ diffs: { toBeCompletedBy: { newValue } }, user }) {
            return (newValue !== getUserId(user)) ? [newValue]: [];
          }
        }
      ],
      data({ diffs: { toBeCompletedBy }, newDoc, user }) {
        const { newValue, oldValue } = toBeCompletedBy;
        const auditConfig = this;

        return {
          docDesc: () => auditConfig.docDescription(newDoc),
          userName: () => getUserFullNameOrEmail(user),
          newValue: () => getUserFullNameOrEmail(newValue),
          oldValue: () => getUserFullNameOrEmail(oldValue)
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
      field: 'toBeVerifiedBy',
      logs: [
        {
          message: {
            [FIELD_ADDED]:
              'Verification executor set to {{newValue}}',
            [FIELD_CHANGED]:
              'Verification executor changed from {{oldValue}} to {{newValue}}',
            [FIELD_REMOVED]:
              'Verification executor removed'
          }
        }
      ],
      notifications: [
        {
          text: {
            [FIELD_ADDED]:
              '{{userName}} set verification executor of {{{docDesc}}} to {{newValue}}',
            [FIELD_CHANGED]:
              '{{userName}} changed verification executor of {{{docDesc}}} from {{oldValue}} to {{newValue}}',
            [FIELD_REMOVED]:
              '{{userName}} removed verification executor of {{{docDesc}}}'
          }
        },
        {
          shouldSendNotification({ diffs: { toBeVerifiedBy: { kind } } }) {
            return _([FIELD_ADDED, FIELD_CHANGED]).contains(kind);
          },
          text: '{{userName}} assigned you to verify {{{docDesc}}}',
          title: 'You have been assigned to verify an action',
          sendBoth: true,
          data({ newDoc, user }) {
            const auditConfig = this;

            return {
              docDesc: () => auditConfig.docDescription(newDoc),
              userName: () => getUserFullNameOrEmail(user)
            };
          },
          emailTemplateData({ newDoc }) {
            return {
              button: {
                label: 'View action',
                url: this.docUrl(newDoc)
              }
            };
          },
          receivers({ diffs: { toBeVerifiedBy: { newValue } }, user }) {
            return (newValue !== getUserId(user)) ? [newValue]: [];
          }
        }
      ],
      data({ diffs: { toBeVerifiedBy }, newDoc, user }) {
        const { newValue, oldValue } = toBeVerifiedBy;
        const auditConfig = this;

        return {
          docDesc: () => auditConfig.docDescription(newDoc),
          userName: () => getUserFullNameOrEmail(user),
          newValue: () => getUserFullNameOrEmail(newValue),
          oldValue: () => getUserFullNameOrEmail(oldValue)
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
      field: 'verificationComments',
      logs: [
        {
          shouldCreateLog({ diffs: { isVerified } }) {
            return !isVerified;
          },
          message: {
            [FIELD_ADDED]: 'Verification comments set',
            [FIELD_CHANGED]: 'Verification comments changed',
            [FIELD_REMOVED]: 'Verification comments removed'
          }
        }
      ],
      notifications: [
        {
          shouldSendNotification({ diffs: { isVerified } }) {
            return !isVerified;
          },
          text: {
            [FIELD_ADDED]:
              '{{userName}} set verification comments of {{{docDesc}}}',
            [FIELD_CHANGED]:
              '{{userName}} changed verification comments of {{{docDesc}}}',
            [FIELD_REMOVED]:
              '{{userName}} removed verification comments of {{{docDesc}}}'
          }
        }
      ],
      data({ diffs: { verificationComments }, newDoc, user }) {
        const auditConfig = this;

        return {
          docDesc: () => auditConfig.docDescription(newDoc),
          userName: () => getUserFullNameOrEmail(user),
        };
      },
      receivers: getReceivers
    },

    {
      field: 'verificationTargetDate',
      logs: [
        {
          message: {
            [FIELD_ADDED]:
              'Verification target date set to "{{newValue}}"',
            [FIELD_CHANGED]:
              'Verification target date changed from "{{oldValue}}" to "{{newValue}}"',
            [FIELD_REMOVED]:
              'Verification target date removed'
          }
        }
      ],
      notifications: [
        {
          text: {
            [FIELD_ADDED]:
              '{{userName}} set verification target date of {{{docDesc}}} to "{{newValue}}"',
            [FIELD_CHANGED]:
              '{{userName}} changed verification target date of {{{docDesc}}} from "{{oldValue}}" to "{{newValue}}"',
            [FIELD_REMOVED]:
              '{{userName}} removed verification target date of {{{docDesc}}}'
          }
        }
      ],
      data({ diffs: { verificationTargetDate }, newDoc, user }) {
        const { newValue, oldValue } = verificationTargetDate;
        const auditConfig = this;
        const orgId = () => auditConfig.docOrgId(newDoc);

        return {
          docDesc: () => auditConfig.docDescription(newDoc),
          userName: () => getUserFullNameOrEmail(user),
          newValue: () => getPrettyOrgDate(newValue, orgId()),
          oldValue: () => getPrettyOrgDate(oldValue, orgId())
        };
      },
      receivers: getReceivers
    },

    {
      field: 'verifiedAt',
      logs: [
        {
          shouldCreateLog({ diffs: { isVerified } }) {
            return !isVerified;
          },
          message: {
            [FIELD_ADDED]:
              'Verification date set to "{{newValue}}"',
            [FIELD_CHANGED]:
              'Verification date changed from "{{oldValue}}" to "{{newValue}}"',
            [FIELD_REMOVED]:
              'Verification date removed'
          }
        }
      ],
      notifications: [
        {
          shouldSendNotification({ diffs: { isVerified } }) {
            return !isVerified;
          },
          text: {
            [FIELD_ADDED]:
              '{{userName}} set verification date of {{{docDesc}}} to "{{newValue}}"',
            [FIELD_CHANGED]:
              '{{userName}} changed verification date of {{{docDesc}}} from "{{oldValue}}" to "{{newValue}}"',
            [FIELD_REMOVED]:
              '{{userName}} removed verification date of {{{docDesc}}}'
          }
        }
      ],
      data({ diffs: { verifiedAt }, newDoc, user }) {
        const { newValue, oldValue } = verifiedAt;
        const auditConfig = this;
        const orgId = () => auditConfig.docOrgId(newDoc);

        return {
          docDesc: () => auditConfig.docDescription(newDoc),
          userName: () => getUserFullNameOrEmail(user),
          newValue: () => getPrettyOrgDate(newValue, orgId()),
          oldValue: () => getPrettyOrgDate(oldValue, orgId())
        };
      },
      receivers: getReceivers
    },

    {
      field: 'verifiedBy',
      logs: [
        {
          shouldCreateLog({ diffs: { isVerified } }) {
            return !isVerified;
          },
          message: {
            [FIELD_ADDED]:
              'Verification executor set to {{newValue}}',
            [FIELD_CHANGED]:
              'Verification executor changed from {{oldValue}} to {{newValue}}',
            [FIELD_REMOVED]:
              'Verification executor removed'
          }
        }
      ],
      notifications: [
        {
          shouldSendNotification({ diffs: { isVerified } }) {
            return !isVerified;
          },
          text: {
            [FIELD_ADDED]:
              '{{userName}} set verification executor of {{{docDesc}}} to {{newValue}}',
            [FIELD_CHANGED]:
              '{{userName}} changed verification executor of {{{docDesc}}} from {{oldValue}} to {{newValue}}',
            [FIELD_REMOVED]:
              '{{userName}} removed verification executor of {{{docDesc}}}'
          }
        }
      ],
      data({ diffs: { verifiedBy }, newDoc, user }) {
        const { newValue, oldValue } = verifiedBy;
        const auditConfig = this;

        return {
          docDesc: () => auditConfig.docDescription(newDoc),
          userName: () => getUserFullNameOrEmail(user),
          newValue: () => getUserFullNameOrEmail(newValue),
          oldValue: () => getUserFullNameOrEmail(oldValue)
        };
      },
      receivers: getReceivers
    },

    {
      field: fileIdsField.field,
      logs: [
        fileIdsField.logConfig
      ],
      notifications: [
        fileIdsField.notificationConfig
      ],
      data: fileIdsField.data,
      receivers: getReceivers
    },

    {
      field: isDeletedField.field,
      logs: [
        isDeletedField.logConfig
      ],
      notifications: [
        isDeletedField.notificationConfig
      ],
      data: isDeletedField.data,
      receivers: getReceivers
    },

    {
      field: notesField.field,
      logs: [
        notesField.logConfig
      ],
      notifications: [
        notesField.notificationConfig
      ],
      data: notesField.data,
      receivers: getReceivers
    },

    {
      field: notifyField.field,
      logs: [
        notifyField.logConfig
      ],
      notifications: [
        notifyField.notificationConfig,
        notifyField.personalNotificationConfig
      ],
      data: notifyField.data,
      receivers({ diffs: { notify }, newDoc, user }) {
        const receivers = getNotificationReceivers(newDoc, user);
        const index = receivers.indexOf(notify.item);
        (index > -1) && receivers.splice(index, 1);

        return receivers;
      }
    },

    {
      field: ownerIdField.field,
      logs: [
        ownerIdField.logConfig
      ],
      notifications: [
        ownerIdField.notificationConfig,
      ],
      data: ownerIdField.data,
      receivers: getReceivers
    },

    {
      field: titleField.field,
      logs: [
        titleField.logConfig
      ],
      notifications: [
        titleField.notificationConfig,
      ],
      data: titleField.data,
      receivers: getReceivers
    }
  ],

  onRemoved: {
    logs: [
      {
        message: 'Document removed'
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
    const { serialNumber } = Organizations.findOne({ _id: organizationId }) || {};
    const { _id:workItemId } = WorkItems.findOne({ 'linkedDoc._id': _id }) || {};

    return Meteor.absoluteUrl(`${serialNumber}/work-inbox/${workItemId}`);
  }
};
