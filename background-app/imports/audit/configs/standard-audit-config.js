import { Standards } from '/imports/api/standards/standards.js';
import { StandardsBookSections } from '/imports/api/standards-book-sections/standards-book-sections.js';
import { StandardTypes } from '/imports/api/standards-types/standards-types.js';
import { Files } from '/imports/api/files/files.js';
import { CollectionNames, StandardStatuses } from '/imports/api/constants.js';
import { getUserFullNameOrEmail, getPrettyOrgDate, getUserId } from '../utils/helpers.js';
import { ChangesKinds } from '../utils/changes-kinds.js';


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
      field: 'departmentsIds',
      logs: [
        {
          message: {
            [ITEM_ADDED]: 'Document was linked to {{{departmentDesc}}}',
            [ITEM_REMOVED]: 'Document was unlinked from {{{departmentDesc}}}'
          }
        }
      ],
      notifications: [
        {
          text: {
            [ITEM_ADDED]: '{{userName}} linked {{{docDesc}}} to {{{departmentDesc}}}',
            [ITEM_REMOVED]: '{{userName}} unlinked {{{docDesc}}} from {{{departmentDesc}}}'
          }
        }
      ],
      data({ diffs: { departmentsIds }, newDoc, user }) {
        const { item:departmentId } = departmentsIds;
        const department = () => Departments.findOne({ _id: departmentId });
        const auditConfig = this;

        return {
          docDesc: () => auditConfig.docDescription(newDoc),
          departmentDesc: () => `${department().name} department`,
          userName: () => getUserFullNameOrEmail(user)
        };
      },
      receivers: getReceivers
    },

    {
      field: 'description',
      logs: [
        {
          message: {
            [FIELD_ADDED]: 'Description set',
            [FIELD_CHANGED]: 'Description changed',
            [FIELD_REMOVED]: 'Description removed'
          }
        }
      ],
      notifications: [
        {
          text: {
            [FIELD_ADDED]: '{{userName}} set description of {{{docDesc}}}',
            [FIELD_CHANGED]: '{{userName}} changed description of {{{docDesc}}}',
            [FIELD_REMOVED]: '{{userName}} removed description of {{{docDesc}}}'
          }
        }
      ],
      data({ diffs: { description }, newDoc, user }) {
        const auditConfig = this;

        return {
          docDesc: () => auditConfig.docDescription(newDoc),
          userName: () => getUserFullNameOrEmail(user),
        };
      },
      receivers: getReceivers
    },

    {
      field: 'improvementPlan.desiredOutcome',
      logs: [
        {
          message: {
            [FIELD_ADDED]: 'Improvement plan statement of desired outcome set',
            [FIELD_CHANGED]: 'Improvement plan statement of desired outcome changed',
            [FIELD_REMOVED]: 'Improvement plan statement of desired outcome removed'
          }
        }
      ],
      notifications: [
        {
          text: {
            [FIELD_ADDED]:
              '{{userName}} set improvement plan\'s statement of desired outcome of {{{docDesc}}}',
            [FIELD_CHANGED]:
              '{{userName}} changed improvement plan\'s statement of desired outcome of {{{docDesc}}}',
            [FIELD_REMOVED]:
              '{{userName}} removed improvement plan\'s statement of desired outcome of {{{docDesc}}}'
          }
        }
      ],
      data({ newDoc, user }) {
        const auditConfig = this;

        return {
          docDesc: () => auditConfig.docDescription(newDoc),
          userName: () => getUserFullNameOrEmail(user)
        };
      },
      receivers: getReceivers
    },

    {
      field: 'improvementPlan.fileIds',
      logs: [
        {
          message: {
            [ITEM_ADDED]: 'Improvement plan file "{{name}}" added',
            [ITEM_REMOVED]: 'Improvement plan file removed'
          }
        }
      ],
      notifications: [
        {
          text: {
            [ITEM_ADDED]: '{{userName}} added file "{{name}}" to improvement plan of {{{docDesc}}}',
            [ITEM_REMOVED]: '{{userName}} removed file from improvement plan of {{{docDesc}}}'
          }
        }
      ],
      data({ diffs, newDoc, user }) {
        const _id = diffs['improvementPlan.fileIds'].item;
        const { name } = Files.findOne({ _id }) || {};
        const auditConfig = this;

        return {
          name: () => name,
          docDesc: () => auditConfig.docDescription(newDoc),
          userName: () => getUserFullNameOrEmail(user)
        };
      },
      receivers: getReceivers
    },

    {
      field: 'improvementPlan.owner',
      logs: [
        {
          message: {
            [FIELD_ADDED]:
              'Improvement plan owner set to {{newValue}}',
            [FIELD_CHANGED]:
              'Improvement plan owner changed from {{oldValue}} to {{newValue}}',
            [FIELD_REMOVED]:
              'Improvement plan owner removed'
          }
        }
      ],
      notifications: [
        {
          text: {
            [FIELD_ADDED]:
              '{{userName}} set improvement plan\'s owner of {{{docDesc}}} to {{newValue}}',
            [FIELD_CHANGED]:
              '{{userName}} changed improvement plan\'s owner of {{{docDesc}}} from {{oldValue}} to {{newValue}}',
            [FIELD_REMOVED]:
              '{{userName}} removed improvement plan\'s owner of {{{docDesc}}}'
          }
        }
      ],
      data({ diffs, newDoc, user }) {
        const { newValue, oldValue } = diffs['improvementPlan.owner'];
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
      field: 'improvementPlan.reviewDates',
      logs: [
        {
          message: {
            [ITEM_ADDED]: 'Improvement plan review date added: "{{date}}"',
            [ITEM_REMOVED]: 'Improvement plan review date removed: "{{date}}"'
          }
        }
      ],
      notifications: [
        {
          text: {
            [ITEM_ADDED]:
              '{{userName}} added improvement plan\'s review date for {{{docDesc}}}: "{{date}}"',
            [ITEM_REMOVED]:
              '{{userName}} removed improvement plan\'s review date for {{{docDesc}}}: "{{date}}"'
          }
        }
      ],
      data({ diffs, newDoc, user }) {
        const { item: { date } } = diffs['improvementPlan.reviewDates'];
        const auditConfig = this;
        const orgId = () => auditConfig.docOrgId(newDoc);

        return {
          docDesc: () => auditConfig.docDescription(newDoc),
          userName: () => getUserFullNameOrEmail(user),
          date: () => getPrettyOrgDate(date, orgId())
        };
      },
      receivers: getReceivers
    },

    {
      field: 'improvementPlan.reviewDates.$.date',
      logs: [
        {
          message: {
            [FIELD_CHANGED]:
              'Improvement plan review date changed from "{{oldValue}}" to "{{newValue}}"'
          }
        }
      ],
      notifications: [
        {
          text: {
            [FIELD_CHANGED]:
              '{{userName}} changed improvement plan\'s review date of {{{docDesc}}} from "{{oldValue}}" to "{{newValue}}"'
          }
        }
      ],
      data({ diffs, newDoc, user }) {
        const { newValue, oldValue } = diffs['improvementPlan.reviewDates.$.date'];
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
      field: 'improvementPlan.targetDate',
      logs: [
        {
          message: {
            [FIELD_ADDED]:
              'Improvement plan target date for desired outcome set to "{{newValue}}"',
            [FIELD_CHANGED]:
              'Improvement plan target date for desired outcome changed from "{{oldValue}}" to "{{newValue}}"',
            [FIELD_REMOVED]:
              'Improvement plan target date for desired outcome removed'
          }
        }
      ],
      notifications: [
        {
          text: {
            [FIELD_ADDED]:
              '{{userName}} set improvement plan\'s target date for desired outcome of {{{docDesc}}} to "{{newValue}}"',
            [FIELD_CHANGED]:
              '{{userName}} changed improvement plan\'s target date for desired outcome of {{{docDesc}}} from "{{oldValue}}" to "{{newValue}}"',
            [FIELD_REMOVED]:
              '{{userName}} removed improvement plan\'s target date for desired outcome of {{{docDesc}}}'
          }
        }
      ],
      data({ diffs, newDoc, user }) {
        const { newValue, oldValue } = diffs['improvementPlan.targetDate'];
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
      field: 'isDeleted',
      logs: [
        {
          shouldCreateLog({ diffs: { deletedAt, deletedBy } }) {
            return deletedAt && deletedBy;
          },
          message: {
            [FIELD_CHANGED]:
              '{{#if deleted}}Document was deleted{{else}}Document was restored{{/if}}'
          }
        }
      ],
      notifications: [
        {
          shouldSendNotification({ diffs: { deletedAt, deletedBy } }) {
            return deletedAt && deletedBy;
          },
          text: {
            [ChangesKinds.FIELD_CHANGED]:
              '{{userName}} {{#if deleted}}deleted{{else}}restored{{/if}} {{{docDesc}}}'
          },
          title: {
            [ChangesKinds.FIELD_CHANGED]:
              '{{userName}} {{#if deleted}}deleted{{else}}restored{{/if}} {{{docDesc}}}'
          }
        }
      ],
      data({ diffs: { isDeleted }, newDoc, user }) {
        const auditConfig = this;

        return {
          docDesc: () => auditConfig.docDescription(newDoc),
          userName: () => getUserFullNameOrEmail(user),
          deleted: () => isDeleted.newValue
        };
      },
      receivers: getReceivers
    },

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
      field: 'notify',
      logs: [
        {
          message: {
            [ITEM_ADDED]: '{{item}} was added to notification list',
            [ITEM_REMOVED]: '{{item}} was removed from notification list'
          }
        }
      ],
      notifications: [
        {
          text: {
            [ITEM_ADDED]:
              '{{userName}} added {{item}} to the notification list of {{{docDesc}}}',
            [ITEM_REMOVED]:
              '{{userName}} removed {{item}} from the notification list of {{{docDesc}}}'
          }
        },
        {
          shouldSendNotification({ diffs: { notify: { kind } } }) {
            return kind === ITEM_ADDED;
          },
          text: '{{userName}} added you to the notification list of {{{docDesc}}}',
          title: 'You have been added to the notification list',
          emailTemplateData({ newDoc }) {
            return {
              button: {
                label: 'View document',
                url: this.docUrl(newDoc)
              }
            };
          },
          receivers({ diffs: { notify }, user }) {
            const { item:addedUserId } = notify;
            const userId = getUserId(user);

            return (addedUserId !== userId) ? [addedUserId]: [];
          }
        }
      ],
      data({ diffs: { notify }, newDoc, user }) {
        const auditConfig = this;

        return {
          docDesc: () => auditConfig.docDescription(newDoc),
          userName: () => getUserFullNameOrEmail(user),
          item: () => getUserFullNameOrEmail(notify.item)
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
      field: 'title',
      logs: [
        {
          message: {
            [FIELD_ADDED]: 'Title set to "{{newValue}}"',
            [FIELD_CHANGED]: 'Title changed from "{{oldValue}}" to "{{newValue}}"',
            [FIELD_REMOVED]: 'Title removed'
          }
        }
      ],
      notifications: [
        {
          text: {
            [FIELD_ADDED]:
              '{{userName}} set title of {{{docDesc}}} to "{{newValue}}"',
            [FIELD_CHANGED]:
              '{{userName}} changed title of {{{docDesc}}} from "{{oldValue}}" to "{{newValue}}"',
            [FIELD_REMOVED]:
              '{{userName}} removed title of {{{docDesc}}}'
          }
        }
      ],
      data({ diffs: { title }, newDoc, oldDoc, user }) {
        const auditConfig = this;

        return {
          docDesc: () => auditConfig.docDescription(oldDoc),
          userName: () => getUserFullNameOrEmail(user),
          newValue: () => title.newValue,
          oldValue: () => title.oldValue
        };
      },
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
