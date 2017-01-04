import { ChangesKinds } from '../../../utils/changes-kinds';
import { getUserFullNameOrEmail } from '../../../utils/helpers';
import { getReceivers } from '../helpers';


export default {
  field: 'isDeleted',
  logs: [
    {
      shouldCreateLog({ diffs: { deletedAt, deletedBy } }) {
        return deletedAt && deletedBy;
      },
      message: {
        [ChangesKinds.FIELD_CHANGED]: 'common.fields.isDeleted.changed',
      },
    },
  ],
  notifications: [
    {
      shouldSendNotification({ diffs: { deletedAt, deletedBy } }) {
        return deletedAt && deletedBy;
      },
      text: {
        [ChangesKinds.FIELD_CHANGED]:
          'common.fields.isDeleted.text.changed',
      },
      title: {
        [ChangesKinds.FIELD_CHANGED]:
          'common.fields.isDeleted.title.changed',
      },
    },
  ],
  data({ diffs: { isDeleted }, newDoc, user }) {
    const auditConfig = this;

    return {
      docDesc: () => auditConfig.docDescription(newDoc),
      docName: () => auditConfig.docName(newDoc),
      userName: () => getUserFullNameOrEmail(user),
      deleted: () => isDeleted.newValue,
    };
  },
  receivers: getReceivers,
};
