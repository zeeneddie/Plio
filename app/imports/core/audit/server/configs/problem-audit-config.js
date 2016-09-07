import { ProblemMagnitudes, ProblemsStatuses, SystemName } from '/imports/api/constants.js';
import { Standards } from '/imports/api/standards/standards.js';
import { getUserFullNameOrEmail, getPrettyOrgDate } from '/imports/api/helpers.js';
import { ChangesKinds } from '../utils/changes-kinds.js';
import {
  departmentsIdsField,
  descriptionField,
  IPDesiredOutcomeField,
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
        template: 'Document created',
        templateData() { }
      },
      {
        template: '{{{docDesc}}} was linked to this document',
        templateData({ newDoc }) {
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
    notifications: []
  },

  updateHandlers: [
    {
      field: 'analysis.completedAt',
      logs: [
        {
          shouldCreateLog({ diffs }) {
            return !diffs['analysis.status'];
          },
          template: {
            [FIELD_ADDED]:
              'Root cause analysis date set to "{{newValue}}"',
            [FIELD_CHANGED]:
              'Root cause analysis date changed from "{{oldValue}}" to "{{newValue}}"',
            [FIELD_REMOVED]:
              'Root cause analysis date removed'
          },
          templateData({ diffs, newDoc }) {
            const { newValue, oldValue } = diffs['analysis.completedAt'];
            const orgId = this.docOrgId(newDoc);

            return {
              newValue: getPrettyOrgDate(newValue, orgId),
              oldValue: getPrettyOrgDate(oldValue, orgId)
            };
          }
        }
      ],
      notifications: []
    },

    {
      field: 'analysis.completedBy',
      logs: [
        {
          shouldCreateLog({ diffs }) {
            return !diffs['analysis.status'];
          },
          template: {
            [FIELD_ADDED]:
              'Root cause analysis executor set to {{newValue}}',
            [FIELD_CHANGED]:
              'Root cause analysis executor changed from {{oldValue}} to {{newValue}}',
            [FIELD_REMOVED]:
              'Root cause analysis executor removed'
          },
          templateData({ diffs }) {
            const { newValue, oldValue } = diffs['analysis.completedBy'];

            return {
              newValue: getUserFullNameOrEmail(newValue),
              oldValue: getUserFullNameOrEmail(oldValue)
            };
          }
        }
      ],
      notifications: []
    },

    {
      field: 'analysis.completionComments',
      logs: [
        {
          shouldCreateLog({ diffs }) {
            return !diffs['analysis.status'];
          },
          template: {
            [FIELD_ADDED]: 'Root cause analysis completion comments set',
            [FIELD_CHANGED]: 'Root cause analysis completion comments changed',
            [FIELD_REMOVED]: 'Root cause analysis completion comments removed'
          },
          templateData() { }
        }
      ],
      notifications: []
    },

    {
      field: 'analysis.executor',
      logs: [
        {
          template: {
            [FIELD_ADDED]:
              'Root cause analysis executor set to {{newValue}}',
            [FIELD_CHANGED]:
              'Root cause analysis executor changed from {{oldValue}} to {{newValue}}',
            [FIELD_REMOVED]:
              'Root cause analysis executor removed'
          },
          templateData({ diffs }) {
            const { newValue, oldValue } = diffs['analysis.executor'];

            return {
              newValue: getUserFullNameOrEmail(newValue),
              oldValue: getUserFullNameOrEmail(oldValue)
            };
          }
        }
      ],
      notifications: [
        {
          shouldSendNotification({ diffs }) {
            const { kind } = diffs['analysis.executor'];
            return _([FIELD_ADDED, FIELD_CHANGED]).contains(kind);
          },
          template:
            '{{userName}} assigned you to do a root cause analysis of {{{docDesc}}}',
          templateData({ newDoc, user }) {
            return {
              docDesc: this.docDescription(newDoc),
              userName: getUserFullNameOrEmail(user)
            };
          },
          subjectTemplate: 'You have been assigned to do a root cause analysis',
          subjectTemplateData() { },
          notificationData({ newDoc }) {
            return {
              templateData: {
                button: {
                  label: 'View document',
                  url: this.docUrl(newDoc)
                }
              }
            };
          },
          receivers({ diffs, newDoc, user }) {
            const { newValue } = diffs['analysis.executor'];
            const userId = (user === SystemName) ? user : user._id;
            return (newValue !== userId) ? [newValue]: [];
          }
        }
      ]
    },

    {
      field: 'analysis.status',
      logs: [
        {
          shouldCreateLog({ diffs }) {
            return diffs['analysis.completedAt'] && diffs['analysis.completedBy'];
          },
          template: {
            [FIELD_CHANGED]:
              '{{#if completed}}' +
                'Root cause analysis completed{{#if comments}}: {{comments}}{{/if}}' +
              '{{else}}' +
                'Root cause analysis canceled' +
              '{{/if}}'
          },
          templateData({ diffs }) {
            const { newValue:status } = diffs['analysis.status'];
            const { newValue:comments } = diffs['analysis.completionComments'] || {};

            return {
              completed: status === 1, // Completed
              comments
            };
          }
        }
      ],
      notifications: []
    },

    {
      field: 'analysis.targetDate',
      logs: [
        {
          template: {
            [FIELD_ADDED]:
              'Root cause analysis target date set to "{{newValue}}"',
            [FIELD_CHANGED]:
              'Root cause analysis target date changed from "{{oldValue}}" to "{{newValue}}"',
            [FIELD_REMOVED]:
              'Root cause analysis target date removed'
          },
          templateData({ diffs, newDoc }) {
            const { newValue, oldValue } = diffs['analysis.targetDate'];
            const orgId = this.docOrgId(newDoc);

            return {
              newValue: getPrettyOrgDate(newValue, orgId),
              oldValue: getPrettyOrgDate(oldValue, orgId)
            };
          }
        }
      ],
      notifications: []
    },

    {
      field: 'identifiedAt',
      logs: [
        {
          template: {
            [FIELD_ADDED]:
              'Identified at set to "{{newValue}}"',
            [FIELD_CHANGED]:
              'Identified at changed from "{{oldValue}}" to "{{newValue}}"',
            [FIELD_REMOVED]:
              'Identified at removed'
          },
          templateData({ diffs: { identifiedAt }, newDoc }) {
            const orgId = this.docOrgId(newDoc);

            return {
              newValue: getPrettyOrgDate(identifiedAt.newValue, orgId),
              oldValue: getPrettyOrgDate(identifiedAt.oldValue, orgId)
            };
          }
        }
      ],
      notifications: []
    },

    {
      field: 'identifiedBy',
      logs: [
        {
          template: {
            [FIELD_ADDED]:
              'Identified by set to {{newValue}}',
            [FIELD_CHANGED]:
              'Identified by changed from {{oldValue}} to {{newValue}}',
            [FIELD_REMOVED]:
              'Identified by removed'
          },
          templateData({ diffs: { identifiedBy }, newDoc }) {
            return {
              newValue: getUserFullNameOrEmail(identifiedBy.newValue),
              oldValue: getUserFullNameOrEmail(identifiedBy.oldValue)
            };
          }
        }
      ],
      notifications: []
    },

    {
      field: 'magnitude',
      logs: [
        {
          template: {
            [FIELD_ADDED]:
              'Magnitude set to "{{newValue}}"',
            [FIELD_CHANGED]:
              'Magnitude changed from "{{oldValue}}" to "{{newValue}}"',
            [FIELD_REMOVED]:
              'Magnitude removed'
          },
          templateData({ diffs: { magnitude: { newValue, oldValue } } }) {
            return { newValue, oldValue };
          }
        }
      ],
      notifications: []
    },

    {
      field: 'standardsIds',
      logs: [
        {
          template: {
            [ITEM_ADDED]: 'Document was linked to {{{standardDesc}}}',
            [ITEM_REMOVED]: 'Document was unlinked from {{{standardDesc}}}'
          },
          templateData({ diffs: { standardsIds } }) {
            const { item:standardId } = standardsIds;
            const standard = Standards.findOne({ _id: standardId });

            return {
              standardDesc: StandardAuditConfig.docDescription(standard)
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
          logData({ diffs: { standardsIds } }) {
            const { item:standardId } = standardsIds;

            return {
              collection: StandardAuditConfig.collectionName,
              documentId: standardId
            };
          }
        }
      ],
      notifications: []
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
              newValue: ProblemsStatuses[status.newValue],
              oldValue: ProblemsStatuses[status.oldValue]
            };
          }
        }
      ],
      notifications: [
        {
          shouldSendNotification({ diffs: { status: { newValue } } }) {
            return (newValue === 18) || (newValue === 19);
          },
          template:
            'Status of {{{docDesc}}} was changed to "{{newValue}}"',
          templateData({ diffs: { status }, newDoc }) {
            return {
              docDesc: this.docDescription(newDoc),
              newValue: ProblemsStatuses[status.newValue]
            };
          },
          subjectTemplate: '{{{docDesc}}} closed',
          subjectTemplateData({ newDoc }) {
            return { docDesc: this.docDescription(newDoc) };
          },
          notificationData({ newDoc }) {
            return {
              templateData: {
                button: {
                  label: 'View document',
                  url: this.docUrl(newDoc)
                }
              }
            };
          },
          receivers({ newDoc }) {
            return [newDoc.identifiedBy];
          }
        }
      ]
    },

    {
      field: 'updateOfStandards.completedAt',
      logs: [
        {
          shouldCreateLog({ diffs }) {
            return !diffs['updateOfStandards.status'];
          },
          template: {
            [FIELD_ADDED]:
              'Update of standards date set to "{{newValue}}"',
            [FIELD_CHANGED]:
              'Update of standards date changed from "{{oldValue}}" to "{{newValue}}"',
            [FIELD_REMOVED]:
              'Update of standards date removed'
          },
          templateData({ diffs, newDoc }) {
            const { newValue, oldValue } = diffs['updateOfStandards.completedAt'];
            const orgId = this.docOrgId(newDoc);

            return {
              newValue: getPrettyOrgDate(newValue, orgId),
              oldValue: getPrettyOrgDate(oldValue, orgId)
            };
          }
        }
      ],
      notifications: []
    },

    {
      field: 'updateOfStandards.completedBy',
      logs: [
        {
          shouldCreateLog({ diffs }) {
            return !diffs['updateOfStandards.status'];
          },
          template: {
            [FIELD_ADDED]:
              'Update of standards executor set to {{newValue}}',
            [FIELD_CHANGED]:
              'Update of standards executor changed from {{oldValue}} to {{newValue}}',
            [FIELD_REMOVED]:
              'Update of standards executor removed'
          },
          templateData({ diffs }) {
            const { newValue, oldValue } = diff['updateOfStandards.completedBy'];

            return {
              newValue: getUserFullNameOrEmail(newValue),
              oldValue: getUserFullNameOrEmail(oldValue)
            };
          }
        }
      ],
      notifications: []
    },

    {
      field: 'updateOfStandards.completionComments',
      logs: [
        {
          shouldCreateLog({ diffs }) {
            return !diffs['updateOfStandards.status'];
          },
          template: {
            [FIELD_ADDED]: 'Update of standards completion comments set',
            [FIELD_CHANGED]: 'Update of standards completion comments changed',
            [FIELD_REMOVED]: 'Update of standards completion comments removed'
          },
          templateData() { }
        }
      ],
      notifications: []
    },

    {
      field: 'updateOfStandards.executor',
      logs: [
        {
          template: {
            [FIELD_ADDED]:
              'Update of standards executor set to {{newValue}}',
            [FIELD_CHANGED]:
              'Update of standards executor changed from {{oldValue}} to {{newValue}}',
            [FIELD_REMOVED]:
              'Update of standards executor removed'
          },
          templateData({ diffs }) {
            const { newValue, oldValue } = diffs['updateOfStandards.executor'];

            return {
              newValue: getUserFullNameOrEmail(newValue),
              oldValue: getUserFullNameOrEmail(oldValue)
            };
          }
        }
      ],
      notifications: [
        {
          shouldSendNotification({ diffs }) {
            const { kind } = diffs['updateOfStandards.executor'];
            return _([FIELD_ADDED, FIELD_CHANGED]).contains(kind);
          },
          template:
            '{{userName}} assigned you to do an update of standards related to {{{docDesc}}}',
          templateData({ newDoc, user }) {
            return {
              docDesc: this.docDescription(newDoc),
              userName: getUserFullNameOrEmail(user)
            };
          },
          subjectTemplate: 'You have been assigned to do an update of standards',
          subjectTemplateData() { },
          notificationData({ newDoc }) {
            return {
              templateData: {
                button: {
                  label: 'View document',
                  url: this.docUrl(newDoc)
                }
              }
            };
          },
          receivers({ diffs, newDoc, user }) {
            const { newValue } = diffs['updateOfStandards.executor'];
            const userId = (user === SystemName) ? user : user._id;
            return (newValue !== userId) ? [newValue]: [];
          }
        }
      ]
    },

    {
      field: 'updateOfStandards.status',
      logs: [
        {
          shouldCreateLog({ diffs }) {
            return diffs['updateOfStandards.completedAt']
                && diffs['updateOfStandards.completedBy'];
          },
          template: {
            [FIELD_CHANGED]:
              '{{#if completed}}' +
                'Update of standards completed{{#if comments}}: {{comments}}{{/if}}' +
              '{{else}}' +
                'Update of standards canceled' +
              '{{/if}}'
          },
          templateData({ diffs }) {
            const { newValue:status } = diffs['updateOfStandards.status'];
            const { newValue:comments } = diffs['updateOfStandards.completionComments'] || {};

            return {
              completed: status === 1, // Completed
              comments
            };
          }
        }
      ],
      notifications: []
    },

    {
      field: 'updateOfStandards.targetDate',
      logs: [
        {
          template: {
            [FIELD_ADDED]:
              'Update of standards target date set to "{{newValue}}"',
            [FIELD_CHANGED]:
              'Update of standards target date changed from "{{oldValue}}" to "{{newValue}}"',
            [FIELD_REMOVED]:
              'Update of standards target date removed'
          },
          templateData({ diffs, newDoc }) {
            const { newValue, oldValue } = diffs['updateOfStandards.targetDate'];
            const orgId = this.docOrgId(newDoc);

            return {
              newValue: getPrettyOrgDate(newValue, orgId),
              oldValue: getPrettyOrgDate(oldValue, orgId)
            };
          }
        }
      ],
      notifications: []
    },

    {
      field: 'departmentsIds',
      logs: [
        departmentsIdsField.logConfig
      ],
      notifications: []
    },

    {
      field: 'description',
      logs: [
        descriptionField.logConfig
      ],
      notifications: []
    },

    {
      field: 'improvementPlan.desiredOutcome',
      logs: [
        IPDesiredOutcomeField.logConfig
      ],
      notifications: []
    },

    {
      field: 'improvementPlan.owner',
      logs: [
        IPOwnerField.logConfig
      ],
      notifications: []
    },

    {
      field: 'improvementPlan.reviewDates',
      logs: [
        IPReviewDatesField.logConfig
      ],
      notifications: []
    },

    {
      field: 'improvementPlan.reviewDates.$.date',
      logs: [
        IPReviewDateField.logConfig
      ],
      notifications: []
    },

    {
      field: 'improvementPlan.targetDate',
      logs: [
        IPTargetDateField.logConfig
      ],
      notifications: []
    },

    {
      field: 'isDeleted',
      logs: [
        isDeletedField.logConfig
      ],
      notifications: []
    },

    {
      field: 'notify',
      logs: [
        notifyField.logConfig
      ],
      notifications: []
    },

    {
      field: 'title',
      logs: [
        titleField.logConfig
      ],
      notifications: []
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
  }

};
