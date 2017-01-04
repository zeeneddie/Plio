import { ChangesKinds } from '../../../utils/changes-kinds';
import { getUserFullNameOrEmail } from '../../../utils/helpers';


export default {
  field: 'analysis.completedBy',
  logs: [
    {
      shouldCreateLog({ diffs }) {
        return !diffs['analysis.status'];
      },
      message: {
        [ChangesKinds.FIELD_ADDED]: 'problems.fields.analysis.completedBy.added',
        [ChangesKinds.FIELD_CHANGED]: 'problems.fields.analysis.completedBy.changed',
        [ChangesKinds.FIELD_REMOVED]: 'problems.fields.analysis.completedBy.removed',
      },
    },
  ],
  notifications: [],
  data({ diffs }) {
    const { newValue, oldValue } = diffs['analysis.completedBy'];

    return {
      newValue: () => getUserFullNameOrEmail(newValue),
      oldValue: () => getUserFullNameOrEmail(oldValue),
    };
  },
};
