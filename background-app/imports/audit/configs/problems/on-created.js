import { Standards } from '/imports/share/collections/standards.js';
import { getUserFullNameOrEmail, getUserId } from '../../utils/helpers.js';
import StandardAuditConfig from '../standards/standard-audit-config.js';


export default {
  logs: [
    {
      message: 'Document created',
    },
    {
      message: '{{{docDesc}}} was linked to this document',
      data({ newDoc }) {
        return _(newDoc.standardsIds.length).times(() => {
          return { docDesc: this.docDescription(newDoc) };
        });
      },
      logData({ newDoc: { standardsIds } }) {
        return _(standardsIds).map((standardId) => {
          return {
            collection: StandardAuditConfig.collectionName,
            documentId: standardId
          };
        });
      }
    }
  ],
  notifications: [
    {
      text: '{{userName}} created {{{docDesc}}} for {{{standardDesc}}}',
      data({ newDoc, user }) {
        const auditConfig = this;
        const docDesc = auditConfig.docDescription(newDoc);
        const userName = getUserFullNameOrEmail(user);

        const standards = Standards.find({ _id: { $in: newDoc.standardsIds } });

        return standards.map((standard) => {
          return {
            standardDesc: StandardAuditConfig.docDescription(standard),
            docDesc,
            userName
          };
        });
      },
      receivers({ newDoc, user }) {
        const userId = getUserId(user);
        const standards = Standards.find({ _id: { $in: newDoc.standardsIds } });

        return standards.map(({ owner }) => {
          return (owner !== userId) ? [owner] : [];
        });
      }
    }
  ]
};
