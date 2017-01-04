import { ChangesKinds } from '../../../utils/changes-kinds';
import { Files } from '/imports/share/collections/files';
import { getUserFullNameOrEmail } from '../../../utils/helpers';
import { getReceivers } from '../helpers';


export default {
  field: 'fileIds',
  logs: [
    {
      message: {
        [ChangesKinds.ITEM_ADDED]: 'common.fields.fileIds.item-added',
        [ChangesKinds.ITEM_REMOVED]: 'common.fields.fileIds.item-removed',
      },
    },
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.ITEM_ADDED]: 'common.fields.fileIds.text.item-added',
        [ChangesKinds.ITEM_REMOVED]: 'common.fields.fileIds.text.item-removed',
      },
    },
  ],
  data({ diffs: { fileIds }, newDoc, user }) {
    const { item: _id } = fileIds;
    const { name } = Files.findOne({ _id }) || {};
    const auditConfig = this;

    return {
      name: () => name,
      docDesc: () => auditConfig.docDescription(newDoc),
      docName: () => auditConfig.docName(newDoc),
      userName: () => getUserFullNameOrEmail(user),
    };
  },
  receivers({ newDoc, user }) {
    return getReceivers(newDoc, user);
  },
};
