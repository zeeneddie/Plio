import ActionWorkflow from '/imports/workflow/ActionWorkflow';
import { getPrettyTzDate } from '/imports/helpers/date';
import { ChangesKinds } from '../../../utils/changes-kinds';
import { getReceivers } from '../helpers';


export default {
  field: 'verificationTargetDate',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'Verification target date set to {{{newValue}}}',
        [ChangesKinds.FIELD_CHANGED]:
          'Verification target date changed from {{{oldValue}}} to {{{newValue}}}',
        [ChangesKinds.FIELD_REMOVED]:
          'Verification target date removed',
      },
    },
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.FIELD_ADDED]:
          '{{{userName}}} set verification target date ' +
          'of {{{docDesc}}} {{{docName}}} to {{{newValue}}}',
        [ChangesKinds.FIELD_CHANGED]:
          '{{{userName}}} changed verification target date ' +
          'of {{{docDesc}}} {{{docName}}} from {{{oldValue}}} to {{{newValue}}}',
        [ChangesKinds.FIELD_REMOVED]:
          '{{{userName}}} removed verification target date of {{{docDesc}}} {{{docName}}}',
      },
    },
  ],
  data({ diffs: { verificationTargetDate }, organization }) {
    const { newValue, oldValue } = verificationTargetDate;
    const { timezone } = organization;

    return {
      newValue: () => getPrettyTzDate(newValue, timezone),
      oldValue: () => getPrettyTzDate(oldValue, timezone),
    };
  },
  receivers({ newDoc, user }) {
    return getReceivers(newDoc, user);
  },
  trigger({ newDoc: { _id } }) {
    new ActionWorkflow(_id).refreshStatus();
  },
};
