import { ChangesKinds } from '../../../utils/changes-kinds';
import { getUserFullNameOrEmail } from '../../../utils/helpers';
import { getReceivers } from '../helpers';
import ActionWorkflow from '/imports/workflow/ActionWorkflow';


export default {
  field: 'isCompleted',
  logs: [
    {
      shouldCreateLog({ diffs: { completedAt, completedBy } }) {
        return completedAt && completedBy;
      },
      message: {
        [ChangesKinds.FIELD_CHANGED]: 'actions.fields.isCompleted.changed',
      },
    },
  ],
  notifications: [
    {
      shouldSendNotification({ diffs: { completedAt, completedBy } }) {
        return completedAt && completedBy;
      },
      text: {
        [ChangesKinds.FIELD_CHANGED]: 'actions.fields.isCompleted.text.changed',
      },
    },
  ],
  data({ diffs: { isCompleted, completionComments }, newDoc, user }) {
    const auditConfig = this;

    return {
      docDesc: () => auditConfig.docDescription(newDoc),
      docName: () => auditConfig.docName(newDoc),
      completed: () => isCompleted.newValue,
      comments: () => completionComments && completionComments.newValue,
      userName: () => getUserFullNameOrEmail(user),
    };
  },
  receivers({ newDoc, user }) {
    return getReceivers(newDoc, user);
  },
  triggers: [
    function ({ diffs: { completedAt, completedBy }, newDoc: { _id } }) {
      if (completedAt && completedBy) {
        new ActionWorkflow(_id).refreshStatus();
      }
    },
  ],
};
