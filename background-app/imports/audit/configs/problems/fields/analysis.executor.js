import { ChangesKinds } from '../../../utils/changes-kinds';
import { getUserFullNameOrEmail } from '/imports/share/helpers';
import { getReceivers } from '../helpers';


export default {
  field: 'analysis.executor',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'Root cause analysis assigned to {{{newValue}}}',
        [ChangesKinds.FIELD_CHANGED]:
          'Root cause analysis reassigned to {{{newValue}}}',
        [ChangesKinds.FIELD_REMOVED]:
          'Root cause analysis executor removed',
      },
    },
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.FIELD_ADDED]:
          '{{{userName}}} assigned {{{newValue}}} to carry out root cause analysis of {{{docDesc}}} {{{docName}}}',
        [ChangesKinds.FIELD_CHANGED]:
          '{{{userName}}} assigned {{{newValue}}} to carry out root cause analysis of {{{docDesc}}} {{{docName}}} instead of {{{oldValue}}}',
        [ChangesKinds.FIELD_REMOVED]:
          '{{{userName}}} removed root cause analysis executor of {{{docDesc}}} {{{docName}}}',
      },
    },
  ],
  data({ diffs }) {
    const { newValue, oldValue } = diffs['analysis.executor'];

    return {
      newValue: () => getUserFullNameOrEmail(newValue),
      oldValue: () => getUserFullNameOrEmail(oldValue),
    };
  },
  receivers({ newDoc, user }) {
    return getReceivers(newDoc, user);
  },
};
