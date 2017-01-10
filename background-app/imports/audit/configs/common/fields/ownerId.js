import { ChangesKinds } from '../../../utils/changes-kinds';
import { getUserFullNameOrEmail } from '/imports/share/helpers';


export default {
  logs: {
    default: {
      message: {
        [ChangesKinds.FIELD_ADDED]: 'Owner set to {{{newValue}}}',
        [ChangesKinds.FIELD_CHANGED]: 'Owner changed from {{{oldValue}}} to {{{newValue}}}',
        [ChangesKinds.FIELD_REMOVED]: 'Owner removed',
      },
    },
  },
  notifications: {
    default: {
      text: {
        [ChangesKinds.FIELD_ADDED]:
          '{{{userName}}} set owner of {{{docDesc}}} {{{docName}}} to {{{newValue}}}',
        [ChangesKinds.FIELD_CHANGED]:
          '{{{userName}}} changed owner of {{{docDesc}}} {{{docName}}} from {{{oldValue}}} to {{{newValue}}}',
        [ChangesKinds.FIELD_REMOVED]:
          '{{{userName}}} removed owner of {{{docDesc}}} {{{docName}}}',
      },
    },
  },
  data({ diffs: { ownerId } }) {
    const { newValue, oldValue } = ownerId;

    return {
      newValue: () => getUserFullNameOrEmail(newValue),
      oldValue: () => getUserFullNameOrEmail(oldValue),
    };
  },
};
