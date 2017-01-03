import { ChangesKinds } from '../../../utils/changes-kinds.js';
import { getUserFullNameOrEmail } from '../../../utils/helpers.js';
import { getReceivers } from '../helpers.js';


export default {
  field: 'name',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]: 'organizations.fields.name.added',
        [ChangesKinds.FIELD_CHANGED]: 'organizations.fields.name.changed',
        [ChangesKinds.FIELD_REMOVED]: 'organizations.fields.name.removed',
      }
    }
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.FIELD_ADDED]: 'organizations.fields.name.text.added',
        [ChangesKinds.FIELD_CHANGED]: 'organizations.fields.name.text.changed',
        [ChangesKinds.FIELD_REMOVED]: 'organizations.fields.name.text.removed',
      }
    }
  ],
  data({ diffs: { name }, oldDoc, user }) {
    const { newValue, oldValue } = name;
    const auditConfig = this;

    return {
      docDesc: () => auditConfig.docDescription(oldDoc),
      docName: () => auditConfig.docName(oldDoc),
      userName: () => getUserFullNameOrEmail(user),
      newValue: () => newValue,
      oldValue: () => oldValue
    };
  },
  receivers: getReceivers
};
