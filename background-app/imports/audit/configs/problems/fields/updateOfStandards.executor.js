import { ChangesKinds } from '../../../utils/changes-kinds';
import { getUserFullNameOrEmail } from '../../../utils/helpers';


export default {
  field: 'updateOfStandards.executor',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'problems.fields.updateOfStandards.executor.added',
        [ChangesKinds.FIELD_CHANGED]:
          'problems.fields.updateOfStandards.executor.changed',
        [ChangesKinds.FIELD_REMOVED]:
          'problems.fields.updateOfStandards.executor.removed',
      },
    },
  ],
  notifications: [],
  data({ diffs }) {
    const { newValue, oldValue } = diffs['updateOfStandards.executor'];

    return {
      newValue: () => getUserFullNameOrEmail(newValue),
      oldValue: () => getUserFullNameOrEmail(oldValue),
    };
  },
};
