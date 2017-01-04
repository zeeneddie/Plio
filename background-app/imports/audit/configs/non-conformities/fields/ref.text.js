import { ChangesKinds } from '../../../utils/changes-kinds';


export default {
  field: 'ref.text',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_CHANGED]: 'non-conformities.fields.ref.text.changed',
      },
    },
  ],
  notifications: [],
  data({ diffs }) {
    const { newValue, oldValue } = diffs['ref.text'];

    return {
      newValue: () => newValue,
      oldValue: () => oldValue,
    };
  },
};
