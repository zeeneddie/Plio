import { Standards } from '/imports/api/standards/standards.js';
import { StandardsBookSections } from '/imports/api/standards-book-sections/standards-book-sections.js';
import { StandardTypes } from '/imports/api/standards-types/standards-types.js';
import { Files } from '/imports/api/files/files.js';
import { CollectionNames, StandardStatuses } from '/imports/api/constants.js';
import { getUserFullNameOrEmail, getPrettyOrgDate, getUserId } from '../utils/helpers.js';
import { ChangesKinds } from '../utils/changes-kinds.js';
import {
  departmentsIdsField,
  descriptionField,
  IPDesiredOutcomeField,
  IPFileIdsField,
  IPOwnerField,
  IPReviewDatesField,
  IPReviewDateField,
  IPTargetDateField,
  isDeletedField,
  notifyField,
  titleField
} from './reusable-update-handlers.js';


const {
  FIELD_ADDED, FIELD_CHANGED, FIELD_REMOVED,
  ITEM_ADDED, ITEM_REMOVED
} = ChangesKinds;

const getReceivers = function({ newDoc, user }) {
  const { owner } = newDoc;
  const userId = getUserId(user);

  return (owner !== userId) ? [owner]: [];
};

export default StandardAuditConfig = {

  collection: Standards,

  collectionName: CollectionNames.STANDARDS,

  onCreated: {
    logs: [
      {
        message: 'Document created'
      }
    ],
    notifications: []
  },

  updateHandlers: [
    {
      field: 'issueNumber',
      logs: [
        {
          message: {
            [FIELD_ADDED]: 'Issue number set to "{{newValue}}"',
            [FIELD_CHANGED]: 'Issue number changed from "{{oldValue}}" to "{{newValue}}"',
            [FIELD_REMOVED]: 'Issue number removed'
          }
        }
      ],
      notifications: [
        {
          text: {
            [FIELD_ADDED]:
              '{{userName}} set issue number of {{{docDesc}}} to "{{newValue}}"',
            [FIELD_CHANGED]:
              '{{userName}} changed issue number of {{{docDesc}}} from "{{oldValue}}" to "{{newValue}}"',
            [FIELD_REMOVED]:
              '{{userName}} removed issue number of {{{docDesc}}}'
          }
        }
      ],
      data({ diffs: { issueNumber }, newDoc, user }) {
        const { newValue, oldValue } = issueNumber;
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
      field: 'owner',
      logs: [
        {
          message: {
            [FIELD_ADDED]: 'Owner set to {{newValue}}',
            [FIELD_CHANGED]: 'Owner changed from {{oldValue}} to {{newValue}}',
            [FIELD_REMOVED]: 'Owner removed'
          }
        }
      ],
      notifications: [
        {
          text: {
            [FIELD_ADDED]:
              '{{userName}} set owner of {{{docDesc}}} to {{newValue}}',
            [FIELD_CHANGED]:
              '{{userName}} changed owner of {{{docDesc}}} from {{oldValue}} to {{newValue}}',
            [FIELD_REMOVED]:
              '{{userName}} removed owner of {{{docDesc}}}'
          }
        }
      ],
      data({ diffs: { owner }, newDoc, user }) {
        const { newValue, oldValue } = owner;
        const auditConfig = this;

        return {
          docDesc: () => auditConfig.docDescription(newDoc),
          userName: () => getUserFullNameOrEmail(user),
          newValue: () => getUserFullNameOrEmail(newValue),
          oldValue: () => getUserFullNameOrEmail(oldValue)
        };
      },
      receivers({ newDoc, oldDoc, user }) {
        const { owner:newOwner } = newDoc;
        const { owner:oldOwner } = oldDoc;
        const userId = getUserId(user);

        return _([newOwner, oldOwner]).filter((owner) => {
          return owner !== userId;
        });
      }
    },

    {
      field: 'sectionId',
      logs: [
        {
          message: {
            [FIELD_ADDED]:
              'Book section set to "{{newValue}}"',
            [FIELD_CHANGED]:
              'Book section changed from "{{oldValue}}" to "{{newValue}}"',
            [FIELD_REMOVED]:
              'Book section removed'
          }
        }
      ],
      notifications: [
        {
          text: {
            [FIELD_ADDED]:
              '{{userName}} set book section of {{{docDesc}}} to "{{newValue}}"',
            [FIELD_CHANGED]:
              '{{userName}} changed book section of {{{docDesc}}} from "{{oldValue}}" to "{{newValue}}"',
            [FIELD_REMOVED]:
              '{{userName}} removed book section of {{{docDesc}}}'
          }
        }
      ],
      data({ diffs: { sectionId }, newDoc, user }) {
        const auditConfig = this;
        const { newValue, oldValue } = sectionId;

        const getSectionTitle = (_id) => {
          const { title } = StandardsBookSections.findOne({ _id }) || {};
          return title;
        };

        return {
          docDesc: () => auditConfig.docDescription(newDoc),
          userName: () => getUserFullNameOrEmail(user),
          newValue: () => getSectionTitle(newValue),
          oldValue: () => getSectionTitle(oldValue)
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
        {
          text: {
            [FIELD_ADDED]:
              '{{userName}} set status of {{{docDesc}}} to "{{newValue}}"',
            [FIELD_CHANGED]:
              '{{userName}} changed status of {{{docDesc}}} from "{{oldValue}}" to "{{newValue}}"',
            [FIELD_REMOVED]:
              '{{userName}} removed status of {{{docDesc}}}'
          }
        }
      ],
      data({ diffs: { status }, newDoc, user }) {
        const { newValue, oldValue } = status;
        const auditConfig = this;

        return {
          docDesc: () => auditConfig.docDescription(newDoc),
          userName: () => getUserFullNameOrEmail(user),
          newValue: () => StandardStatuses[newValue],
          oldValue: () => StandardStatuses[oldValue]
        };
      },
      receivers: getReceivers
    },

    {
      field: 'typeId',
      logs: [
        {
          message: {
            [FIELD_ADDED]: 'Type set to "{{newValue}}"',
            [FIELD_CHANGED]: 'Type changed from "{{oldValue}}" to "{{newValue}}"',
            [FIELD_REMOVED]: 'Type removed'
          }
        }
      ],
      notifications: [
        {
          text: {
            [FIELD_ADDED]:
              '{{userName}} set type of {{{docDesc}}} to "{{newValue}}"',
            [FIELD_CHANGED]:
              '{{userName}} changed type of {{{docDesc}}} from "{{oldValue}}" to "{{newValue}}"',
            [FIELD_REMOVED]:
              '{{userName}} removed type of {{{docDesc}}}'
          }
        }
      ],
      data({ diffs: { typeId }, newDoc, user }) {
        const auditConfig = this;
        const { newValue, oldValue } = typeId;

        const getStandardTypeName = (_id) => {
          const { name } = StandardTypes.findOne({ _id }) || {};
          return name;
        };

        return {
          docDesc: () => auditConfig.docDescription(newDoc),
          userName: () => getUserFullNameOrEmail(user),
          newValue: () => getStandardTypeName(newValue),
          oldValue: () => getStandardTypeName(oldValue)
        };
      },
      receivers: getReceivers
    },

    {
      field: departmentsIdsField.field,
      logs: [
        departmentsIdsField.logConfig
      ],
      notifications: [
        departmentsIdsField.notificationConfig
      ],
      data: departmentsIdsField.data,
      receivers: getReceivers
    },

    {
      field: descriptionField.field,
      logs: [
        descriptionField.logConfig
      ],
      notifications: [
        descriptionField.notificationConfig
      ],
      data: descriptionField.data,
      receivers: getReceivers
    },

    {
      field: IPDesiredOutcomeField.field,
      logs: [
        IPDesiredOutcomeField.logConfig
      ],
      notifications: [
        IPDesiredOutcomeField.notificationConfig
      ],
      data: IPDesiredOutcomeField.data,
      receivers: getReceivers
    },

    {
      field: IPFileIdsField.field,
      logs: [
        IPFileIdsField.logConfig
      ],
      notifications: [
        IPFileIdsField.notificationConfig
      ],
      data: IPFileIdsField.data,
      receivers: getReceivers
    },

    {
      field: IPOwnerField.field,
      logs: [
        IPOwnerField.logConfig
      ],
      notifications: [
        IPOwnerField.notificationConfig
      ],
      data: IPOwnerField.data,
      receivers: getReceivers
    },

    {
      field: IPReviewDatesField.field,
      logs: [
        IPReviewDatesField.logConfig
      ],
      notifications: [
        IPReviewDatesField.notificationConfig
      ],
      data: IPReviewDatesField.data,
      receivers: getReceivers
    },

    {
      field: IPReviewDateField.field,
      logs: [
        IPReviewDateField.logConfig
      ],
      notifications: [
        IPReviewDateField.notificationConfig
      ],
      data: IPReviewDateField.data,
      receivers: getReceivers
    },

    {
      field: IPTargetDateField.field,
      logs: [
        IPTargetDateField.logConfig
      ],
      notifications: [
        IPTargetDateField.notificationConfig
      ],
      data: IPTargetDateField.data,
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
      field: notifyField.field,
      logs: [
        notifyField.logConfig
      ],
      notifications: [
        notifyField.notificationConfig,
        notifyField.personalNotificationConfig
      ],
      data: notifyField.data,
      receivers: getReceivers
    },

    {
      field: titleField.field,
      logs: [
        titleField.logConfig
      ],
      notifications: [
        titleField.notificationConfig
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

  docDescription({ title }) {
    return `"${title}" standard`;
  },

  docOrgId({ organizationId }) {
    return organizationId;
  },

  docUrl({ _id, organizationId }) {
    const { serialNumber } = Organizations.findOne({ _id: organizationId });

    return Meteor.absoluteUrl(`${serialNumber}/standards/${_id}`);
  }

};
