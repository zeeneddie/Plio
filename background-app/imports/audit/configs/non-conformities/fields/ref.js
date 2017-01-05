import { ChangesKinds } from '../../../utils/changes-kinds.js';


export default {
  field: 'ref',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'Help desk ref added: ID - {{text}}, URL: {{url}}',
        [ChangesKinds.FIELD_REMOVED]:
          'Help desk ref removed: ID - {{text}}, URL: {{url}}'
      }
    }
  ],
  notifications: [],
  data({ diffs: { ref: { newValue, oldValue } } }) {
    const { text, url } = newValue || oldValue;

    return {
      text: () => text,
      url: () => url
    };
  }
};
