import { ChangesKinds } from '../../../utils/changes-kinds';
import { getReceivers } from '../../problems/helpers';
import IPFileIds from '../../common/fields/improvementPlan.fileIds';


export default {
  field: 'improvementPlan.fileIds',
  logs: [
    {
      message: {
        [ChangesKinds.ITEM_ADDED]: 'Treatment plan file "{{{name}}}" added',
        [ChangesKinds.ITEM_REMOVED]: 'Treatment plan file removed',
      },
    },
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.ITEM_ADDED]:
          '{{{userName}}} added file "{{{name}}}" to treatment plan of {{{docDesc}}} {{{docName}}}',
        [ChangesKinds.ITEM_REMOVED]:
          '{{{userName}}} removed file from treatment plan of {{{docDesc}}} {{{docName}}}',
      },
    },
  ],
  data: IPFileIds.data,
  receivers({ newDoc, user }) {
    return getReceivers(newDoc, user);
  },
};
