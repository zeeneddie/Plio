import { Standards } from '/imports/share/collections/standards.js';
import { getCollectionByDocType } from '/imports/share/helpers.js';
import {
  getUserFullNameOrEmail,
  getPrettyOrgDate,
  getUserId
} from '../../utils/helpers.js';
import { getLinkedDocAuditConfig, getLinkedDocDescription, getLinkedDocName } from './helpers.js';
import ActionWorkflow from '/imports/workflow/ActionWorkflow.js';


export default {
  logs: [
    {
      message: 'Document created',
    },
    {
      message: '{{{docName}}} was linked to this document',
      data({ newDoc }) {
        const auditConfig = this;

        return _(newDoc.linkedTo.length).times(() => {
          return { docName: () => auditConfig.docName(newDoc) };
        });
      },
      logData({ newDoc: { linkedTo } }) {
        return _(linkedTo).map(({ documentId, documentType }) => {
          const auditConfig = getLinkedDocAuditConfig(documentType);

          return {
            collection: auditConfig.collectionName,
            documentId
          };
        });
      }
    }
  ],
  notifications: [
    {
      text: '{{userName}} created {{{docDesc}}} {{{docName}}} for {{{linkedDocDesc}}} {{{linkedDocName}}}',
      data({ newDoc, user }) {
        const auditConfig = this;
        const docDesc = auditConfig.docDescription(newDoc);
        const docName = auditConfig.docName(newDoc);
        const userName = getUserFullNameOrEmail(user);

        return _(newDoc.linkedTo).map(({ documentId, documentType }) => {
          const auditConfig = getLinkedDocAuditConfig(documentType);

          return {
            linkedDocDesc: getLinkedDocDescription(documentId, documentType),
            linkedDocName: getLinkedDocName(documentId, documentType),
            docDesc,
            docName,
            userName
          };
        });
      },
      receivers({ newDoc, user }) {
        return _(newDoc.linkedTo).map(({ documentId, documentType }) => {
          const userId = getUserId(user);

          const collection = getCollectionByDocType(documentType);
          const { identifiedBy, standardsIds } = collection.findOne({
            _id: documentId
          }) || {};

          const receivers = new Set();
          Standards.find({ _id: { $in: standardsIds }  }).forEach(({ owner }) => {
            (owner !== userId) && receivers.add(owner);
          });

          (identifiedBy !== userId) && receivers.add(identifiedBy);

          return Array.from(receivers);
        });
      }
    }
  ],
  triggers: [
    function({ newDoc: { _id } }) {
      new ActionWorkflow(_id).refreshStatus();
    }
  ]
};
