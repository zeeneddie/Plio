import { ChangesKinds } from '../../../utils/changes-kinds';
import { getPrettyTzDate } from '../../../utils/helpers';


export default {
  field: 'updateOfStandards.targetDate',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'Update of standards target date set to "{{newValue}}"',
        [ChangesKinds.FIELD_CHANGED]:
          'Update of standards target date changed from "{{oldValue}}" to "{{newValue}}"',
        [ChangesKinds.FIELD_REMOVED]:
          'Update of standards target date removed',
      },
    },
  ],
  notifications: [],
  data({ diffs, organization }) {
    const { newValue, oldValue } = diffs['updateOfStandards.targetDate'];
    const { timezone } = organization;

    return {
      newValue: () => getPrettyTzDate(newValue, timezone),
      oldValue: () => getPrettyTzDate(oldValue, timezone),
    };
  },
  trigger({ newDoc: { _id }, auditConfig }) {
    new auditConfig.workflowConstructor(_id).refreshStatus();
  },
};
