import { ChangesKinds } from '../../../utils/changes-kinds.js';
import { getUserFullNameOrEmail } from '../../../utils/helpers.js';


export default {
  field: 'identifiedBy',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'Identified by set to {{newValue}}',
        [ChangesKinds.FIELD_CHANGED]:
          'Identified by changed from {{oldValue}} to {{newValue}}',
        [ChangesKinds.FIELD_REMOVED]:
          'Identified by removed'
      }
    }
  ],
  notifications: [],
  data({ diffs: { identifiedBy }, newDoc }) {
    const { newValue, oldValue } = identifiedBy;

    return {
      newValue: () => getUserFullNameOrEmail(newValue),
      oldValue: () => getUserFullNameOrEmail(oldValue)
    };
  }
};
