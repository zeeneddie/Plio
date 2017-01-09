import { ChangesKinds } from '../../../utils/changes-kinds';


export default {
  logs: {
    default: {
      message: {
        [ChangesKinds.FIELD_ADDED]: 'Title set to "{{newValue}}"',
        [ChangesKinds.FIELD_CHANGED]: 'Title changed from "{{oldValue}}" to "{{newValue}}"',
        [ChangesKinds.FIELD_REMOVED]: 'Title removed',
      },
    },
  },
  notifications: {
    default: {
      text: {
        [ChangesKinds.FIELD_ADDED]:
          '{{userName}} set title of {{{docDesc}}} {{{docName}}} to "{{newValue}}"',
        [ChangesKinds.FIELD_CHANGED]:
          '{{userName}} changed title of {{{docDesc}}} {{{docName}}} from "{{oldValue}}" to "{{newValue}}"',
        [ChangesKinds.FIELD_REMOVED]:
          '{{userName}} removed title of {{{docDesc}}} {{{docName}}}',
      },
    },
  },
  data({ diffs: { title }, oldDoc, auditConfig }) {
    return {
      docName: auditConfig.docName(oldDoc),
      newValue: title.newValue,
      oldValue: title.oldValue,
    };
  },
};
