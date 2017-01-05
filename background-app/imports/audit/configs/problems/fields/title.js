import { ChangesKinds } from '../../../utils/changes-kinds.js';


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
          'Title removed'
      }
    }
  ],
  notifications: [],
  data({ diffs: { title } }) {
    return {
      newValue: () => title.newValue,
      oldValue: () => title.oldValue
    };
  }
};
