import { ChangesKinds } from '../../../utils/changes-kinds';


export default {
  field: 'ref.url',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_CHANGED]:
          'Help desk ref URL changed from "{{oldValue}}" to "{{newValue}}"',
      },
    },
  ],
  notifications: [],
  data({ diffs }) {
    const { newValue, oldValue } = diffs['ref.url'];
    return { newValue, oldValue };
  },
};
