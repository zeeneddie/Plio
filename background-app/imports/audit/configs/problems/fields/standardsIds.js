import { Standards } from '/imports/share/collections/standards.js';
import { ChangesKinds } from '../../../utils/changes-kinds.js';
import { getUserFullNameOrEmail, getUserId } from '../../../utils/helpers.js';
import StandardAuditConfig from '../../standards/standard-audit-config.js';


export default {
  field: 'standardsIds',
  logs: [
    {
      message: {
        [ChangesKinds.ITEM_ADDED]: 'Document was linked to {{{standardDesc}}}',
        [ChangesKinds.ITEM_REMOVED]: 'Document was unlinked from {{{standardDesc}}}'
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
      logData({ diffs: { standardsIds } }) {
        const { item:standardId } = standardsIds;

        return {
          collection: StandardAuditConfig.collectionName,
          documentId: standardId
        };
      }
    }
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.ITEM_ADDED]:
          '{{userName}} linked {{{docDesc}}} to {{{standardDesc}}}',
        [ChangesKinds.ITEM_REMOVED]:
          '{{userName}} unlinked {{{docDesc}}} from {{{standardDesc}}}'
      }
    }
  ],
  data({ diffs: { standardsIds }, newDoc, user }) {
    const auditConfig = this;
    const { item:standardId } = standardsIds;
    const standard = () => Standards.findOne({ _id: standardId });

    return {
      docDesc: () => auditConfig.docDescription(newDoc),
      standardDesc: () => StandardAuditConfig.docDescription(standard()),
      userName: () => getUserFullNameOrEmail(user)
    };
  },
  receivers({ diffs: { standardsIds }, newDoc, user }) {
    const userId = getUserId(user);
    const { item:standardId } = standardsIds;
    const { owner } = Standards.findOne({ _id: standardId }) || {};

    return (owner !== userId) ? [owner] : [];
  }
};
