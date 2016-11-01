import { ChangesKinds } from '../../../utils/changes-kinds.js';


export default {
  field: 'ref.text',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_CHANGED]:
          'Help desk ref ID changed from "{{oldValue}}" to "{{newValue}}"'
      }
    }
  ],
  notifications: [],
  data({ diffs }) {
    const { newValue, oldValue } = diffs['ref.text'];

    return {
      newValue: () => newValue,
      oldValue: () => oldValue
    };
  }
};