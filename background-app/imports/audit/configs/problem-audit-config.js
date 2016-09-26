import { ProblemMagnitudes, ProblemsStatuses } from '/imports/share/constants.js';
import { Standards } from '/imports/share/collections/standards.js';
import { getUserFullNameOrEmail, getPrettyOrgDate, getUserId } from '../utils/helpers.js';
import { ChangesKinds } from '../utils/changes-kinds.js';
import StandardAuditConfig from './standard-audit-config.js';


const {
  FIELD_ADDED, FIELD_CHANGED, FIELD_REMOVED,
  ITEM_ADDED, ITEM_REMOVED
} = ChangesKinds;

export default ProblemAuditConfig = {

  onCreated: {
    logs: [
      {
        message: 'Document created',
      },
      {
        message: '{{{docDesc}}} was linked to this document',
        data({ newDoc }) {
          return _(newDoc.standardsIds.length).times(() => {
            return { docDesc: this.docDescription(newDoc) };
          });
        },
        logData({ newDoc: { standardsIds } }) {
          return _(standardsIds).map((standardId) => {
            return {
              collection: StandardAuditConfig.collectionName,
              documentId: standardId
            };
          });
        }
      }
    ],
    notifications: [
      {
        text: '{{userName}} created {{{docDesc}}} for {{{standardDesc}}}',
        data({ newDoc, user }) {
          const auditConfig = this;
          const docDesc = auditConfig.docDescription(newDoc);
          const userName = getUserFullNameOrEmail(user);

          const standards = Standards.find({ _id: { $in: newDoc.standardsIds } });

          return standards.map((standard) => {
            return {
              standardDesc: StandardAuditConfig.docDescription(standard),
              docDesc,
              userName
            };
          });
        },
        receivers({ newDoc, user }) {
          const userId = getUserId(user);
          const standards = Standards.find({ _id: { $in: newDoc.standardsIds } });

          return standards.map(({ owner }) => {
            return (owner !== userId) ? [owner] : [];
          });
        }
      }
    ]
  },

  updateHandlers: [
    {
      field: 'analysis.completedAt',
      logs: [
        {
          shouldCreateLog({ diffs }) {
            return !diffs['analysis.status'];
          },
          message: {
            [FIELD_ADDED]:
              'Root cause analysis date set to "{{newValue}}"',
            [FIELD_CHANGED]:
              'Root cause analysis date changed from "{{oldValue}}" to "{{newValue}}"',
            [FIELD_REMOVED]:
              'Root cause analysis date removed'
          }
        }
      ],
      notifications: [],
      data({ diffs, newDoc }) {
        const { newValue, oldValue } = diffs['analysis.completedAt'];
        const orgId = () => this.docOrgId(newDoc);

        return {
          newValue: () => getPrettyOrgDate(newValue, orgId()),
          oldValue: () => getPrettyOrgDate(oldValue, orgId())
        };
      }
    },

    {
      field: 'analysis.completedBy',
      logs: [
        {
          shouldCreateLog({ diffs }) {
            return !diffs['analysis.status'];
          },
          message: {
            [FIELD_ADDED]:
              'Root cause analysis completed by set to {{newValue}}',
            [FIELD_CHANGED]:
              'Root cause analysis completed by changed from {{oldValue}} to {{newValue}}',
            [FIELD_REMOVED]:
              'Root cause analysis completed by removed'
          }
        }
      ],
      notifications: [],
      data({ diffs }) {
        const { newValue, oldValue } = diffs['analysis.completedBy'];

        return {
          newValue: () => getUserFullNameOrEmail(newValue),
          oldValue: () => getUserFullNameOrEmail(oldValue)
        };
      }
    },

    {
      field: 'analysis.completionComments',
      logs: [
        {
          shouldCreateLog({ diffs }) {
            return !diffs['analysis.status'];
          },
          message: {
            [FIELD_ADDED]: 'Root cause analysis completion comments set',
            [FIELD_CHANGED]: 'Root cause analysis completion comments changed',
            [FIELD_REMOVED]: 'Root cause analysis completion comments removed'
          }
        }
      ],
      notifications: []
    },

    {
      field: 'analysis.executor',
      logs: [
        {
          message: {
            [FIELD_ADDED]:
              'Root cause analysis executor set to {{newValue}}',
            [FIELD_CHANGED]:
              'Root cause analysis executor changed from {{oldValue}} to {{newValue}}',
            [FIELD_REMOVED]:
              'Root cause analysis executor removed'
          }
        }
      ],
      notifications: [],
      data({ diffs }) {
        const { newValue, oldValue } = diffs['analysis.executor'];

        return {
          newValue: () => getUserFullNameOrEmail(newValue),
          oldValue: () => getUserFullNameOrEmail(oldValue)
        };
      }
    },

    {
      field: 'analysis.status',
      logs: [
        {
          shouldCreateLog({ diffs }) {
            return diffs['analysis.completedAt'] && diffs['analysis.completedBy'];
          },
          message: {
            [FIELD_CHANGED]:
              '{{#if completed}}' +
                'Root cause analysis completed{{#if comments}}: {{comments}}{{/if}}' +
              '{{else}}' +
                'Root cause analysis canceled' +
              '{{/if}}'
          }
        }
      ],
      notifications: [],
      data({ diffs }) {
        const { newValue:status } = diffs['analysis.status'];
        const { newValue:comments } = diffs['analysis.completionComments'] || {};

        return {
          completed: () => status === 1, // Completed
          comments: () => comments
        };
      }
    },

    {
      field: 'analysis.targetDate',
      logs: [
        {
          message: {
            [FIELD_ADDED]:
              'Root cause analysis target date set to "{{newValue}}"',
            [FIELD_CHANGED]:
              'Root cause analysis target date changed from "{{oldValue}}" to "{{newValue}}"',
            [FIELD_REMOVED]:
              'Root cause analysis target date removed'
          }
        }
      ],
      notifications: [],
      data({ diffs, newDoc }) {
        const { newValue, oldValue } = diffs['analysis.targetDate'];
        const auditConfig = this;
        const orgId = () => auditConfig.docOrgId(newDoc);

        return {
          newValue: () => getPrettyOrgDate(newValue, orgId()),
          oldValue: () => getPrettyOrgDate(oldValue, orgId())
        };
      }
    },

    {
      field: 'departmentsIds',
      logs: [
        {
          message: {
            [ITEM_ADDED]: 'Document was linked to {{{departmentDesc}}}',
            [ITEM_REMOVED]: 'Document was unlinked from {{{departmentDesc}}}'
          }
        }
      },
      notifications: [],
      data({ diffs: { departmentsIds }, newDoc, user }) {
        const { item:departmentId } = departmentsIds;
        const department = () => Departments.findOne({ _id: departmentId });
        const auditConfig = this;

        return {
          docDesc: () => auditConfig.docDescription(newDoc),
          departmentDesc: () => `${department().name} department`,
          userName: () => getUserFullNameOrEmail(user)
        };
      }
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
      notifications: [],
      data({ diffs: { description }, newDoc, user }) {
        const auditConfig = this;

        return {
          docDesc: () => auditConfig.docDescription(newDoc),
          userName: () => getUserFullNameOrEmail(user),
        };
      }
    },

    {
      field: 'fileIds',
      logs: [
        {
          message: {
            [ITEM_ADDED]: 'File "{{name}}" added',
            [ITEM_REMOVED]: 'File removed'
          }
        }
      ],
      notifications: [],
      data({ diffs: { fileIds }, newDoc, user }) {
        const { item:_id } = fileIds;
        const { name } = Files.findOne({ _id }) || {};
        const auditConfig = this;

        return {
          name: () => name,
          docDesc: () => auditConfig.docDescription(newDoc),
          userName: () => getUserFullNameOrEmail(user)
        };
      }
    },

    {
      field: 'identifiedAt',
      logs: [
        {
          message: {
            [FIELD_ADDED]:
              'Identified at set to "{{newValue}}"',
            [FIELD_CHANGED]:
              'Identified at changed from "{{oldValue}}" to "{{newValue}}"',
            [FIELD_REMOVED]:
              'Identified at removed'
          }
        }
      ],
      notifications: [],
      data({ diffs: { identifiedAt }, newDoc }) {
        const auditConfig = this;
        const orgId = () => auditConfig.docOrgId(newDoc);

        return {
          newValue: () => getPrettyOrgDate(identifiedAt.newValue, orgId()),
          oldValue: () => getPrettyOrgDate(identifiedAt.oldValue, orgId())
        };
      }
    },

    {
      field: 'identifiedBy',
      logs: [
        {
          message: {
            [FIELD_ADDED]:
              'Identified by set to {{newValue}}',
            [FIELD_CHANGED]:
              'Identified by changed from {{oldValue}} to {{newValue}}',
            [FIELD_REMOVED]:
              'Identified by removed'
          }
        }
      ],
      notifications: [],
      data({ diffs: { identifiedBy }, newDoc }) {
        const { newValue, oldValue } = identifiedBy;

        return {
          newValue: () => getUserFullNameOrEmail(newValue),
          oldValue: () => getUserFullNameOrEmail(oldValue)
        };
      }
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
      notifications: [],
      data({ newDoc, user }) {
        const auditConfig = this;

        return {
          docDesc: () => auditConfig.docDescription(newDoc),
          userName: () => getUserFullNameOrEmail(user)
        };
      }
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
      notifications: [],
      data({ diffs, newDoc, user }) {
        const _id = diffs['improvementPlan.fileIds'].item;
        const { name } = Files.findOne({ _id }) || {};
        const auditConfig = this;

        return {
          name: () => name,
          docDesc: () => auditConfig.docDescription(newDoc),
          userName: () => getUserFullNameOrEmail(user)
        };
      }
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
      notifications: [],
      data({ diffs, newDoc, user }) {
        const { newValue, oldValue } = diffs['improvementPlan.owner'];
        const auditConfig = this;

        return {
          docDesc: () => auditConfig.docDescription(newDoc),
          userName: () => getUserFullNameOrEmail(user),
          newValue: () => getUserFullNameOrEmail(newValue),
          oldValue: () => getUserFullNameOrEmail(oldValue)
        };
      }
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
      notifications: [],
      data({ diffs, newDoc, user }) {
        const { item: { date } } = diffs['improvementPlan.reviewDates'];
        const auditConfig = this;
        const orgId = () => auditConfig.docOrgId(newDoc);

        return {
          docDesc: () => auditConfig.docDescription(newDoc),
          userName: () => getUserFullNameOrEmail(user),
          date: () => getPrettyOrgDate(date, orgId())
        };
      }
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
      notifications: [],
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
      }
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
      notifications: [],
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
      }
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
      notifications: [],
      data({ diffs: { isDeleted }, newDoc, user }) {
        const auditConfig = this;

        return {
          docDesc: () => auditConfig.docDescription(newDoc),
          userName: () => getUserFullNameOrEmail(user),
          deleted: () => isDeleted.newValue
        };
      }
    },

    {
      field: 'magnitude',
      logs: [
        {
          message: {
            [FIELD_ADDED]:
              'Magnitude set to "{{newValue}}"',
            [FIELD_CHANGED]:
              'Magnitude changed from "{{oldValue}}" to "{{newValue}}"',
            [FIELD_REMOVED]:
              'Magnitude removed'
          }
        }
      ],
      notifications: [],
      data({ diffs: { magnitude: { newValue, oldValue } } }) {
        return {
          newValue: () => newValue,
          oldValue: () => oldValue
        };
      }
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
      }
    },

    {
      field: 'standardsIds',
      logs: [
        {
          message: {
            [ITEM_ADDED]: 'Document was linked to {{{standardDesc}}}',
            [ITEM_REMOVED]: 'Document was unlinked from {{{standardDesc}}}'
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
          logData({ diffs: { standardsIds } }) {
            const { item:standardId } = standardsIds;

            return {
              collection: StandardAuditConfig.collectionName,
              documentId: standardId
            };
          }
        }
      ],
      notifications: [
        {
          text: {
            [ITEM_ADDED]: '{{userName}} linked {{{docDesc}}} to {{{standardDesc}}}',
            [ITEM_REMOVED]: '{{userName}} unlinked {{{docDesc}}} from {{{standardDesc}}}'
          }
        }
      ],
      data({ diffs: { standardsIds }, newDoc, user }) {
        const auditConfig = this;
        const { item:standardId } = standardsIds;
        const standard = () => Standards.findOne({ _id: standardId });

        return {
          docDesc: () => auditConfig.docDescription(newDoc),
          standardDesc: () => StandardAuditConfig.docDescription(standard()),
          userName: () => getUserFullNameOrEmail(user)
        };
      },
      receivers({ diffs: { standardsIds }, newDoc, user }) {
        const userId = getUserId(user);
        const { item:standardId } = standardsIds;
        const { owner } = Standards.findOne({ _id: standardId }) || {};

        return (owner !== userId) ? [owner] : [];
      }
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
          shouldSendNotification({ diffs: { status: { newValue } } }) {
            return (newValue === 18) || (newValue === 19);
          },
          text: 'Status of {{{docDesc}}} was changed to "{{newValue}}"',
          title: '{{{docDesc}}} closed',
          data({ diffs: { status }, newDoc }) {
            const auditConfig = this;

            return {
              docDesc: () => auditConfig.docDescription(newDoc),
              newValue: () => ProblemsStatuses[status.newValue]
            };
          },
          emailTemplateData({ newDoc }) {
            return {
              button: {
                label: 'View document',
                url: this.docUrl(newDoc)
              }
            };
          },
          receivers({ newDoc }) {
            return [newDoc.identifiedBy];
          }
        }
      ],
      data({ diffs: { status } }) {
        const { newValue, oldValue } = status;

        return {
          newValue: () => ProblemsStatuses[newValue],
          oldValue: () => ProblemsStatuses[oldValue]
        };
      }
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
      notifications: [],
      data({ diffs: { title }, newDoc, oldDoc, user }) {
        const auditConfig = this;

        return {
          docDesc: () => auditConfig.docDescription(oldDoc),
          userName: () => getUserFullNameOrEmail(user),
          newValue: () => title.newValue,
          oldValue: () => title.oldValue
        };
      }
    },

    {
      field: 'updateOfStandards.completedAt',
      logs: [
        {
          shouldCreateLog({ diffs }) {
            return !diffs['updateOfStandards.status'];
          },
          message: {
            [FIELD_ADDED]:
              'Update of standards date set to "{{newValue}}"',
            [FIELD_CHANGED]:
              'Update of standards date changed from "{{oldValue}}" to "{{newValue}}"',
            [FIELD_REMOVED]:
              'Update of standards date removed'
          }
        }
      ],
      notifications: [],
      data({ diffs, newDoc }) {
        const { newValue, oldValue } = diffs['updateOfStandards.completedAt'];
        const auditConfig = this;
        const orgId = () => auditConfig.docOrgId(newDoc);

        return {
          newValue: () => getPrettyOrgDate(newValue, orgId()),
          oldValue: () => getPrettyOrgDate(oldValue, orgId())
        };
      }
    },

    {
      field: 'updateOfStandards.completedBy',
      logs: [
        {
          shouldCreateLog({ diffs }) {
            return !diffs['updateOfStandards.status'];
          },
          message: {
            [FIELD_ADDED]:
              'Update of standards completed by set to {{newValue}}',
            [FIELD_CHANGED]:
              'Update of standards completed by changed from {{oldValue}} to {{newValue}}',
            [FIELD_REMOVED]:
              'Update of standards completed by removed'
          }
        }
      ],
      notifications: [],
      data({ diffs }) {
        const { newValue, oldValue } = diffs['updateOfStandards.completedBy'];

        return {
          newValue: () => getUserFullNameOrEmail(newValue),
          oldValue: () => getUserFullNameOrEmail(oldValue)
        };
      }
    },

    {
      field: 'updateOfStandards.completionComments',
      logs: [
        {
          shouldCreateLog({ diffs }) {
            return !diffs['updateOfStandards.status'];
          },
          message: {
            [FIELD_ADDED]: 'Update of standards completion comments set',
            [FIELD_CHANGED]: 'Update of standards completion comments changed',
            [FIELD_REMOVED]: 'Update of standards completion comments removed'
          }
        }
      ],
      notifications: []
    },

    {
      field: 'updateOfStandards.executor',
      logs: [
        {
          message: {
            [FIELD_ADDED]:
              'Update of standards executor set to {{newValue}}',
            [FIELD_CHANGED]:
              'Update of standards executor changed from {{oldValue}} to {{newValue}}',
            [FIELD_REMOVED]:
              'Update of standards executor removed'
          }
        }
      ],
      notifications: [],
      data({ diffs }) {
        const { newValue, oldValue } = diffs['updateOfStandards.executor'];

        return {
          newValue: () => getUserFullNameOrEmail(newValue),
          oldValue: () => getUserFullNameOrEmail(oldValue)
        };
      }
    },

    {
      field: 'updateOfStandards.status',
      logs: [
        {
          shouldCreateLog({ diffs }) {
            return diffs['updateOfStandards.completedAt']
                && diffs['updateOfStandards.completedBy'];
          },
          message: {
            [FIELD_CHANGED]:
              '{{#if completed}}' +
                'Update of standards completed{{#if comments}}: {{comments}}{{/if}}' +
              '{{else}}' +
                'Update of standards canceled' +
              '{{/if}}'
          }
        }
      ],
      notifications: [],
      data({ diffs }) {
        const { newValue:status } = diffs['updateOfStandards.status'];
        const { newValue:comments } = diffs['updateOfStandards.completionComments'] || {};

        return {
          completed: status === 1, // Completed
          comments
        };
      }
    },

    {
      field: 'updateOfStandards.targetDate',
      logs: [
        {
          message: {
            [FIELD_ADDED]:
              'Update of standards target date set to "{{newValue}}"',
            [FIELD_CHANGED]:
              'Update of standards target date changed from "{{oldValue}}" to "{{newValue}}"',
            [FIELD_REMOVED]:
              'Update of standards target date removed'
          }
        }
      ],
      notifications: [],
      data({ diffs, newDoc }) {
        const { newValue, oldValue } = diffs['updateOfStandards.targetDate'];
        const auditConfig = this;
        const orgId = () => auditConfig.docOrgId(newDoc);

        return {
          newValue: () => getPrettyOrgDate(newValue, orgId()),
          oldValue: () => getPrettyOrgDate(oldValue, orgId())
        };
      }
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
  }

};
