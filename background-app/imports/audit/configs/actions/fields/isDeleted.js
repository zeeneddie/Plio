import { ChangesKinds } from '../../../utils/changes-kinds';
import { getUserFullNameOrEmail } from '../../../utils/helpers';
import { getReceivers } from '../helpers';
import ActionWorkflow from '/imports/workflow/ActionWorkflow';


export default {
  field: 'isDeleted',
  logs: [
    {
      shouldCreateLog({ diffs: { deletedAt, deletedBy } }) {
        return deletedAt && deletedBy;
      },
      message: {
        [ChangesKinds.FIELD_CHANGED]: 'actions.fields.isDeleted.changed',
      },
    },
  ],
  notifications: [
    {
      shouldSendNotification({ diffs: { deletedAt, deletedBy } }) {
        return deletedAt && deletedBy;
      },
      text: {
        [ChangesKinds.FIELD_CHANGED]: 'actions.fields.isDeleted.text.changed',
      },
      title: {
        [ChangesKinds.FIELD_CHANGED]: 'actions.fields.isDeleted.title.changed',
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
  receivers({ newDoc, user }) {
    return getReceivers(newDoc, user);
  },
  triggers: [
    function ({ newDoc: { _id } }) {
      new ActionWorkflow(_id).refreshStatus();
    },
  ],
};
