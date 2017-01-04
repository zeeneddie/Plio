import { ChangesKinds } from '../../../utils/changes-kinds';


export default {
  field: 'review.comments',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]: 'risks.fields.review.comments.added',
        [ChangesKinds.FIELD_CHANGED]: 'risks.fields.review.comments.changed',
        [ChangesKinds.FIELD_REMOVED]: 'risks.fields.review.comments.removed',
      },
    },
  ],
  notifications: [],
};
