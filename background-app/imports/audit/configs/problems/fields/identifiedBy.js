import { ChangesKinds } from '../../../utils/changes-kinds.js';
import { getUserFullNameOrEmail } from '../../../utils/helpers.js';


export default {
  field: 'identifiedBy',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]: 'problems.fields.identifiedBy.added',
        [ChangesKinds.FIELD_CHANGED]: 'problems.fields.identifiedBy.changed',
        [ChangesKinds.FIELD_REMOVED]: 'problems.fields.identifiedBy.removed',
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
