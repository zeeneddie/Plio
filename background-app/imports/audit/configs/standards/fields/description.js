import { ChangesKinds } from '../../../utils/changes-kinds.js';
import { getUserFullNameOrEmail } from '../../../utils/helpers.js';
import { getReceivers } from '../helpers.js';


export default {
  field: 'description',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]: 'standards.fields.description.added',
        [ChangesKinds.FIELD_CHANGED]: 'standards.fields.description.changed',
        [ChangesKinds.FIELD_REMOVED]: 'standards.fields.description.removed',
      }
    }
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.FIELD_ADDED]: 'standards.fields.description.text.added',
        [ChangesKinds.FIELD_CHANGED]: 'standards.fields.description.text.changed',
        [ChangesKinds.FIELD_REMOVED]: 'standards.fields.description.text.removed',
      }
    }
  ],
  data({ diffs: { description }, newDoc, user }) {
    const auditConfig = this;

    return {
      docDesc: () => auditConfig.docDescription(newDoc),
      docName: () => auditConfig.docName(newDoc),
      userName: () => getUserFullNameOrEmail(user),
    };
  },
  receivers: getReceivers
};
