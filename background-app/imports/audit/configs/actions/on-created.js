import { getCollectionByDocType } from '/imports/share/helpers.js';
import { getUserFullNameOrEmail, getPrettyOrgDate, getUserId } from '../../utils/helpers.js';


export default {
  logs: [
    {
      message: 'Document created',
    },
    {
      message: '{{{docDesc}}} was linked to this document',
      data({ newDoc }) {
        const auditConfig = this;

        return _(newDoc.linkedTo.length).times(() => {
          return { docDesc: () => auditConfig.docDescription(newDoc) };
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
      text: '{{userName}} created action {{{docDesc}}} for {{{linkedDocDesc}}}',
      data({ newDoc, user }) {
        const auditConfig = this;
        const docDesc = auditConfig.docDescription(newDoc);
        const userName = getUserFullNameOrEmail(user);

        return _(newDoc.linkedTo).map(({ documentId, documentType }) => {
          const auditConfig = getLinkedDocAuditConfig(documentType);

          return {
            linkedDocDesc: getLinkedDocName(documentId, documentType),
            docDesc,
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
  ]
};
