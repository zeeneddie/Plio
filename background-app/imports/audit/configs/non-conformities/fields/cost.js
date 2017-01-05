import { ChangesKinds } from '../../../utils/changes-kinds';


export default {
  field: 'cost',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'Approx cost per occurrence set to "{{newValue}}"',
        [ChangesKinds.FIELD_CHANGED]:
          'Approx cost per occurrence changed from "{{oldValue}}" to "{{newValue}}"',
        [ChangesKinds.FIELD_REMOVED]:
          'Approx cost per occurrence removed',
      },
    },
  ],
  notifications: [],
  data({ diffs: { cost: { newValue, oldValue } } }) {
    return { newValue, oldValue };
  },
};
