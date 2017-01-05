import { ChangesKinds } from '../../../utils/changes-kinds';


export default {
  field: 'review.comments',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]: 'Review comments set',
        [ChangesKinds.FIELD_CHANGED]: 'Review comments changed',
        [ChangesKinds.FIELD_REMOVED]: 'Review comments removed',
      },
    },
  ],
  notifications: [],
  data() { },
};
