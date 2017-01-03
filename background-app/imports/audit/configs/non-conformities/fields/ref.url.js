import { ChangesKinds } from '../../../utils/changes-kinds.js';


export default {
  field: 'ref.url',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_CHANGED]: 'non-conformities.fields.ref.url.changed',
      }
    }
  ],
  notifications: [],
  data({ diffs }) {
    const { newValue, oldValue } = diffs['ref.url'];

    return {
      newValue: () => newValue,
      oldValue: () => oldValue
    };
  }
};
