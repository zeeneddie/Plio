import { StandardStatuses } from '/imports/share/constants';
import { ChangesKinds } from '../../../utils/changes-kinds';
import { getUserFullNameOrEmail } from '../../../utils/helpers';
import { getReceivers } from '../helpers';


export default {
  field: 'status',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]: 'standards.fields.status.added',
        [ChangesKinds.FIELD_CHANGED]: 'standards.fields.status.changed',
        [ChangesKinds.FIELD_REMOVED]: 'standards.fields.status.removed',
      },
    },
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.FIELD_ADDED]: 'standards.fields.status.text.added',
        [ChangesKinds.FIELD_CHANGED]: 'standards.fields.status.text.changed',
        [ChangesKinds.FIELD_REMOVED]: 'standards.fields.status.text.removed',
      },
    },
  ],
  data({ diffs: { status }, newDoc, user }) {
    const { newValue, oldValue } = status;
    const auditConfig = this;

    return {
      docDesc: () => auditConfig.docDescription(newDoc),
      docName: () => auditConfig.docName(newDoc),
      userName: () => getUserFullNameOrEmail(user),
      newValue: () => StandardStatuses[newValue],
      oldValue: () => StandardStatuses[oldValue],
    };
  },
  receivers: getReceivers,
};
