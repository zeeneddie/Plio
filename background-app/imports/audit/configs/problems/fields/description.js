import { ChangesKinds } from '../../../utils/changes-kinds.js';


export default {
  field: 'description',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]: 'problems.fields.description.added',
        [ChangesKinds.FIELD_CHANGED]: 'problems.fields.description.changed',
        [ChangesKinds.FIELD_REMOVED]: 'problems.fields.description.removed',
      }
    }
  ],
  notifications: [],
  data() { }
};
