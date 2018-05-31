import { getPrettyTzDate } from '/imports/helpers/date';
import { ChangesKinds } from '../../../utils/changes-kinds';
import { getReceivers } from '../helpers';


export default {
  field: 'analysis.targetDate',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'Root cause analysis target date set to {{{newValue}}}',
        [ChangesKinds.FIELD_CHANGED]:
          'Root cause analysis target date changed from {{{oldValue}}} to {{{newValue}}}',
        [ChangesKinds.FIELD_REMOVED]:
          'Root cause analysis target date removed',
      },
    },
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.FIELD_ADDED]:
          '{{{userName}}} set root cause analysis target date ' +
          'of {{{docDesc}}} {{{docName}}} to {{{newValue}}}',
        [ChangesKinds.FIELD_CHANGED]:
          '{{{userName}}} changed root cause analysis target date ' +
          'of {{{docDesc}}} {{{docName}}} from {{{oldValue}}} to {{{newValue}}}',
        [ChangesKinds.FIELD_REMOVED]:
          '{{{userName}}} removed root cause analysis target date of {{{docDesc}}} {{{docName}}}',
      },
    },
  ],
  data({ diffs, organization }) {
    const { newValue, oldValue } = diffs['analysis.targetDate'];
    const { timezone } = organization;

    return {
      newValue: () => getPrettyTzDate(newValue, timezone),
      oldValue: () => getPrettyTzDate(oldValue, timezone),
    };
  },
  receivers({ newDoc, user }) {
    return getReceivers(newDoc, user);
  },
  trigger({ newDoc: { _id }, auditConfig }) {
    // eslint-disable-next-line new-cap
    new auditConfig.workflowConstructor(_id).refreshStatus();
  },
};
