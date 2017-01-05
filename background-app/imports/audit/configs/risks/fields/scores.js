import { ChangesKinds } from '../../../utils/changes-kinds';
import { getPrettyTzDate, getUserFullNameOrEmail } from '../../../utils/helpers';


export default {
  field: 'scores',
  logs: [
    {
      message: {
        [ChangesKinds.ITEM_ADDED]:
          'Risk score added: value - {{value}}, scored by {{userName}} on {{date}}',
        [ChangesKinds.ITEM_REMOVED]:
          'Risk score removed: value - {{value}}, scored by {{userName}} on {{date}}',
      },
    },
  ],
  notifications: [],
  data({ diffs: { scores }, organization }) {
    const { item: { value, scoredAt, scoredBy } } = scores;
    const { timezone } = organization;

    return {
      value,
      date: () => getPrettyTzDate(scoredAt, timezone),
      userName: () => getUserFullNameOrEmail(scoredBy),
    };
  },
};
