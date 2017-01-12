import { ChangesKinds } from '../../../utils/changes-kinds';
import { getReceivers } from '../../problems/helpers';


export default {
  field: 'ref.url',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_CHANGED]:
          'Help desk ref URL changed from "{{{oldValue}}}" to "{{{newValue}}}"',
      },
    },
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.FIELD_CHANGED]:
          '{{{userName}}} changed help desk ref url of {{{docDesc}}} {{{docName}}} from "{{{oldValue}}}" to "{{{newValue}}}"',
      },
    },
  ],
  data({ diffs }) {
    const { newValue, oldValue } = diffs['ref.url'];
    return { newValue, oldValue };
  },
  receivers({ newDoc, user }) {
    return getReceivers(newDoc, user);
  },
};
