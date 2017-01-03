import { ChangesKinds } from '../../../utils/changes-kinds.js';
import { getUserFullNameOrEmail } from '../../../utils/helpers.js';


export default {
  field: 'improvementPlan.owner',
  logs: [
    {
      message: {
        [[ChangesKinds.FIELD_ADDED]:
          'non-conformities.fields.improvementPlan.owner.added',
        [ChangesKinds.FIELD_CHANGED]:
          'non-conformities.fields.improvementPlan.owner.changed',
        [ChangesKinds.FIELD_REMOVED]:
          'non-conformities.fields.improvementPlan.owner.removed',
      }
    }
  ],
  notifications: [],
  data({ diffs }) {
    const { newValue, oldValue } = diffs['improvementPlan.owner'];

    return {
      newValue: () => getUserFullNameOrEmail(newValue),
      oldValue: () => getUserFullNameOrEmail(oldValue)
    };
  }
};
