import { ChangesKinds } from '../../../utils/changes-kinds.js';
import { getUserFullNameOrEmail } from '../../../utils/helpers.js';


export default {
  field: 'improvementPlan.owner',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'Improvement plan owner set to {{newValue}}',
        [ChangesKinds.FIELD_CHANGED]:
          'Improvement plan owner changed from {{oldValue}} to {{newValue}}',
        [ChangesKinds.FIELD_REMOVED]:
          'Improvement plan owner removed'
      }
    }
  ],
  notifications: [],
  data({ diffs }) {
    const { newValue, oldValue } = diffs['improvementPlan.owner'];

    return {
      newValue: () => getUserFullNameOrEmail(newValue),
      oldValue: () => getUserFullNameOrEmail(oldValue)
    };
  }
};
