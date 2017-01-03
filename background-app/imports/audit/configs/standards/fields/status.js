import { StandardStatuses } from '/imports/share/constants.js';
import { ChangesKinds } from '../../../utils/changes-kinds.js';
import { getUserFullNameOrEmail } from '../../../utils/helpers.js';
import { getReceivers } from '../helpers.js';


export default {
  field: 'status',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]: 'standards.fields.status.added',
        [ChangesKinds.FIELD_CHANGED]: 'standards.fields.status.changed',
        [ChangesKinds.FIELD_REMOVED]: 'standards.fields.status.removed',
      }
    }
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.FIELD_ADDED]: 'standards.fields.status.text.added',
        [ChangesKinds.FIELD_CHANGED]: 'standards.fields.status.text.changed',
        [ChangesKinds.FIELD_REMOVED]: 'standards.fields.status.text.removed',
      }
    }
  ],
  data({ diffs: { status }, newDoc, user }) {
    const { newValue, oldValue } = status;
    const auditConfig = this;

    return {
      docDesc: () => auditConfig.docDescription(newDoc),
      docName: () => auditConfig.docName(newDoc),
      userName: () => getUserFullNameOrEmail(user),
      newValue: () => StandardStatuses[newValue],
      oldValue: () => StandardStatuses[oldValue]
    };
  },
  receivers: getReceivers
};
