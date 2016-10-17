import { ChangesKinds } from '../../../utils/changes-kinds.js';
import { getUserFullNameOrEmail } from '../../../utils/helpers.js';


export default {
  field: 'analysis.completedBy',
  logs: [
    {
      shouldCreateLog({ diffs }) {
        return !diffs['analysis.status'];
      },
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'Root cause analysis completed by set to {{newValue}}',
        [ChangesKinds.FIELD_CHANGED]:
          'Root cause analysis completed by changed from {{oldValue}} to {{newValue}}',
        [ChangesKinds.FIELD_REMOVED]:
          'Root cause analysis completed by removed'
      }
    }
  ],
  notifications: [],
  data({ diffs }) {
    const { newValue, oldValue } = diffs['analysis.completedBy'];

    return {
      newValue: () => getUserFullNameOrEmail(newValue),
      oldValue: () => getUserFullNameOrEmail(oldValue)
    };
  }
};
