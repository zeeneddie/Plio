import { ChangesKinds } from '../../../utils/changes-kinds.js';
import { getUserFullNameOrEmail } from '../../../utils/helpers.js';


export default {
  field: 'analysis.executor',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]: 'problems.fields.analysis.executor.added',
        [ChangesKinds.FIELD_CHANGED]: 'problems.fields.analysis.executor.changed',
        [ChangesKinds.FIELD_REMOVED]: 'problems.fields.analysis.executor.removed',
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
