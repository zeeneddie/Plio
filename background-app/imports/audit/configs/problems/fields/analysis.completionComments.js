import { ChangesKinds } from '../../../utils/changes-kinds';
import { getReceivers } from '../helpers';


export default {
  field: 'analysis.completionComments',
  logs: [
    {
      shouldCreateLog({ diffs }) {
        return !diffs['analysis.status'];
      },
      message: {
        [ChangesKinds.FIELD_ADDED]: 'Root cause analysis completion comments set',
        [ChangesKinds.FIELD_CHANGED]: 'Root cause analysis completion comments changed',
        [ChangesKinds.FIELD_REMOVED]: 'Root cause analysis completion comments removed',
      },
    },
  ],
  notifications: [
    {
      shouldSendNotification({ diffs }) {
        return !diffs['analysis.status'];
      },
      text: {
        [ChangesKinds.FIELD_ADDED]:
          '{{userName}} set root cause analysis completion comments of {{{docDesc}}} {{{docName}}}',
        [ChangesKinds.FIELD_CHANGED]:
          '{{userName}} changed root cause analysis completion comments of {{{docDesc}}} {{{docName}}}',
        [ChangesKinds.FIELD_REMOVED]:
          '{{userName}} removed root cause analysis completion comments of {{{docDesc}}} {{{docName}}}',
      },
    },
  ],
  data() { },
  receivers({ newDoc, user }) {
    return getReceivers(newDoc, user);
  },
};
