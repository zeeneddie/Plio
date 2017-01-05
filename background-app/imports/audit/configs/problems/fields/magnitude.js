import { ChangesKinds } from '../../../utils/changes-kinds';


export default {
  field: 'magnitude',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'Magnitude set to "{{newValue}}"',
        [ChangesKinds.FIELD_CHANGED]:
          'Magnitude changed from "{{oldValue}}" to "{{newValue}}"',
        [ChangesKinds.FIELD_REMOVED]:
          'Magnitude removed',
      },
    },
  ],
  notifications: [],
  data({ diffs: { magnitude: { newValue, oldValue } } }) {
    return { newValue, oldValue };
  },
};
