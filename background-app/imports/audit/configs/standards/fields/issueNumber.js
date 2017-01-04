import { ChangesKinds } from '../../../utils/changes-kinds';
import { getUserFullNameOrEmail } from '../../../utils/helpers';
import { getReceivers } from '../helpers';


export default {
  field: 'issueNumber',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]: 'standards.fields.issueNumber.added',
        [ChangesKinds.FIELD_CHANGED]: 'standards.fields.issueNumber.changed',
        [ChangesKinds.FIELD_REMOVED]: 'standards.fields.issueNumber.removed',
      },
    },
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.FIELD_ADDED]: 'standards.fields.issueNumber.text.added',
        [ChangesKinds.FIELD_CHANGED]: 'standards.fields.issueNumber.text.changed',
        [ChangesKinds.FIELD_REMOVED]: 'standards.fields.issueNumber.text.removed',
      },
    },
  ],
  data({ diffs: { issueNumber }, newDoc, user }) {
    const { newValue, oldValue } = issueNumber;
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
