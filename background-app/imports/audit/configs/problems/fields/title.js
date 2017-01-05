import { ChangesKinds } from '../../../utils/changes-kinds';


export default {
  field: 'title',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'Title set to "{{newValue}}"',
        [ChangesKinds.FIELD_CHANGED]:
          'Title changed from "{{oldValue}}" to "{{newValue}}"',
        [ChangesKinds.FIELD_REMOVED]:
          'Title removed',
      },
    },
  ],
  notifications: [],
  data({ diffs: { title } }) {
    const { newValue, oldValue } = title;
    return { newValue, oldValue };
  },
};
