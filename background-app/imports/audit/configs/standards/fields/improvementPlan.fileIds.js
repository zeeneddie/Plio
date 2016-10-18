import { Files } from '/imports/share/collections/files.js';
import { ChangesKinds } from '../../../utils/changes-kinds.js';
import { getUserFullNameOrEmail } from '../../../utils/helpers.js';
import { getReceivers } from '../helpers.js';


export default {
  field: 'improvementPlan.fileIds',
  logs: [
    {
      message: {
        [ChangesKinds.ITEM_ADDED]: 'Improvement plan file "{{name}}" added',
        [ChangesKinds.ITEM_REMOVED]: 'Improvement plan file removed'
      }
    }
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.ITEM_ADDED]:
          '{{userName}} added file "{{name}}" to improvement plan of {{{docDesc}}}',
        [ChangesKinds.ITEM_REMOVED]:
          '{{userName}} removed file from improvement plan of {{{docDesc}}}'
      }
    }
  ],
  data({ diffs, newDoc, user }) {
    const _id = diffs['improvementPlan.fileIds'].item;
    const file = () => Files.findOne({ _id }) || {};
    const auditConfig = this;

    return {
      name: () => file().name,
      docDesc: () => auditConfig.docDescription(newDoc),
      userName: () => getUserFullNameOrEmail(user)
    };
  },
  receivers: getReceivers
};
