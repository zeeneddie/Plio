import { ChangesKinds } from '../../../utils/changes-kinds.js';


export default {
  field: 'title',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]: 'problems.fields.title.added',
        [ChangesKinds.FIELD_CHANGED]: 'problems.fields.title.changed',
        [ChangesKinds.FIELD_REMOVED]: 'problems.fields.title.removed',
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
