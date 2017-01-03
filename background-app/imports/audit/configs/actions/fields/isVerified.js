import { ChangesKinds } from '../../../utils/changes-kinds';
import { getUserFullNameOrEmail } from '../../../utils/helpers';
import { getReceivers } from '../helpers';
import ActionWorkflow from '/imports/workflow/ActionWorkflow';


export default {
  field: 'isVerified',
  logs: [
    {
      shouldCreateLog({ diffs: { verifiedAt, verifiedBy } }) {
        return verifiedAt && verifiedBy;
      },
      message: {
        [ChangesKinds.FIELD_CHANGED]: 'actions.fields.isVerified.changed',
      },
    },
  ],
  notifications: [
    {
      shouldSendNotification({ diffs: { verifiedAt, verifiedBy } }) {
        return verifiedAt && verifiedBy;
      },
      text: {
        [ChangesKinds.FIELD_CHANGED]: 'actions.fields.isVerified.text.changed',
      },
    },
  ],
  data({ diffs, newDoc, user }) {
    const { isVerified, isVerifiedAsEffective, verificationComments } = diffs;
    const auditConfig = this;

    return {
      docDesc: () => auditConfig.docDescription(newDoc),
      docName: () => auditConfig.docName(newDoc),
      verified: () => isVerified.newValue,
      verifiedAsEffective: () => isVerifiedAsEffective && isVerifiedAsEffective.newValue,
      comments: () => verificationComments && verificationComments.newValue,
      userName: () => getUserFullNameOrEmail(user),
    };
  },
  receivers({ newDoc, user }) {
    return getReceivers(newDoc, user);
  },
  triggers: [
    function ({ diffs: { verifiedAt, verifiedBy }, newDoc: { _id } }) {
      if (verifiedAt && verifiedBy) {
        new ActionWorkflow(_id).refreshStatus();
      }
    },
  ],
};
