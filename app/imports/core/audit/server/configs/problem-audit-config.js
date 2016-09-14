import { ProblemMagnitudes, ProblemsStatuses } from '/imports/api/constants.js';
import { Standards } from '/imports/api/standards/standards.js';
import { getUserFullNameOrEmail, getPrettyOrgDate, getUserId } from '../utils/helpers.js';
import { ChangesKinds } from '../utils/changes-kinds.js';
import {
  departmentsIdsField,
  descriptionField,
  fileIdsField,
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
      notifications: [
        {
          shouldSendNotification({ diffs }) {
            const { kind } = diffs['analysis.executor'];
            return _([FIELD_ADDED, FIELD_CHANGED]).contains(kind);
          },
          text: '{{userName}} assigned you to do a root cause analysis of {{{docDesc}}}',
          title: 'You have been assigned to do a root cause analysis',
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
                label: 'View document',
                url: this.docUrl(newDoc)
              }
            };
          },
          receivers({ diffs, newDoc, user }) {
            const { newValue } = diffs['analysis.executor'];
            const userId = getUserId(user);
            return (newValue !== userId) ? [newValue]: [];
          }
        }
      ],
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
      notifications: [
        {
          shouldSendNotification({ diffs }) {
            const { kind } = diffs['updateOfStandards.executor'];
            return _([FIELD_ADDED, FIELD_CHANGED]).contains(kind);
          },
          text: '{{userName}} assigned you to do an update of standards related to {{{docDesc}}}',
          title: 'You have been assigned to do an update of standards',
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
                label: 'View document',
                url: this.docUrl(newDoc)
              }
            };
          },
          receivers({ diffs, newDoc, user }) {
            const { newValue } = diffs['updateOfStandards.executor'];
            const userId = getUserId(user);
            return (newValue !== userId) ? [newValue]: [];
          }
        }
      ],
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
    },

    {
      field: departmentsIdsField.field,
      logs: [
        departmentsIdsField.logConfig
      ],
      notifications: [],
      data: departmentsIdsField.data
    },

    {
      field: descriptionField.field,
      logs: [
        descriptionField.logConfig
      ],
      notifications: [],
      data: descriptionField.data
    },

    {
      field: fileIdsField.field,
      logs: [
        fileIdsField.logConfig
      ],
      notifications: [],
      data: fileIdsField.data
    },

    {
      field: IPDesiredOutcomeField.field,
      logs: [
        IPDesiredOutcomeField.logConfig
      ],
      notifications: [],
      data: IPDesiredOutcomeField.data
    },

    {
      field: IPFileIdsField.field,
      logs: [
        IPFileIdsField.logConfig
      ],
      notifications: [],
      data: IPFileIdsField.data
    },

    {
      field: IPOwnerField.field,
      logs: [
        IPOwnerField.logConfig
      ],
      notifications: [],
      data: IPOwnerField.data
    },

    {
      field: IPReviewDatesField.field,
      logs: [
        IPReviewDatesField.logConfig
      ],
      notifications: [],
      data: IPReviewDatesField.data
    },

    {
      field: IPReviewDateField.field,
      logs: [
        IPReviewDateField.logConfig
      ],
      notifications: [],
      data: IPReviewDateField.data
    },

    {
      field: IPTargetDateField.field,
      logs: [
        IPTargetDateField.logConfig
      ],
      notifications: [],
      data: IPTargetDateField.data
    },

    {
      field: isDeletedField.field,
      logs: [
        isDeletedField.logConfig
      ],
      notifications: [],
      data: isDeletedField.data
    },

    {
      field: notifyField.field,
      logs: [
        notifyField.logConfig
      ],
      notifications: [
        notifyField.personalNotificationConfig
      ],
      data: notifyField.data,
    },

    {
      field: titleField.field,
      logs: [
        titleField.logConfig
      ],
      notifications: [],
      data: titleField.data
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
