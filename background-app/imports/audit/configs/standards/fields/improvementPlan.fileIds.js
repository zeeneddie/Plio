import { Files } from '/imports/share/collections/files';
import { ChangesKinds } from '../../../utils/changes-kinds';
import { getUserFullNameOrEmail } from '../../../utils/helpers';
import { getReceivers } from '../helpers';


export default {
  field: 'improvementPlan.fileIds',
  logs: [
    {
      message: {
        [ChangesKinds.ITEM_ADDED]:
          'common.fields.improvementPlan.fileIds.item-added',
        [ChangesKinds.ITEM_REMOVED]:
          'common.fields.improvementPlan.fileIds.item-removed',
      },
    },
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.ITEM_ADDED]:
          'common.fields.improvementPlan.fileIds.text.item-added',
        [ChangesKinds.ITEM_REMOVED]:
          'common.fields.improvementPlan.fileIds.text.item-removed',
      },
    },
  ],
  data({ diffs, newDoc, user }) {
    const _id = diffs['improvementPlan.fileIds'].item;
    const file = () => Files.findOne({ _id }) || {};
    const auditConfig = this;

    return {
      name: () => file().name,
      docDesc: () => auditConfig.docDescription(newDoc),
      docName: () => auditConfig.docName(newDoc),
      userName: () => getUserFullNameOrEmail(user),
    };
  },
  receivers: getReceivers,
};
