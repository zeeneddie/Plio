import { ChangesKinds } from '../../../utils/changes-kinds';


export default {
  field: 'description',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]: 'Description set',
        [ChangesKinds.FIELD_CHANGED]: 'Description changed',
        [ChangesKinds.FIELD_REMOVED]: 'Description removed',
      },
    },
  ],
  notifications: [],
  data() { },
};
