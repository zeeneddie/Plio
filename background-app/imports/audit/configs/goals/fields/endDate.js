import { ChangesKinds } from '../../../utils/changes-kinds';
import { getPrettyTzDate } from '../../../../helpers/date';
import { getReceivers } from '../helpers';
import GoalWorkflow from '../../../../workflow/GoalWorkflow';

export default {
  field: 'endDate',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'End date set to "{{{newValue}}}"',
        [ChangesKinds.FIELD_CHANGED]:
          'End date changed from "{{{oldValue}}}" to "{{{newValue}}}"',
        [ChangesKinds.FIELD_REMOVED]:
          'End date removed',
      },
    },
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.FIELD_ADDED]:
          '{{{userName}}} set end date of {{{docDesc}}} {{{docName}}} to {{{newValue}}}',
        [ChangesKinds.FIELD_CHANGED]:
          '{{{userName}}} changed end date of {{{docDesc}}} {{{docName}}} ' +
          'from {{{oldValue}}} to {{{newValue}}}',
        [ChangesKinds.FIELD_REMOVED]:
          '{{{userName}}} removed end date of {{{docDesc}}} {{{docName}}}',
      },
    },
  ],
  data({ diffs: { endDate }, organization }) {
    const { newValue, oldValue } = endDate;
    const { timezone } = organization;

    return {
      newValue: () => getPrettyTzDate(newValue, timezone),
      oldValue: () => getPrettyTzDate(oldValue, timezone),
    };
  },
  receivers({ newDoc, user }) {
    return getReceivers(newDoc, user);
  },
  trigger({ newDoc }) {
    new GoalWorkflow(newDoc._id).refreshStatus();
  },
};
