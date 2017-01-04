import { ChangesKinds } from '../../../utils/changes-kinds';
import { getUserFullNameOrEmail } from '../../../utils/helpers';


export default {
  field: 'improvementPlan.owner',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'common.fields.improvementPlan.owner.added',
        [ChangesKinds.FIELD_CHANGED]:
          'common.fields.improvementPlan.owner.changed',
        [ChangesKinds.FIELD_REMOVED]:
          'common.fields.improvementPlan.owner.removed',
      },
    },
  ],
  notifications: [],
  data({ diffs }) {
    const { newValue, oldValue } = diffs['improvementPlan.owner'];

    return {
      newValue: () => getUserFullNameOrEmail(newValue),
      oldValue: () => getUserFullNameOrEmail(oldValue),
    };
  },
};
