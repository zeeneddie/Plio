import { ChangesKinds } from '../../../utils/changes-kinds';
import { getPrettyTzDate } from '/imports/helpers/date';
import { getUserFullNameOrEmail } from '/imports/share/helpers';
import { getReceivers } from '../../problems/helpers';


export default {
  field: 'scores',
  logs: [
    {
      message: {
        [ChangesKinds.ITEM_ADDED]:
          'Risk score added: value - {{{value}}}, scored by {{{scoredBy}}} on {{{date}}}',
        [ChangesKinds.ITEM_REMOVED]:
          'Risk score removed: value - {{{value}}}, scored by {{{scoredBy}}} on {{{date}}}',
      },
    },
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.ITEM_ADDED]:
          '{{{userName}}} added score to {{{docDesc}}} {{{docName}}}: value - {{{value}}}, scored by {{{scoredBy}}} on {{{date}}}',
        [ChangesKinds.ITEM_REMOVED]:
          '{{{userName}}} removed score from {{{docDesc}}} {{{docName}}}: value - {{{value}}}, scored by {{{scoredBy}}} on {{{date}}}',
      },
    },
  ],
  data({ diffs: { scores }, organization }) {
    const { item: { value, scoredAt, scoredBy } } = scores;
    const { timezone } = organization;

    return {
      value,
      date: () => getPrettyTzDate(scoredAt, timezone),
      scoredBy: () => getUserFullNameOrEmail(scoredBy),
    };
  },
  receivers({ newDoc, user }) {
    return getReceivers(newDoc, user);
  },
};
