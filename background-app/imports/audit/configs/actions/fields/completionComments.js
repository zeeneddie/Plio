import { ChangesKinds } from '../../../utils/changes-kinds';
import { getReceivers } from '../helpers';


export default {
  field: 'completionComments',
  logs: [
    {
      shouldCreateLog({ diffs: { isCompleted } }) {
        return !isCompleted;
      },
      message: {
        [ChangesKinds.FIELD_ADDED]: 'Completion comments set',
        [ChangesKinds.FIELD_CHANGED]: 'Completion comments changed',
        [ChangesKinds.FIELD_REMOVED]: 'Completion comments removed',
      },
    },
  ],
  notifications: [
    {
      shouldSendNotification({ diffs: { isCompleted } }) {
        return !isCompleted;
      },
      text: {
        [ChangesKinds.FIELD_ADDED]:
          '{{{userName}}} set completion comments of {{{docDesc}}} {{{docName}}}',
        [ChangesKinds.FIELD_CHANGED]:
          '{{{userName}}} changed completion comments of {{{docDesc}}} {{{docName}}}',
        [ChangesKinds.FIELD_REMOVED]:
          '{{{userName}}} removed completion comments of {{{docDesc}}} {{{docName}}}',
      },
    },
  ],
  data({ diffs: { completionComments } }) {
    const { newValue, oldValue } = completionComments;
    return { newValue, oldValue };
  },
  receivers({ newDoc, user }) {
    return getReceivers(newDoc, user);
  },
};
