import { NonConformities } from '/imports/api/non-conformities/non-conformities.js';
import { CollectionNames } from '/imports/api/constants.js';
import { ChangesKinds } from '../utils/changes-kinds.js';
import problemUpdateHandlers from './problem-update-handlers.js';


const {
  FIELD_ADDED, FIELD_CHANGED, FIELD_REMOVED,
  ITEM_ADDED, ITEM_REMOVED
} = ChangesKinds;

export default NCAuditConfig = {

  collection: NonConformities,

  collectionName: CollectionNames.NCS,

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
    ...problemUpdateHandlers,

    {
      field: 'cost',
      logs: [
        {
          template: {
            [FIELD_ADDED]:
              'Approx cost per occurrence set to "{{newValue}}"',
            [FIELD_CHANGED]:
              'Approx cost per occurrence changed from "{{oldValue}}" to "{{newValue}}"',
            [FIELD_REMOVED]:
              'Approx cost per occurrence removed'
          },
          templateData({ diffs: { cost: { newValue, oldValue } } }) {
            return { newValue, oldValue };
          }
        }
      ],
      notifications: []
    },

    {
      field: 'ref',
      logs: [
        {
          template: {
            [FIELD_ADDED]:
              'Help desk ref added: ID - {{text}}, URL: {{url}}',
            [FIELD_REMOVED]:
              'Help desk ref removed: ID - {{text}}, URL: {{url}}'
          },
          templateData({ diffs: { ref: { newValue, oldValue } } }) {
            const { text, url } = newValue || oldValue;
            return { text, url };
          }
        }
      ],
      notifications: []
    },

    {
      field: 'ref.text',
      logs: [
        {
          template: {
            [FIELD_CHANGED]:
              'Help desk ref ID changed from "{{oldValue}}" to "{{newValue}}"'
          },
          templateData({ diffs }) {
            const { newValue, oldValue } = diffs['ref.text'];
            return { newValue, oldValue };
          }
        }
      ],
      notifications: []
    },

    {
      field: 'ref.url',
      logs: [
        {
          template: {
            [FIELD_CHANGED]:
              'Help desk ref URL changed from "{{oldValue}}" to "{{newValue}}"'
          },
          templateData({ diffs }) {
            const { newValue, oldValue } = diffs['ref.url'];
            return { newValue, oldValue };
          }
        }
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
  },

  docUrl({ _id, organizationId }) {
    const { serialNumber } = Organizations.findOne({ _id: organizationId });

    return Meteor.absoluteUrl(`${serialNumber}/non-conformities/${_id}`);
  }

};
