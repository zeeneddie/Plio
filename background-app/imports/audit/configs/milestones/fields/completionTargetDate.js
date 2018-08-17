import { ChangesKinds } from '../../../utils/changes-kinds';
import { getPrettyTzDate } from '../../../../helpers/date';
import MilestoneWorkflow from '../../../../workflow/MilestoneWorkflow';
import { getReceivers } from '../helpers';

export default {
  field: 'completionTargetDate',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'Completion - target date set to {{{newValue}}}',
        [ChangesKinds.FIELD_CHANGED]:
          'Completion - target date changed from {{{oldValue}}} to {{{newValue}}}',
        [ChangesKinds.FIELD_REMOVED]:
          'Completion - target date removed',
      },
    },
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.FIELD_ADDED]:
          '{{{userName}}} set completion - target date of ' +
          '{{{docDesc}}} {{{docName}}} to {{{newValue}}}',
        [ChangesKinds.FIELD_CHANGED]:
          '{{{userName}}} changed completion - target date of {{{docDesc}}} {{{docName}}} ' +
          'from {{{oldValue}}} to {{{newValue}}}',
        [ChangesKinds.FIELD_REMOVED]:
          '{{{userName}}} removed completion - target date of {{{docDesc}}} {{{docName}}}',
      },
    },
  ],
  data({ diffs: { completionTargetDate }, organization }) {
    const { newValue, oldValue } = completionTargetDate;
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
    new MilestoneWorkflow(newDoc._id).refreshStatus();
  },
};
