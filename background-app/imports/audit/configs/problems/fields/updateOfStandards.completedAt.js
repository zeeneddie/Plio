import { ChangesKinds } from '../../../utils/changes-kinds';
import { getPrettyTzDate } from '/imports/helpers/date';
import { getReceivers } from '../helpers';


export default {
  field: 'updateOfStandards.completedAt',
  logs: [
    {
      shouldCreateLog({ diffs }) {
        return !diffs['updateOfStandards.status'];
      },
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'Update of standards date set to "{{newValue}}"',
        [ChangesKinds.FIELD_CHANGED]:
          'Update of standards date changed from "{{oldValue}}" to "{{newValue}}"',
        [ChangesKinds.FIELD_REMOVED]:
          'Update of standards date removed',
      },
    },
  ],
  notifications: [
    {
      shouldSendNotification({ diffs }) {
        return !diffs['updateOfStandards.status'];
      },
      text: {
        [ChangesKinds.FIELD_ADDED]:
          '{{userName}} set update of standards date of {{{docDesc}}} {{{docName}}} to "{{newValue}}"',
        [ChangesKinds.FIELD_CHANGED]:
          '{{userName}} changed update of standards date of {{{docDesc}}} {{{docName}}} from "{{oldValue}}" to "{{newValue}}"',
        [ChangesKinds.FIELD_REMOVED]:
          '{{userName}} removed update of standards date of {{{docDesc}}} {{{docName}}}',
      },
    },
  ],
  data({ diffs, organization }) {
    const { newValue, oldValue } = diffs['updateOfStandards.completedAt'];
    const { timezone } = organization;

    return {
      newValue: () => getPrettyTzDate(newValue, timezone),
      oldValue: () => getPrettyTzDate(oldValue, timezone),
    };
  },
  receivers({ newDoc, user }) {
    return getReceivers(newDoc, user);
  },
};
