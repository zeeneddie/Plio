import { _ } from 'meteor/underscore';

import { Standards } from '/imports/share/collections/standards';
import { getCollectionByDocType } from '/imports/share/helpers';
import {
  getUserFullNameOrEmail,
  getPrettyOrgDate,
  getUserId
} from '../../utils/helpers';
import { getLinkedDocAuditConfig, getLinkedDocDescription, getLinkedDocName } from './helpers';
import ActionWorkflow from '/imports/workflow/ActionWorkflow';


export default {
  logs: [
    {
      message: 'actions.on-created.doc-log',
    },
    {
      message: 'actions.on-created.linked-doc-log',
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
            documentId,
          };
        });
      }
    }
  ],
  notifications: [
    {
      text: 'actions.on-created.linked-doc-notification.text',
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
  ],
};
