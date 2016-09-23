import { getCollectionNameByDocType, getLinkedDoc } from '/imports/api/helpers.js';
import { CollectionNames } from '/imports/api/constants.js';
import { LessonsLearned } from '/imports/api/lessons/lessons.js';
import { ChangesKinds } from '../utils/changes-kinds.js';
import {
  getUserFullNameOrEmail,
  getPrettyOrgDate,
  getLinkedDocAuditConfig
} from '../utils/helpers.js';


const {
  FIELD_ADDED, FIELD_CHANGED, FIELD_REMOVED,
  ITEM_ADDED, ITEM_REMOVED
} = ChangesKinds;

const getLogData = function(args) {
  const { newDoc, oldDoc } = args;
  const { documentId, documentType } = newDoc || oldDoc;

  return {
    collection: getCollectionNameByDocType(documentType),
    documentId
  };
};

export default LessonAuditConfig = {

  collection: LessonsLearned,

  collectionName: CollectionNames.LESSONS,

  onCreated: {
    logs: [
      {
        message: '{{docDesc}} added: "{{title}}"',
        logData: getLogData
      }
    ],
    notifications: [],
    data({ newDoc }) {
      const auditConfig = this;

      return {
        docDesc: () => auditConfig.docDescription(newDoc),
        title: () => newDoc.title
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
              '{{docDesc}} created date set to "{{newValue}}"',
            [FIELD_CHANGED]:
              '{{docDesc}} created date changed from "{{oldValue}}" to "{{newValue}}"',
            [FIELD_REMOVED]:
              '{{docDesc}} created date removed'
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
      field: 'notes',
      logs: [
        {
          message: {
            [FIELD_ADDED]: '{{docDesc}} notes set',
            [FIELD_CHANGED]: '{{docDesc}} notes changed',
            [FIELD_REMOVED]: '{{docDesc}} notes removed'
          },
          logData: getLogData
        }
      ],
      notifications: [],
      data({ newDoc }) {
        const auditConfig = this;
        return { docDesc: () => auditConfig.docDescription(newDoc) };
      }
    },

    {
      field: 'owner',
      logs: [
        {
          message: {
            [FIELD_ADDED]:
              '{{docDesc}} owner set to {{newValue}}',
            [FIELD_CHANGED]:
              '{{docDesc}} owner changed from {{oldValue}} to {{newValue}}',
            [FIELD_REMOVED]:
              '{{docDesc}} owner removed'
          },
          logData: getLogData
        }
      ],
      notifications: [],
      data({ diffs: { owner }, newDoc }) {
        const auditConfig = this;
        const { newValue, oldValue } = owner;

        return {
          docDesc: () => auditConfig.docDescription(newDoc),
          newValue: () => getUserFullNameOrEmail(newValue),
          oldValue: () => getUserFullNameOrEmail(oldValue)
        };
      }
    },

    {
      field: 'title',
      logs: [
        {
          message: {
            [FIELD_ADDED]: '{{docDesc}} title set to "{{newValue}}"',
            [FIELD_CHANGED]: '{{docDesc}} title changed from "{{oldValue}}" to "{{newValue}}"',
            [FIELD_REMOVED]: '{{docDesc}} title removed'
          },
          logData: getLogData
        }
      ],
      notifications: [],
      data({ diffs: { title }, newDoc }) {
        const auditConfig = this;
        const { newValue, oldValue } = title;

        return {
          docDesc: () => auditConfig.docDescription(newDoc),
          newValue: () => newValue,
          oldValue: () => oldValue
        };
      }
    }
  ],

  onRemoved: {
    logs: [
      {
        message: '{{docDesc}} removed: "{{title}}"',
        logData: getLogData
      }
    ],
    notifications: [],
    data({ oldDoc }) {
      const auditConfig = this;

      return {
        docDesc: () => auditConfig.docDescription(oldDoc),
        title: () => oldDoc.title
      };
    }
  },

  docId({ _id }) {
    return _id;
  },

  docDescription({ serialNumber }) {
    return `LL${serialNumber}`;
  },

  docOrgId({ organizationId }) {
    return organizationId;
  },

  docUrl({ documentId, documentType }) {
    const linkedDocAuditConfig = getLinkedDocAuditConfig(documentType);
    const linkedDoc = getLinkedDoc(documentId, documentType);

    return linkedDocAuditConfig.docUrl(linkedDoc);
  }

};
