import { ChangesKinds } from '../../../utils/changes-kinds.js';


export default {
  field: 'ref.url',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_CHANGED]:
          'Help desk ref URL changed from "{{oldValue}}" to "{{newValue}}"'
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
