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
        [ChangesKinds.FIELD_ADDED]: 'Update of standards completion comments set',
        [ChangesKinds.FIELD_CHANGED]: 'Update of standards completion comments changed',
        [ChangesKinds.FIELD_REMOVED]: 'Update of standards completion comments removed',
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
          '{{userName}} set update of standards completion comments of {{{docDesc}}} {{{docName}}}',
        [ChangesKinds.FIELD_CHANGED]:
          '{{userName}} changed update of standards completion comments of {{{docDesc}}} {{{docName}}}',
        [ChangesKinds.FIELD_REMOVED]:
          '{{userName}} removed update of standards completion comments of {{{docDesc}}} {{{docName}}}',
      },
    },
  ],
  data() { },
  receivers({ newDoc, user }) {
    return getReceivers(newDoc, user);
  },
};
