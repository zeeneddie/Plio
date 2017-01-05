import { ChangesKinds } from '../../../utils/changes-kinds';
import { getPrettyTzDate } from '../../../utils/helpers';


export default {
  field: 'analysis.targetDate',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'Root cause analysis target date set to "{{newValue}}"',
        [ChangesKinds.FIELD_CHANGED]:
          'Root cause analysis target date changed from "{{oldValue}}" to "{{newValue}}"',
        [ChangesKinds.FIELD_REMOVED]:
          'Root cause analysis target date removed',
      },
    },
  ],
  notifications: [],
  data({ diffs, organization }) {
    const { newValue, oldValue } = diffs['analysis.targetDate'];
    const { timezone } = organization;

    return {
      newValue: () => getPrettyTzDate(newValue, timezone),
      oldValue: () => getPrettyTzDate(oldValue, timezone),
    };
  },
  trigger({ newDoc: { _id } }) {
    new this.workflowConstructor(_id).refreshStatus();
  },
};
