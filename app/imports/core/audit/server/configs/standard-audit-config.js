import { Standards } from '/imports/api/standards/standards.js';
import { StandardsBookSections } from '/imports/api/standards-book-sections/standards-book-sections.js';
import { StandardTypes } from '/imports/api/standards-types/standards-types.js';
import { Files } from '/imports/api/files/files.js';
import { CollectionNames, StandardStatuses, SystemName } from '/imports/api/constants.js';
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


const {
  FIELD_ADDED, FIELD_CHANGED, FIELD_REMOVED,
  ITEM_ADDED, ITEM_REMOVED
} = ChangesKinds;

const getReceivers = function({ newDoc, user }) {
  const { owner } = newDoc;
  const userId = (user === SystemName) ? user : user._id;

  return (owner !== userId) ? [owner]: [];
};

export default StandardAuditConfig = {

  collection: Standards,

  collectionName: CollectionNames.STANDARDS,

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
      field: 'issueNumber',
      logs: [
        {
          template: {
            [FIELD_ADDED]: 'Issue number set to "{{newValue}}"',
            [FIELD_CHANGED]: 'Issue number changed from "{{oldValue}}" to "{{newValue}}"',
            [FIELD_REMOVED]: 'Issue number removed'
          },
          templateData({ diffs: { issueNumber: { newValue, oldValue } } }) {
            return { newValue, oldValue };
          }
        }
      ],
      notifications: [
        {
          template: {
            [FIELD_ADDED]:
              '{{userName}} set issue number of {{{docDesc}}} to "{{newValue}}"',
            [FIELD_CHANGED]:
              '{{userName}} changed issue number of {{{docDesc}}} from "{{oldValue}}" to "{{newValue}}"',
            [FIELD_REMOVED]:
              '{{userName}} removed issue number of {{{docDesc}}}'
          },
          templateData({ diffs: { issueNumber }, newDoc, user }) {
            return {
              docDesc: this.docDescription(newDoc),
              userName: getUserFullNameOrEmail(user),
              newValue: issueNumber.newValue,
              oldValue: issueNumber.oldValue
            };
          },
          receivers: getReceivers
        }
      ]
    },

    {
      field: 'owner',
      logs: [
        {
          template: {
            [FIELD_ADDED]: 'Owner set to {{newValue}}',
            [FIELD_CHANGED]: 'Owner changed from {{oldValue}} to {{newValue}}',
            [FIELD_REMOVED]: 'Owner removed'
          },
          templateData({ diffs: { owner } }) {
            return {
              newValue: getUserFullNameOrEmail(owner.newValue),
              oldValue: getUserFullNameOrEmail(owner.oldValue)
            };
          }
        }
      ],
      notifications: [
        {
          template: {
            [FIELD_ADDED]:
              '{{userName}} set owner of {{{docDesc}}} to {{newValue}}',
            [FIELD_CHANGED]:
              '{{userName}} changed owner of {{{docDesc}}} from {{oldValue}} to {{newValue}}',
            [FIELD_REMOVED]:
              '{{userName}} removed owner of {{{docDesc}}}'
          },
          templateData({ diffs: { owner }, newDoc, user }) {
            return {
              docDesc: this.docDescription(newDoc),
              userName: getUserFullNameOrEmail(user),
              newValue: getUserFullNameOrEmail(owner.newValue),
              oldValue: getUserFullNameOrEmail(owner.oldValue)
            };
          },
          receivers: getReceivers
        }
      ]
    },

    {
      field: 'sectionId',
      logs: [
        {
          template: {
            [FIELD_ADDED]:
              'Book section set to "{{newValue}}"',
            [FIELD_CHANGED]:
              'Book section changed from "{{oldValue}}" to "{{newValue}}"',
            [FIELD_REMOVED]:
              'Book section removed'
          },
          templateData({ diffs: { sectionId: { newValue, oldValue } } }) {
            const { title:newSection } = StandardsBookSections.findOne({
              _id: newValue
            });
            const { title:oldSection } = StandardsBookSections.findOne({
              _id: oldValue
            });

            return {
              newValue: newSection,
              oldValue: oldSection
            };
          }
        }
      ],
      notifications: [
        {
          template: {
            [FIELD_ADDED]:
              '{{userName}} set book section of {{{docDesc}}} to "{{newValue}}"',
            [FIELD_CHANGED]:
              '{{userName}} changed book section of {{{docDesc}}} from "{{oldValue}}" to "{{newValue}}"',
            [FIELD_REMOVED]:
              '{{userName}} removed book section of {{{docDesc}}}'
          },
          templateData({ diffs: { sectionId }, newDoc, user }) {
            const { title:newSection } = StandardsBookSections.findOne({
              _id: sectionId.newValue
            });
            const { title:oldSection } = StandardsBookSections.findOne({
              _id: sectionId.oldValue
            });

            return {
              docDesc: this.docDescription(newDoc),
              userName: getUserFullNameOrEmail(user),
              newValue: newSection,
              oldValue: oldSection
            };
          },
          receivers: getReceivers
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
          templateData({ diffs: { status: { newValue, oldValue } } }) {
            return {
              newValue: StandardStatuses[newValue],
              oldValue: StandardStatuses[oldValue]
            };
          }
        }
      ],
      notifications: [
        {
          template: {
            [FIELD_ADDED]:
              '{{userName}} set status of {{{docDesc}}} to "{{newValue}}"',
            [FIELD_CHANGED]:
              '{{userName}} changed status of {{{docDesc}}} from "{{oldValue}}" to "{{newValue}}"',
            [FIELD_REMOVED]:
              '{{userName}} removed status of {{{docDesc}}}'
          },
          templateData({ diffs: { status }, newDoc, user }) {
            return {
              docDesc: this.docDescription(newDoc),
              userName: getUserFullNameOrEmail(user),
              newValue: StandardStatuses[status.newValue],
              oldValue: StandardStatuses[status.oldValue]
            };
          },
          receivers: getReceivers
        }
      ]
    },

    {
      field: 'typeId',
      logs: [
        {
          template: {
            [FIELD_ADDED]: 'Type set to "{{newValue}}"',
            [FIELD_CHANGED]: 'Type changed from "{{oldValue}}" to "{{newValue}}"',
            [FIELD_REMOVED]: 'Type removed'
          },
          templateData({ diffs: { typeId: { newValue, oldValue } } }) {
            const { name:newType } = StandardTypes.findOne({ _id: newValue });
            const { name:oldType } = StandardTypes.findOne({ _id: oldValue });

            return {
              newValue: newType,
              oldValue: oldType
            };
          }
        }
      ],
      notifications: [
        {
          template: {
            [FIELD_ADDED]:
              '{{userName}} set type of {{{docDesc}}} to "{{newValue}}"',
            [FIELD_CHANGED]:
              '{{userName}} changed type of {{{docDesc}}} from "{{oldValue}}" to "{{newValue}}"',
            [FIELD_REMOVED]:
              '{{userName}} removed type of {{{docDesc}}}'
          },
          templateData({ diffs: { typeId }, newDoc, user }) {
            const { name:newType } = StandardTypes.findOne({
              _id: typeId.newValue
            });
            const { name:oldType } = StandardTypes.findOne({
              _id: typeId.oldValue
            });

            return {
              docDesc: this.docDescription(newDoc),
              userName: getUserFullNameOrEmail(user),
              newValue: newType,
              oldValue: oldType
            };
          },
          receivers: getReceivers
        }
      ]
    },

    {
      field: 'improvementPlan.desiredOutcome',
      logs: [
        IPDesiredOutcomeField.logConfig
      ],
      notifications: [
        _({}).extend(IPDesiredOutcomeField.notificationConfig, {
          receivers: getReceivers
        })
      ]
    },

    {
      field: 'improvementPlan.owner',
      logs: [
        IPOwnerField.logConfig
      ],
      notifications: [
        _({}).extend(IPOwnerField.notificationConfig, {
          receivers: getReceivers
        })
      ]
    },

    {
      field: 'improvementPlan.reviewDates',
      logs: [
        IPReviewDatesField.logConfig
      ],
      notifications: [
        _({}).extend(IPReviewDatesField.notificationConfig, {
          receivers: getReceivers
        })
      ]
    },

    {
      field: 'improvementPlan.reviewDates.$.date',
      logs: [
        IPReviewDateField.logConfig
      ],
      notifications: [
        _({}).extend(IPReviewDateField.notificationConfig, {
          receivers: getReceivers
        })
      ]
    },

    {
      field: 'improvementPlan.targetDate',
      logs: [
        IPTargetDateField.logConfig
      ],
      notifications: [
        _({}).extend(IPTargetDateField.notificationConfig, {
          receivers: getReceivers
        })
      ]
    },

    {
      field: 'departmentsIds',
      logs: [
        departmentsIdsField.logConfig
      ],
      notifications: [
        _({}).extend(departmentsIdsField.notificationConfig, {
          receivers: getReceivers
        })
      ]
    },

    {
      field: 'description',
      logs: [
        descriptionField.logConfig
      ],
      notifications: [
        _({}).extend(descriptionField.notificationConfig, {
          receivers: getReceivers
        })
      ]
    },

    {
      field: 'isDeleted',
      logs: [
        isDeletedField.logConfig
      ],
      notifications: [
        _({}).extend(isDeletedField.notificationConfig, {
          receivers: getReceivers
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
          receivers: getReceivers
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
          receivers: getReceivers
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
