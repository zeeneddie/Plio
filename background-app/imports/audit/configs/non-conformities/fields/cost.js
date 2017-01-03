import { ChangesKinds } from '../../../utils/changes-kinds.js';


export default {
  field: 'cost',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]: 'non-conformities.fields.cost.added',
        [ChangesKinds.FIELD_CHANGED]: 'non-conformities.fields.cost.changed',
        [ChangesKinds.FIELD_REMOVED]: 'non-conformities.fields.cost.removed',
      }
    }
  ],
  notifications: [],
  data({ diffs: { cost: { newValue, oldValue } } }) {
    return {
      newValue: () => newValue,
      oldValue: () => oldValue
    };
  }
};
