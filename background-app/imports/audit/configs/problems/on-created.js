import { Standards } from '/imports/share/collections/standards.js';
import { getUserFullNameOrEmail, getUserId } from '../../utils/helpers.js';
import StandardAuditConfig from '../standards/standard-audit-config.js';


export default {
  logs: [
    {
      message: 'problems.on-created.doc-log',
    },
    {
      message: 'problems.on-created.linked-standard-log',
      data({ newDoc }) {
        return _(newDoc.standardsIds.length).times(() => {
          return { docName: this.docName(newDoc) };
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
      text: 'problems.on-created.linked-standard-notification.text',
      data({ newDoc, user }) {
        const auditConfig = this;
        const docDesc = auditConfig.docDescription(newDoc);
        const docName = auditConfig.docName(newDoc);
        const userName = getUserFullNameOrEmail(user);

        const standards = Standards.find({ _id: { $in: newDoc.standardsIds } });

        return standards.map((standard) => {
          return {
            standardDesc: StandardAuditConfig.docDescription(standard),
            standardName: StandardAuditConfig.docName(standard),
            docDesc,
            docName,
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
  ],
  triggers: [
    function({ newDoc: { _id } }) {
      new this.workflowConstructor(_id).refreshStatus();
    }
  ]
};
