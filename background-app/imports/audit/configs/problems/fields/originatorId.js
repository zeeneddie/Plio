import { getUserFullNameOrEmail } from '/imports/share/helpers';
import { ChangesKinds } from '../../../utils/changes-kinds';
import { getReceivers } from '../helpers';

export default {
  field: 'originatorId',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'Originator set to {{{newValue}}}',
        [ChangesKinds.FIELD_CHANGED]:
          'Originator changed from {{{oldValue}}} to {{{newValue}}}',
        [ChangesKinds.FIELD_REMOVED]:
          'Originator removed',
      },
    },
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.FIELD_ADDED]:
          '{{{userName}}} set originator of {{{docDesc}}} {{{docName}}} to {{{newValue}}}',
        [ChangesKinds.FIELD_CHANGED]:
          '{{{userName}}} changed originator of {{{docDesc}}} {{{docName}}} ' +
          'from {{{oldValue}}} to {{{newValue}}}',
        [ChangesKinds.FIELD_REMOVED]:
          '{{{userName}}} removed originator of {{{docDesc}}} {{{docName}}}',
      },
    },
  ],
  data({ diffs: { originatorId } }) {
    const { newValue, oldValue } = originatorId;

    return {
      newValue: () => getUserFullNameOrEmail(newValue),
      oldValue: () => getUserFullNameOrEmail(oldValue),
    };
  },
  receivers({ newDoc, user }) {
    return getReceivers(newDoc, user);
  },
};
