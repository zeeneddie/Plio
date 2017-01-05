import { _ } from 'meteor/underscore';

import { Standards } from '/imports/share/collections/standards';
import { getCollectionByDocType } from '/imports/share/helpers';
import { getUserId } from '../../utils/helpers';
import { getLinkedDocAuditConfig, getLinkedDocDescription, getLinkedDocName } from './helpers';
import ActionWorkflow from '/imports/workflow/ActionWorkflow';


export default {
  logs: [
    {
      message: 'Document created',
    },
    {
      message: '{{{docName}}} was linked to this document',
      data({ newDoc, auditConfig }) {
        return _(newDoc.linkedTo.length).times(() => ({
          docName: () => auditConfig.docName(newDoc),
        }));
      },
      logData({ newDoc: { linkedTo } }) {
        return _(linkedTo).map(({ documentId, documentType }) => {
          const auditConfig = getLinkedDocAuditConfig(documentType);

          return {
            collection: auditConfig.collectionName,
            documentId,
          };
        });
      },
    },
  ],
  notifications: [
    {
      text: '{{userName}} created {{{docDesc}}} {{{docName}}} for {{{linkedDocDesc}}} {{{linkedDocName}}}',
      data({ newDoc }) {
        return _(newDoc.linkedTo).map(({ documentId, documentType }) => ({
          linkedDocDesc: getLinkedDocDescription(documentId, documentType),
          linkedDocName: getLinkedDocName(documentId, documentType),
        }));
      },
      receivers({ newDoc, user }) {
        return _(newDoc.linkedTo).map(({ documentId, documentType }) => {
          const userId = getUserId(user);

          const collection = getCollectionByDocType(documentType);
          const { identifiedBy, standardsIds } = collection.findOne({
            _id: documentId,
          }) || {};

          const receivers = new Set();
          Standards.find({ _id: { $in: standardsIds } }).forEach(({ owner }) => {
            if (owner !== userId) receivers.add(owner);
          });

          if (identifiedBy !== userId) receivers.add(identifiedBy);

          return Array.from(receivers);
        });
      },
    },
  ],
  trigger({ newDoc: { _id } }) {
    new ActionWorkflow(_id).refreshStatus();
  },
};
