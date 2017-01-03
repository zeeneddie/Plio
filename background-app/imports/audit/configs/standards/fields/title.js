import { ChangesKinds } from '../../../utils/changes-kinds.js';
import { getUserFullNameOrEmail } from '../../../utils/helpers.js';
import { getReceivers } from '../helpers.js';


export default {
  field: 'title',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]: 'standards.fields.title.added',
        [ChangesKinds.FIELD_CHANGED]: 'standards.fields.title.changed',
        [ChangesKinds.FIELD_REMOVED]: 'standards.fields.title.removed',
      }
    }
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.FIELD_ADDED]: 'standards.fields.title.text.added',
        [ChangesKinds.FIELD_CHANGED]: 'standards.fields.title.text.changed',
        [ChangesKinds.FIELD_REMOVED]: 'standards.fields.title.text.removed',
      }
    }
  ],
  data({ diffs: { title }, newDoc, oldDoc, user }) {
    const auditConfig = this;

    return {
      docDesc: () => auditConfig.docDescription(newDoc),
      docName: () => auditConfig.docName(oldDoc),
      userName: () => getUserFullNameOrEmail(user),
      newValue: () => title.newValue,
      oldValue: () => title.oldValue
    };
  },
  receivers: getReceivers
};
