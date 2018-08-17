import { without } from 'ramda';

import { ChangesKinds } from '../../../utils/changes-kinds';
import { getUserFullNameOrEmail } from '../../../../share/helpers';
import { getReceivers } from '../helpers';


export default {
  field: 'toBeCompletedBy',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'To be completed by set to {{{newValue}}}',
        [ChangesKinds.FIELD_CHANGED]:
          'To be completed by changed from {{{oldValue}}} to {{{newValue}}}',
        [ChangesKinds.FIELD_REMOVED]:
          'To be completed by removed',
      },
    },
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.FIELD_ADDED]:
          '{{{userName}}} set to be completed by of {{{docDesc}}} {{{docName}}} to {{{newValue}}}',
        [ChangesKinds.FIELD_CHANGED]:
          '{{{userName}}} changed to be completed by of {{{docDesc}}} {{{docName}}} ' +
          'from {{{oldValue}}} to {{{newValue}}}',
        [ChangesKinds.FIELD_REMOVED]:
          '{{{userName}}} removed to be completed by of {{{docDesc}}} {{{docName}}}',
      },
    },
  ],
  data({ diffs: { toBeCompletedBy } }) {
    const { newValue, oldValue } = toBeCompletedBy;

    return {
      newValue: () => getUserFullNameOrEmail(newValue),
      oldValue: () => getUserFullNameOrEmail(oldValue),
    };
  },
  receivers({ diffs: { toBeCompletedBy }, newDoc, user }) {
    const receivers = getReceivers(newDoc, user);
    return without(toBeCompletedBy.newValue, receivers);
  },
};
