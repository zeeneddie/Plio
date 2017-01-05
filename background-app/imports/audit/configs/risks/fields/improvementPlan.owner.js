import { ChangesKinds } from '../../../utils/changes-kinds';
import { getUserFullNameOrEmail } from '../../../utils/helpers';


export default {
  field: 'improvementPlan.owner',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'Treatment plan owner set to {{newValue}}',
        [ChangesKinds.FIELD_CHANGED]:
          'Treatment plan owner changed from {{oldValue}} to {{newValue}}',
        [ChangesKinds.FIELD_REMOVED]:
          'Treatment plan owner removed',
      },
    },
  ],
  notifications: [],
  data({ diffs }) {
    const { newValue, oldValue } = diffs['improvementPlan.owner'];

    return {
      newValue: () => getUserFullNameOrEmail(newValue),
      oldValue: () => getUserFullNameOrEmail(oldValue),
    };
  },
};
