import { ChangesKinds } from '../../../utils/changes-kinds';
import { getReceivers } from '../helpers';


export default {
  field: 'updateOfStandards.completionComments',
  logs: [
    {
      shouldCreateLog({ diffs }) {
        return !diffs['updateOfStandards.status'];
      },
      message: {
        [ChangesKinds.FIELD_ADDED]: 'Approval completion comments set',
        [ChangesKinds.FIELD_CHANGED]: 'Approval completion comments changed',
        [ChangesKinds.FIELD_REMOVED]: 'Approval completion comments removed',
      },
    },
  ],
  notifications: [
    {
      shouldSendNotification({ diffs }) {
        return !diffs['updateOfStandards.status'];
      },
      text: {
        [ChangesKinds.FIELD_ADDED]:
          '{{{userName}}} set approval completion comments of {{{docDesc}}} {{{docName}}}',
        [ChangesKinds.FIELD_CHANGED]:
          '{{{userName}}} changed approval completion comments of {{{docDesc}}} {{{docName}}}',
        [ChangesKinds.FIELD_REMOVED]:
          '{{{userName}}} removed approval completion comments of {{{docDesc}}} {{{docName}}}',
      },
    },
  ],
  data() { },
  receivers({ newDoc, user }) {
    return getReceivers(newDoc, user);
  },
};
