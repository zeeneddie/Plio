import { ChangesKinds } from '../../../utils/changes-kinds';
import { getUserFullNameOrEmail } from '../../../utils/helpers';
import { getReceivers } from '../helpers';

export default {
  field: 'notes',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]: 'actions.fields.notes.added',
        [ChangesKinds.FIELD_CHANGED]: 'actions.fields.notes.changed',
        [ChangesKinds.FIELD_REMOVED]: 'actions.fields.notes.removed',
      },
    },
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.FIELD_ADDED]: 'actions.fields.notes.text.added',
        [ChangesKinds.FIELD_CHANGED]: 'actions.fields.notes.text.changed',
        [ChangesKinds.FIELD_REMOVED]: 'actions.fields.notes.text.removed',
      },
    },
  ],
  data({ newDoc, user }) {
    const auditConfig = this;

    return {
      docDesc: () => auditConfig.docDescription(newDoc),
      docName: () => auditConfig.docName(newDoc),
      userName: () => getUserFullNameOrEmail(user),
    };
  },
  receivers({ newDoc, user }) {
    return getReceivers(newDoc, user);
  },
};
