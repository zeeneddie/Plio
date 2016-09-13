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
          message: {
            [FIELD_ADDED]:
              'Approx cost per occurrence set to "{{newValue}}"',
            [FIELD_CHANGED]:
              'Approx cost per occurrence changed from "{{oldValue}}" to "{{newValue}}"',
            [FIELD_REMOVED]:
              'Approx cost per occurrence removed'
          }
        }
      ],
      notifications: [],
      data({ diffs: { cost: { newValue, oldValue } } }) {
        return {
          newValue: () => newValue,
          oldValue: () => oldValue
        };
      }
    },

    {
      field: 'ref',
      logs: [
        {
          message: {
            [FIELD_ADDED]:
              'Help desk ref added: ID - {{text}}, URL: {{url}}',
            [FIELD_REMOVED]:
              'Help desk ref removed: ID - {{text}}, URL: {{url}}'
          }
        }
      ],
      notifications: [],
      data({ diffs: { ref: { newValue, oldValue } } }) {
        const { text, url } = newValue || oldValue;

        return {
          text: () => text,
          url: () => url
        };
      }
    },

    {
      field: 'ref.text',
      logs: [
        {
          message: {
            [FIELD_CHANGED]:
              'Help desk ref ID changed from "{{oldValue}}" to "{{newValue}}"'
          }
        }
      ],
      notifications: [],
      data({ diffs }) {
        const { newValue, oldValue } = diffs['ref.text'];

        return {
          newValue: () => newValue,
          oldValue: () => oldValue
        };
      }
    },

    {
      field: 'ref.url',
      logs: [
        {
          message: {
            [FIELD_CHANGED]:
              'Help desk ref URL changed from "{{oldValue}}" to "{{newValue}}"'
          }
        }
      ],
      notifications: [],
      data({ diffs }) {
        const { newValue, oldValue } = diffs['ref.url'];

        return {
          newValue: () => newValue,
          oldValue: () => oldValue
        };
      }
    }
  ],

  docUrl({ _id, organizationId }) {
    const { serialNumber } = Organizations.findOne({ _id: organizationId });

    return Meteor.absoluteUrl(`${serialNumber}/non-conformities/${_id}`);
  }

});
