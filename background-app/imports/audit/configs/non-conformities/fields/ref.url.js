import { ChangesKinds } from '../../../utils/changes-kinds';


export default {
  field: 'ref.url',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_CHANGED]: 'non-conformities.fields.ref.url.changed',
      },
    },
  ],
  notifications: [],
  data({ diffs }) {
    const { newValue, oldValue } = diffs['ref.url'];

    return {
      newValue: () => newValue,
      oldValue: () => oldValue,
    };
  },
};
