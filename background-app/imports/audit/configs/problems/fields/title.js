import { ChangesKinds } from '../../../utils/changes-kinds';


export default {
  field: 'title',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]: 'common.fields.title.added',
        [ChangesKinds.FIELD_CHANGED]: 'common.fields.title.changed',
        [ChangesKinds.FIELD_REMOVED]: 'common.fields.title.removed',
      },
    },
  ],
  notifications: [],
  data({ diffs: { title } }) {
    return {
      newValue: () => title.newValue,
      oldValue: () => title.oldValue,
    };
  },
};
