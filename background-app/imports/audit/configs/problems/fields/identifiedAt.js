import { ChangesKinds } from '../../../utils/changes-kinds';
import { getPrettyTzDate } from '/imports/helpers/date';
import { getReceivers } from '../helpers';


export default {
  field: 'identifiedAt',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'Identified at set to "{{newValue}}"',
        [ChangesKinds.FIELD_CHANGED]:
          'Identified at changed from "{{oldValue}}" to "{{newValue}}"',
        [ChangesKinds.FIELD_REMOVED]:
          'Identified at removed',
      },
    },
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.FIELD_ADDED]:
          '{{userName}} set identified date of {{{docDesc}}} {{{docName}}} to "{{newValue}}"',
        [ChangesKinds.FIELD_CHANGED]:
          '{{userName}} changed identified date of {{{docDesc}}} {{{docName}}} from "{{oldValue}}" to "{{newValue}}"',
        [ChangesKinds.FIELD_REMOVED]:
          '{{userName}} removed identified date of {{{docDesc}}} {{{docName}}}',
      },
    },
  ],
  data({ diffs: { identifiedAt }, organization: { timezone } }) {
    return {
      newValue: () => getPrettyTzDate(identifiedAt.newValue, timezone),
      oldValue: () => getPrettyTzDate(identifiedAt.oldValue, timezone),
    };
  },
  receivers({ newDoc, user }) {
    return getReceivers(newDoc, user);
  },
};
