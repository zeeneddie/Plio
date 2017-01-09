import { ChangesKinds } from '../../../utils/changes-kinds';
import { getReceivers } from '../../problems/helpers';


export default {
  field: 'ref.text',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_CHANGED]:
          'Help desk ref ID changed from "{{oldValue}}" to "{{newValue}}"',
      },
    },
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.FIELD_CHANGED]:
          '{{userName}} changed help desk ref ID of {{{docDesc}}} {{{docName}}} from "{{oldValue}}" to "{{newValue}}"',
      },
    },
  ],
  data({ diffs }) {
    const { newValue, oldValue } = diffs['ref.text'];
    return { newValue, oldValue };
  },
  receivers({ newDoc, user }) {
    return getReceivers(newDoc, user);
  },
};
