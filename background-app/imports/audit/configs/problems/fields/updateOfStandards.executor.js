import { ChangesKinds } from '../../../utils/changes-kinds';
import { getUserFullNameOrEmail } from '/imports/share/helpers';
import { getReceivers } from '../helpers';


export default {
  field: 'updateOfStandards.executor',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'Approval executor set to {{{newValue}}}',
        [ChangesKinds.FIELD_CHANGED]:
          'Approval executor changed from {{{oldValue}}} to {{{newValue}}}',
        [ChangesKinds.FIELD_REMOVED]:
          'Approval executor removed',
      },
    },
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.FIELD_ADDED]:
          '{{{userName}}} set approval executor of {{{docDesc}}} {{{docName}}} to {{{newValue}}}',
        [ChangesKinds.FIELD_CHANGED]:
          '{{{userName}}} changed approval executor of {{{docDesc}}} {{{docName}}} from {{{oldValue}}} to {{{newValue}}}',
        [ChangesKinds.FIELD_REMOVED]:
          '{{{userName}}} removed approval executor of {{{docDesc}}} {{{docName}}}',
      },
    },
  ],
  data({ diffs }) {
    const { newValue, oldValue } = diffs['updateOfStandards.executor'];

    return {
      newValue: () => getUserFullNameOrEmail(newValue),
      oldValue: () => getUserFullNameOrEmail(oldValue),
    };
  },
  receivers({ newDoc, user }) {
    return getReceivers(newDoc, user);
  },
};
