import { ChangesKinds } from '../../../utils/changes-kinds.js';
import { Files } from '/imports/share/collections/files.js';
import { getUserFullNameOrEmail } from '../../../utils/helpers.js';
import { getReceivers } from '../helpers.js';


export default {
  field: 'fileIds',
  logs: [
    {
      message: {
        [ChangesKinds.ITEM_ADDED]: 'File "{{name}}" added',
        [ChangesKinds.ITEM_REMOVED]: 'File removed'
      }
    }
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.ITEM_ADDED]: '{{userName}} added file "{{name}}" to {{{docDesc}}}',
        [ChangesKinds.ITEM_REMOVED]: '{{userName}} removed file from {{{docDesc}}}'
      }
    }
  ],
  data({ diffs: { fileIds }, newDoc, user }) {
    const { item:_id } = fileIds;
    const { name } = Files.findOne({ _id }) || {};
    const auditConfig = this;

    return {
      name: () => name,
      docDesc: () => auditConfig.docDescription(newDoc),
      userName: () => getUserFullNameOrEmail(user)
    };
  }
  receivers: getReceivers
};
