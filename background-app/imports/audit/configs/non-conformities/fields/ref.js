import { ChangesKinds } from '../../../utils/changes-kinds';
import { getReceivers } from '../../problems/helpers';


export default {
  field: 'ref',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'Help desk ref added: ID - {{text}}, URL: {{url}}',
        [ChangesKinds.FIELD_REMOVED]:
          'Help desk ref removed: ID - {{text}}, URL: {{url}}',
      },
    },
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.FIELD_ADDED]:
          '{{userName}} added help desk ref to {{{docDesc}}} {{{docName}}}: ID - {{text}}, URL: {{url}}',
        [ChangesKinds.FIELD_REMOVED]:
          '{{userName}} removed help desk ref of {{{docDesc}}} {{{docName}}}: ID - {{text}}, URL: {{url}}',
      },
    },
  ],
  data({ diffs: { ref: { newValue, oldValue } } }) {
    const { text, url } = newValue || oldValue;
    return { text, url };
  },
  receivers({ newDoc, user }) {
    return getReceivers(newDoc, user);
  },
};
