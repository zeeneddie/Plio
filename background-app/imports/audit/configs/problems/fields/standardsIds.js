import { Standards } from '/imports/share/collections/standards';
import { ChangesKinds } from '../../../utils/changes-kinds';
import { getUserId } from '../../../utils/helpers';
import StandardAuditConfig from '../../standards/standard-audit-config';


export default {
  field: 'standardsIds',
  logs: [
    {
      message: {
        [ChangesKinds.ITEM_ADDED]: 'Document was linked to {{{standardName}}}',
        [ChangesKinds.ITEM_REMOVED]: 'Document was unlinked from {{{standardName}}}',
      },
    },
    {
      message: {
        [ChangesKinds.ITEM_ADDED]: '{{{docName}}} was linked to this document',
        [ChangesKinds.ITEM_REMOVED]: '{{{docName}}} was unlinked from this document',
      },
      logData({ diffs: { standardsIds } }) {
        const { item: standardId } = standardsIds;

        return {
          collection: StandardAuditConfig.collectionName,
          documentId: standardId,
        };
      },
    },
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.ITEM_ADDED]:
          '{{{userName}}} linked {{{docDesc}}} {{{docName}}} to {{{standardDesc}}} {{{standardName}}}',
        [ChangesKinds.ITEM_REMOVED]:
          '{{{userName}}} unlinked {{{docDesc}}} {{{docName}}} from {{{standardDesc}}} {{{standardName}}}',
      },
    },
  ],
  data({ diffs: { standardsIds } }) {
    const { item: standardId } = standardsIds;
    const standard = Standards.findOne({ _id: standardId });

    return {
      standardDesc: StandardAuditConfig.docDescription(standard),
      standardName: StandardAuditConfig.docName(standard),
    };
  },
  receivers({ diffs: { standardsIds }, user }) {
    const userId = getUserId(user);
    const { item: standardId } = standardsIds;
    const { owner } = Standards.findOne({ _id: standardId }) || {};

    return (owner !== userId) ? [owner] : [];
  },
};
