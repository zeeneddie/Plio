import { ChangesKinds } from '../../../utils/changes-kinds';


export default {
  field: 'magnitude',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]: 'problems.fields.magnitude.added',
        [ChangesKinds.FIELD_CHANGED]: 'problems.fields.magnitude.changed',
        [ChangesKinds.FIELD_REMOVED]: 'problems.fields.magnitude.removed',
      },
    },
  ],
  notifications: [],
  data({ diffs: { magnitude: { newValue, oldValue } } }) {
    return {
      newValue: () => newValue,
      oldValue: () => oldValue,
    };
  },
};
