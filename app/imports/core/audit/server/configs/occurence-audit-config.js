import { getPrettyOrgDate } from '/imports/api/helpers.js';
import { CollectionNames } from '/imports/api/constants.js';
import { Organizations } from '/imports/api/organizations/organizations.js';
import { NonConformities } from '/imports/api/non-conformities/non-conformities.js';
import { Occurrences } from '/imports/api/occurrences/occurrences.js';
import { ChangesKinds } from '../utils/changes-kinds.js';
import NCAuditConfig from './nc-audit-config.js';


const {
  FIELD_ADDED, FIELD_CHANGED, FIELD_REMOVED,
  ITEM_ADDED, ITEM_REMOVED
} = ChangesKinds;

export default OccurenceAuditConfig = {

  collection: Occurrences,

  collectionName: CollectionNames.OCCURRENCES,

  onCreated: {
    logs: [
      {
        message: 'Occurence added: date - {{date}}',
        logData({ newDoc: { nonConformityId } }) {
          return {
            collection: NCAuditConfig.collectionName,
            documentId: nonConformityId
          };
        }
      }
    ],
    notifications: [],
    data({ newDoc }) {
      const auditConfig = this;
      const orgId = () => auditConfig.docOrgId(newDoc);

      return { date: () => getPrettyOrgDate(newDoc.date, orgId()) };
    }
  },

  updateHandlers: [
    {
      field: 'date',
      logs: [
        {
          message: {
            [FIELD_ADDED]:
              'Occurrence date set to "{{newValue}}"',
            [FIELD_CHANGED]:
              'Occurrence date changed from "{{oldValue}}" to "{{newValue}}"',
            [FIELD_REMOVED]:
              'Occurrence date removed'
          },
          logData({ newDoc: { nonConformityId } }) {
            return {
              collection: NCAuditConfig.collectionName,
              documentId: nonConformityId
            };
          }
        }
      ],
      notifications: [],
      data({ diffs: { date }, newDoc }) {
        const auditConfig = this;
        const { newValue, oldValue } = date;
        const orgId = () => auditConfig.docOrgId(newDoc);

        return {
          newValue: () => getPrettyOrgDate(newValue, orgId()),
          oldValue: () => getPrettyOrgDate(oldValue, orgId())
        };
      }
    },

    {
      field: 'description',
      logs: [
        {
          message: {
            [FIELD_ADDED]: 'Occurrence description set',
            [FIELD_CHANGED]: 'Occurrence description changed',
            [FIELD_REMOVED]: 'Occurrence description removed'
          },
          logData({ newDoc: { nonConformityId } }) {
            return {
              collection: NCAuditConfig.collectionName,
              documentId: nonConformityId
            };
          }
        }
      ],
      notifications: []
    }
  ],

  onRemoved: {
    logs: [
      {
        message: 'Occurence removed: date - {{date}}',
        logData({ oldDoc: { nonConformityId } }) {
          return {
            collection: NCAuditConfig.collectionName,
            documentId: nonConformityId
          };
        }
      }
    ],
    notifications: [],
    data({ oldDoc }) {
      const auditConfig = this;
      const orgId = () => auditConfig.docOrgId(oldDoc);

      return { date: () => getPrettyOrgDate(oldDoc.date, orgId()) };
    }
  },

  docId({ _id }) {
    return _id;
  },

  docDescription({ sequentialId }) {
    return sequentialId;
  },

  docOrgId({ nonConformityId }) {
    const { organizationId } = NonConformities.findOne({ _id: nonConformityId });
    return organizationId;
  },

  docUrl({ nonConformityId }) {
    const { organizationId } = NonConformities.findOne({ _id: nonConformityId });
    const { serialNumber } = Organizations.findOne({ _id: organizationId });

    return Meteor.absoluteUrl(`${serialNumber}/non-conformities/${nonConformityId}`);
  }

};
