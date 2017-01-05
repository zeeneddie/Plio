import { ChangesKinds } from '../../../utils/changes-kinds';
import { getReceivers } from '../helpers';


export default {
  field: 'title',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]: 'Title set to "{{newValue}}"',
        [ChangesKinds.FIELD_CHANGED]: 'Title changed from "{{oldValue}}" to "{{newValue}}"',
        [ChangesKinds.FIELD_REMOVED]: 'Title removed',
      },
    },
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.FIELD_ADDED]:
          '{{userName}} set title of {{{docDesc}}} {{{docName}}} to "{{newValue}}"',
        [ChangesKinds.FIELD_CHANGED]:
          '{{userName}} changed title of {{{docDesc}}} {{{docName}}} from "{{oldValue}}" to "{{newValue}}"',
        [ChangesKinds.FIELD_REMOVED]:
          '{{userName}} removed title of {{{docDesc}}} {{{docName}}}',
      },
    },
  ],
  data({ diffs: { title }, oldDoc, auditConfig }) {
    return {
      docName: auditConfig.docName(oldDoc),
      newValue: title.newValue,
      oldValue: title.oldValue,
    };
  },
  receivers({ newDoc, user }) {
    return getReceivers(newDoc, user);
  },
};
