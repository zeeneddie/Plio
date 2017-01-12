import { ChangesKinds } from '../../../utils/changes-kinds';
import { getUserFullNameOrEmail } from '/imports/share/helpers';
import { getLogData } from '../helpers';


export default {
  field: 'owner',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          '{{{docName}}} owner set to {{{newValue}}}',
        [ChangesKinds.FIELD_CHANGED]:
          '{{{docName}}} owner changed from {{{oldValue}}} to {{{newValue}}}',
        [ChangesKinds.FIELD_REMOVED]:
          '{{{docName}}} owner removed',
      },
      logData: getLogData,
    },
  ],
  notifications: [],
  data({ diffs: { owner } }) {
    const { newValue, oldValue } = owner;

    return {
      newValue: () => getUserFullNameOrEmail(newValue),
      oldValue: () => getUserFullNameOrEmail(oldValue),
    };
  },
};
