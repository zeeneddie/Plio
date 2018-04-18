import { ChangesKinds } from '../../../utils/changes-kinds';
import { getPrettyTzDate } from '../../../../helpers/date';
import MilestoneWorkflow from '../../../../workflow/MilestoneWorkflow';

export default {
  field: 'completionTargetDate',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'Completion - target date set to "{{{newValue}}}"',
        [ChangesKinds.FIELD_CHANGED]:
          'Completion - target date changed from "{{{oldValue}}}" to "{{{newValue}}}"',
        [ChangesKinds.FIELD_REMOVED]:
          'Completion - target date removed',
      },
    },
  ],
  notifications: [],
  data({ diffs: { completionTargetDate }, organization }) {
    const { newValue, oldValue } = completionTargetDate;
    const { timezone } = organization;

    return {
      newValue: () => getPrettyTzDate(newValue, timezone),
      oldValue: () => getPrettyTzDate(oldValue, timezone),
    };
  },
  trigger({ newDoc }) {
    new MilestoneWorkflow(newDoc._id).refreshStatus();
  },
};
