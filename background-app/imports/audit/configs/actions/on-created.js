import { _ } from 'meteor/underscore';

import { Standards } from '../../../share/collections';
import { getCollectionByDocType } from '../../../share/helpers';
import { getUserId } from '../../utils/helpers';
import { getLinkedDocAuditConfig, getLinkedDocDescription, getLinkedDocName } from './helpers';
import ActionWorkflow from '../../../workflow/ActionWorkflow';
import onCreated from '../common/on-created';

export default {
  logs: [
    onCreated.logs.default,
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
      text: '{{{userName}}} created {{{docDesc}}} {{{docName}}} ' +
        'for {{{linkedDocDesc}}} {{{linkedDocName}}}',
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
          const { originatorId, standardsIds } = collection.findOne({
            _id: documentId,
          }) || {};

          const receivers = new Set();
          Standards.find({ _id: { $in: standardsIds } }).forEach(({ owner }) => {
            if (owner !== userId) receivers.add(owner);
          });

          if (originatorId !== userId) receivers.add(originatorId);

          return Array.from(receivers);
        });
      },
    },
  ],
  trigger({ newDoc: { _id } }) {
    new ActionWorkflow(_id).refreshStatus();
  },
};
