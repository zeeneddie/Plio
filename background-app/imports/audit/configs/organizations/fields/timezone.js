import { ChangesKinds } from '../../../utils/changes-kinds';
import { getUserFullNameOrEmail } from '../../../utils/helpers';
import { getReceivers } from '../helpers';


export default {
  field: 'timezone',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]: 'organizations.fields.timezone.added',
        [ChangesKinds.FIELD_CHANGED]: 'organizations.fields.timezone.changed',
        [ChangesKinds.FIELD_REMOVED]: 'organizations.fields.timezone.removed',
      },
    },
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.FIELD_ADDED]: 'organizations.fields.timezone.text.added',
        [ChangesKinds.FIELD_CHANGED]: 'organizations.fields.timezone.text.changed',
        [ChangesKinds.FIELD_REMOVED]: 'organizations.fields.timezone.text.removed',
      },
    },
  ],
  data({ diffs: { timezone }, newDoc, user }) {
    const { newValue, oldValue } = timezone;
    const auditConfig = this;

    return {
      docDesc: () => auditConfig.docDescription(newDoc),
      docName: () => auditConfig.docName(newDoc),
      userName: () => getUserFullNameOrEmail(user),
      newValue: () => newValue,
      oldValue: () => oldValue,
    };
  },
  receivers: getReceivers,
};
