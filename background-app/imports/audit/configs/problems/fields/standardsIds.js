import { Standards } from '/imports/share/collections/standards';
import { ChangesKinds } from '../../../utils/changes-kinds';
import { getUserFullNameOrEmail, getUserId } from '../../../utils/helpers';
import StandardAuditConfig from '../../standards/standard-audit-config';


export default {
  field: 'standardsIds',
  logs: [
    {
      message: {
        [ChangesKinds.ITEM_ADDED]:
          'problems.fields.standardsIds.doc-log.item-added',
        [ChangesKinds.ITEM_REMOVED]:
          'problems.fields.standardsIds.doc-log.item-removed',
      },
    },
    {
      message: {
        [ChangesKinds.ITEM_ADDED]:
          'problems.fields.standardsIds.linked-standard-log.item-added',
        [ChangesKinds.ITEM_REMOVED]:
          'problems.fields.standardsIds.linked-standard-log.item-removed',
      },
      data({ newDoc }) {
        const auditConfig = this;

        return { docName: () => auditConfig.docName(newDoc) };
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
          'problems.fields.standardsIds.linked-standard-notification.text.item-added',
        [ChangesKinds.ITEM_REMOVED]:
          'problems.fields.standardsIds.linked-standard-notification.text.item-removed',
      },
    },
  ],
  data({ diffs: { standardsIds }, newDoc, user }) {
    const auditConfig = this;
    const { item: standardId } = standardsIds;
    const standard = Standards.findOne({ _id: standardId });

    return {
      docDesc: () => auditConfig.docDescription(newDoc),
      docName: () => auditConfig.docName(newDoc),
      standardDesc: () => StandardAuditConfig.docDescription(standard),
      standardName: () => StandardAuditConfig.docName(standard),
      userName: () => getUserFullNameOrEmail(user),
    };
  },
  receivers({ diffs: { standardsIds }, user }) {
    const userId = getUserId(user);
    const { item: standardId } = standardsIds;
    const { owner } = Standards.findOne({ _id: standardId }) || {};

    return (owner !== userId) ? [owner] : [];
  },
};
