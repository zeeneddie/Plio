import { CollectionNames } from '/imports/api/constants.js';
import { Organizations } from '/imports/api/organizations/organizations.js';
import { NonConformities } from '/imports/api/non-conformities/non-conformities.js';
import { Occurrences } from '/imports/api/occurrences/occurrences.js';
import { ChangesKinds } from '../utils/changes-kinds.js';
import { getPrettyOrgDate } from '../utils/helpers.js';
import NCAuditConfig from './nc-audit-config.js';


const {
  FIELD_ADDED, FIELD_CHANGED, FIELD_REMOVED,
  ITEM_ADDED, ITEM_REMOVED
} = ChangesKinds;

const getLogData = function(args) {
  const { newDoc, oldDoc } = args;
  const { nonConformityId } = newDoc || oldDoc;

  return {
    collection: NCAuditConfig.collectionName,
    documentId: nonConformityId
  };
};

export default OccurenceAuditConfig = {

  collection: Occurrences,

  collectionName: CollectionNames.OCCURRENCES,

  onCreated: {
    logs: [
      {
        message: '{{{docDesc}}} added: date - {{{date}}}',
        logData: getLogData
      }
    ],
    notifications: [],
    data({ newDoc }) {
      const auditConfig = this;
      const orgId = () => auditConfig.docOrgId(newDoc);

      return {
        docDesc: () => auditConfig.docDescription(newDoc),
        date: () => getPrettyOrgDate(newDoc.date, orgId())
      };
    }
  },

  updateHandlers: [
    {
      field: 'date',
      logs: [
        {
          message: {
            [FIELD_ADDED]:
              '{{{docDesc}}} date set to "{{{newValue}}}"',
            [FIELD_CHANGED]:
              '{{{docDesc}}} date changed from "{{{oldValue}}}" to "{{{newValue}}}"',
            [FIELD_REMOVED]:
              '{{{docDesc}}} date removed'
          },
          logData: getLogData
        }
      ],
      notifications: [],
      data({ diffs: { date }, newDoc }) {
        const auditConfig = this;
        const { newValue, oldValue } = date;
        const orgId = () => auditConfig.docOrgId(newDoc);

        return {
          docDesc: () => auditConfig.docDescription(newDoc),
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
            [FIELD_ADDED]: '{{{docDesc}}} description set',
            [FIELD_CHANGED]: '{{{docDesc}}} description changed',
            [FIELD_REMOVED]: '{{{docDesc}}} description removed'
          },
          logData: getLogData
        }
      ],
      notifications: [],
      data({ newDoc }) {
        const auditConfig = this;
        return { docDesc: () => auditConfig.docDescription(newDoc), };
      }
    }
  ],

  onRemoved: {
    logs: [
      {
        message: '{{{docDesc}}} removed: date - {{{date}}}',
        logData: getLogData
      }
    ],
    notifications: [],
    data({ oldDoc }) {
      const auditConfig = this;
      const orgId = () => auditConfig.docOrgId(oldDoc);

      return {
        docDesc: () => auditConfig.docDescription(oldDoc),
        date: () => getPrettyOrgDate(oldDoc.date, orgId())
      };
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
    const NC = NonConformities.findOne({ _id: nonConformityId });

    return NCAuditConfig.docUrl(NC);
  }

};
