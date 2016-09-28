import { ChangesKinds } from '../../../utils/changes-kinds.js';
import {
  getUserFullNameOrEmail, getLinkedDocAuditConfig,
  getLinkedDocName
} from '../../../utils/helpers.js';
import { getReceivers } from '../helpers.js';

export default {
  field: 'linkedTo',
  logs: [
    {
      message: {
        [ChangesKinds.ITEM_ADDED]: 'Document was linked to {{{linkedDocDesc}}}',
        [ChangesKinds.ITEM_REMOVED]: 'Document was unlinked from {{{linkedDocDesc}}}'
      }
    },
    {
      message: {
        [ChangesKinds.ITEM_ADDED]: '{{{docDesc}}} was linked to this document',
        [ChangesKinds.ITEM_REMOVED]: '{{{docDesc}}} was unlinked from this document'
      },
      data({ newDoc }) {
        const auditConfig = this;

        return { docDesc: () => auditConfig.docDescription(newDoc) };
      },
      logData({ diffs: { linkedTo } }) {
        const { item: { documentId, documentType } } = linkedTo;
        const auditConfig = getLinkedDocAuditConfig(documentType);

        return {
          collection: auditConfig.collectionName,
          documentId
        };
      }
    }
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.ITEM_ADDED]:
          '{{userName}} linked {{{docDesc}}} to {{{linkedDocDesc}}}',
        [ChangesKinds.ITEM_REMOVED]:
          '{{userName}} unlinked {{{docDesc}}} from {{{linkedDocDesc}}}'
      }
    }
  ],
  data({ diffs: { linkedTo }, newDoc, user }) {
    const { item: { documentId, documentType } } = linkedTo;
    const auditConfig = this;

    return {
      docDesc: () => auditConfig.docDescription(newDoc),
      linkedDocDesc: () => getLinkedDocName(documentId, documentType),
      userName: () => getUserFullNameOrEmail(user)
    };
  },
  receivers({ diffs: { linkedTo }, newDoc, oldDoc, user }) {
    const doc = (linkedTo.kind === ITEM_ADDED) ? newDoc : oldDoc;
    return getReceivers(doc, user);
  }
};
