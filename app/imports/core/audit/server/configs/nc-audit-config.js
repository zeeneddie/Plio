import { NonConformities } from '/imports/api/non-conformities/non-conformities.js';
import { CollectionNames } from '/imports/api/constants.js';
import { ChangesKinds } from '../utils/changes-kinds.js';
import ProblemAuditConfig from './problem-audit-config.js';


const {
  FIELD_ADDED, FIELD_CHANGED, FIELD_REMOVED,
  ITEM_ADDED, ITEM_REMOVED
} = ChangesKinds;

export default NCAuditConfig = _.extend({}, ProblemAuditConfig, {

  collection: NonConformities,

  collectionName: CollectionNames.NCS,

  updateHandlers: [
    ...ProblemAuditConfig.updateHandlers,

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

  docUrl({ _id, organizationId }) {
    const { serialNumber } = Organizations.findOne({ _id: organizationId });

    return Meteor.absoluteUrl(`${serialNumber}/non-conformities/${_id}`);
  }

});
