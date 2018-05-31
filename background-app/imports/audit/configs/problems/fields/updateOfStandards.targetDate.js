import { getPrettyTzDate } from '/imports/helpers/date';
import { ChangesKinds } from '../../../utils/changes-kinds';
import { getReceivers } from '../helpers';


export default {
  field: 'updateOfStandards.targetDate',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'Approval target date set to {{{newValue}}}',
        [ChangesKinds.FIELD_CHANGED]:
          'Approval target date changed from {{{oldValue}}} to {{{newValue}}}',
        [ChangesKinds.FIELD_REMOVED]:
          'Approval target date removed',
      },
    },
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.FIELD_ADDED]:
          '{{{userName}}} set approval target date ' +
          'of {{{docDesc}}} {{{docName}}} to {{{newValue}}}',
        [ChangesKinds.FIELD_CHANGED]:
          '{{{userName}}} changed approval target date ' +
          'of {{{docDesc}}} {{{docName}}} from {{{oldValue}}} to {{{newValue}}}',
        [ChangesKinds.FIELD_REMOVED]:
          '{{{userName}}} removed approval target date of {{{docDesc}}} {{{docName}}}',
      },
    },
  ],
  data({ diffs, organization }) {
    const { newValue, oldValue } = diffs['updateOfStandards.targetDate'];
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
