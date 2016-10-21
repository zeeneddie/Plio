import { ChangesKinds } from '../../../utils/changes-kinds.js';
import { getUserFullNameOrEmail } from '../../../utils/helpers.js';


export default {
  field: 'analysis.executor',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'Root cause analysis executor set to {{newValue}}',
        [ChangesKinds.FIELD_CHANGED]:
          'Root cause analysis executor changed from {{oldValue}} to {{newValue}}',
        [ChangesKinds.FIELD_REMOVED]:
          'Root cause analysis executor removed'
      }
    }
  ],
  notifications: [],
  data({ diffs }) {
    const { newValue, oldValue } = diffs['analysis.executor'];

    return {
      newValue: () => getUserFullNameOrEmail(newValue),
      oldValue: () => getUserFullNameOrEmail(oldValue)
    };
  }
};
