import { ChangesKinds } from '../../../utils/changes-kinds';
import { getUserFullNameOrEmail } from '/imports/share/helpers';
import { getReceivers } from '../helpers';


export default {
  field: 'completedBy',
  logs: [
    {
      shouldCreateLog({ diffs: { isCompleted } }) {
        return !isCompleted;
      },
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'Completed by set to {{{newValue}}}',
        [ChangesKinds.FIELD_CHANGED]:
          'Completed by changed from {{{oldValue}}} to {{{newValue}}}',
        [ChangesKinds.FIELD_REMOVED]:
          'Completed by removed',
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
          '{{{userName}}} set completed by of {{{docDesc}}} {{{docName}}} to {{{newValue}}}',
        [ChangesKinds.FIELD_CHANGED]:
          '{{{userName}}} changed completed by of {{{docDesc}}} {{{docName}}} from {{{oldValue}}} to {{{newValue}}}',
        [ChangesKinds.FIELD_REMOVED]:
          '{{{userName}}} removed completed by of {{{docDesc}}} {{{docName}}}',
      },
    },
  ],
  data({ diffs: { completedBy } }) {
    const { newValue, oldValue } = completedBy;

    return {
      newValue: () => getUserFullNameOrEmail(newValue),
      oldValue: () => getUserFullNameOrEmail(oldValue),
    };
  },
  receivers({ newDoc, user }) {
    return getReceivers(newDoc, user);
  },
};
