import { Standards } from '/imports/api/standards/standards.js';
import { StandardsBookSections } from '/imports/api/standards-book-sections/standards-book-sections.js';
import { StandardTypes } from '/imports/api/standards-types/standards-types.js';
import { CollectionNames, StandardStatuses } from '/imports/api/constants.js';
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
      notifications: []
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
      notifications: []
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
          templateData({ diffs: { status: { newValue, oldValue } } }) {
            return {
              newValue: StandardStatuses[newValue],
              oldValue: StandardStatuses[oldValue]
            };
          }
        }
      ],
      notifications: []
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
