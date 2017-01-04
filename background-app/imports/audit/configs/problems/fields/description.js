import { ChangesKinds } from '../../../utils/changes-kinds';


export default {
  field: 'description',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]: 'common.fields.description.added',
        [ChangesKinds.FIELD_CHANGED]: 'common.fields.description.changed',
        [ChangesKinds.FIELD_REMOVED]: 'common.fields.description.removed',
      },
    },
  ],
  notifications: [],
  data() { },
};
