import { ChangesKinds } from '../../../utils/changes-kinds';


export default {
  field: 'ref',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]: 'non-conformities.fields.ref.added',
        [ChangesKinds.FIELD_REMOVED]: 'non-conformities.fields.ref.removed',
      },
    },
  ],
  notifications: [],
  data({ diffs: { ref: { newValue, oldValue } } }) {
    const { text, url } = newValue || oldValue;

    return {
      text,
      url,
    };
  },
};
