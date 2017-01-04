import { ChangesKinds } from '../../../utils/changes-kinds';
import { getUserFullNameOrEmail } from '../../../utils/helpers';


export default {
  field: 'updateOfStandards.completedBy',
  logs: [
    {
      shouldCreateLog({ diffs }) {
        return !diffs['updateOfStandards.status'];
      },
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'problems.fields.updateOfStandards.completedBy.added',
        [ChangesKinds.FIELD_CHANGED]:
          'problems.fields.updateOfStandards.completedBy.changed',
        [ChangesKinds.FIELD_REMOVED]:
          'problems.fields.updateOfStandards.completedBy.removed',
      },
    },
  ],
  notifications: [],
  data({ diffs }) {
    const { newValue, oldValue } = diffs['updateOfStandards.completedBy'];

    return {
      newValue: () => getUserFullNameOrEmail(newValue),
      oldValue: () => getUserFullNameOrEmail(oldValue),
    };
  },
};
