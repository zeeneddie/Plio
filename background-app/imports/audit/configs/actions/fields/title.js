import { ChangesKinds } from '../../../utils/changes-kinds';
import { getUserFullNameOrEmail } from '../../../utils/helpers';
import { getReceivers } from '../helpers';


export default {
  field: 'title',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]: 'common.fields.title.added',
        [ChangesKinds.FIELD_CHANGED]: 'common.fields.title.changed',
        [ChangesKinds.FIELD_REMOVED]: 'common.fields.title.removed',
      },
    },
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.FIELD_ADDED]: 'common.fields.title.text.added',
        [ChangesKinds.FIELD_CHANGED]: 'common.fields.title.text.changed',
        [ChangesKinds.FIELD_REMOVED]: 'common.fields.title.text.removed',
      },
    },
  ],
  data({ diffs: { title }, newDoc, oldDoc, user }) {
    const auditConfig = this;

    return {
      docDesc: () => auditConfig.docDescription(newDoc),
      docName: () => auditConfig.docName(oldDoc),
      userName: () => getUserFullNameOrEmail(user),
      newValue: () => title.newValue,
      oldValue: () => title.oldValue,
    };
  },
  receivers({ newDoc, user }) {
    return getReceivers(newDoc, user);
  },
};
