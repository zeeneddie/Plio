import { ChangesKinds } from '../../../utils/changes-kinds';
import { getReceivers } from '../helpers';


export default {
  field: 'name',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'Name set to "{{{newValue}}}"',
        [ChangesKinds.FIELD_CHANGED]:
          'Name changed from "{{{oldValue}}}" to "{{{newValue}}}"',
        [ChangesKinds.FIELD_REMOVED]:
          'Name removed',
      },
    },
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.FIELD_ADDED]:
          '{{{userName}}} set name of {{{docDesc}}} {{{docName}}} to "{{{newValue}}}"',
        [ChangesKinds.FIELD_CHANGED]:
          '{{{userName}}} changed name of {{{docDesc}}} {{{docName}}} from "{{{oldValue}}}" to "{{{newValue}}}"',
        [ChangesKinds.FIELD_REMOVED]:
          '{{{userName}}} removed name of {{{docDesc}}} {{{docName}}}',
      },
    },
  ],
  data({ diffs: { name }, oldDoc, auditConfig }) {
    const { newValue, oldValue } = name;

    return {
      docName: auditConfig.docName(oldDoc),
      newValue,
      oldValue,
    };
  },
  receivers({ newDoc, user }) {
    return getReceivers(newDoc, user);
  },
};
