import { ChangesKinds } from '../../../utils/changes-kinds.js';
import { getUserFullNameOrEmail } from '../../../utils/helpers.js';


export default {
  field: 'updateOfStandards.executor',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'Update of standards executor set to {{newValue}}',
        [ChangesKinds.FIELD_CHANGED]:
          'Update of standards executor changed from {{oldValue}} to {{newValue}}',
        [ChangesKinds.FIELD_REMOVED]:
          'Update of standards executor removed'
      }
    }
  ],
  notifications: [],
  data({ diffs }) {
    const { newValue, oldValue } = diffs['updateOfStandards.executor'];

    return {
      newValue: () => getUserFullNameOrEmail(newValue),
      oldValue: () => getUserFullNameOrEmail(oldValue)
    };
  }
};
