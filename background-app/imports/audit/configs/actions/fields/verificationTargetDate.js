import { ChangesKinds } from '../../../utils/changes-kinds';
import { getUserFullNameOrEmail, getPrettyOrgDate } from '../../../utils/helpers';
import { getReceivers } from '../helpers';
import ActionWorkflow from '/imports/workflow/ActionWorkflow';


export default {
  field: 'verificationTargetDate',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]: 'actions.fields.verificationTargetDate.added',
        [ChangesKinds.FIELD_CHANGED]: 'actions.fields.verificationTargetDate.changed',
        [ChangesKinds.FIELD_REMOVED]: 'actions.fields.verificationTargetDate.removed',
      },
    },
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.FIELD_ADDED]: 'actions.fields.verificationTargetDate.text.added',
        [ChangesKinds.FIELD_CHANGED]: 'actions.fields.verificationTargetDate.text.changed',
        [ChangesKinds.FIELD_REMOVED]: 'actions.fields.verificationTargetDate.text.removed',
      },
    },
  ],
  data({ diffs: { verificationTargetDate }, newDoc, user }) {
    const { newValue, oldValue } = verificationTargetDate;
    const auditConfig = this;
    const orgId = () => auditConfig.docOrgId(newDoc);

    return {
      docDesc: () => auditConfig.docDescription(newDoc),
      docName: () => auditConfig.docName(newDoc),
      userName: () => getUserFullNameOrEmail(user),
      newValue: () => getPrettyOrgDate(newValue, orgId()),
      oldValue: () => getPrettyOrgDate(oldValue, orgId()),
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
