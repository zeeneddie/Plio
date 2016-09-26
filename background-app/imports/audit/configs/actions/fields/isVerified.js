import { ChangesKinds } from '../../../utils/changes-kinds.js';
import { getUserFullNameOrEmail } from '../../../utils/helpers.js';
import { getReceivers } from '../helpers.js';


export default {
  field: 'isVerified',
  logs: [
    {
      shouldCreateLog({ diffs: { verifiedAt, verifiedBy } }) {
        return verifiedAt && verifiedBy;
      },
      message: {
        [ChangesKinds.FIELD_CHANGED]:
          '{{#if verified}}' +
            '{{#if verifiedAsEffective}}' +
              'Action verified as effective{{#if comments}}: {{comments}}{{/if}}' +
            '{{else}}' +
              'Action failed verification{{#if comments}}: {{comments}}{{/if}}' +
            '{{/if}}' +
          '{{else}}' +
            'Action verification canceled' +
          '{{/if}}'
      }
    }
  ],
  notifications: [
    {
      shouldSendNotification({ diffs: { verifiedAt, verifiedBy } }) {
        return verifiedAt && verifiedBy;
      },
      text: {
        [ChangesKinds.FIELD_CHANGED]:
          '{{#if verified}}' +
            '{{#if verifiedAsEffective}}' +
              '{{userName}} verified {{{docDesc}}} as effective' +
              '{{#if comments}} with following comments: {{comments}}{{/if}}' +
            '{{else}}' +
              '{{userName}} failed verification of {{{docDesc}}}' +
              '{{#if comments}} with following comments: {{comments}}{{/if}}' +
            '{{/if}}' +
          '{{else}}' +
            '{{userName}} canceled verification of {{{docDesc}}}' +
          '{{/if}}'
      }
    }
  ],
  data({ diffs, newDoc, user }) {
    const { isVerified, isVerifiedAsEffective, verificationComments } = diffs;
    const auditConfig = this;

    return {
      docDesc: () => auditConfig.docDescription(newDoc),
      verified: () => isVerified.newValue,
      verifiedAsEffective: () => isVerifiedAsEffective && isVerifiedAsEffective.newValue,
      comments: () => verificationComments && verificationComments.newValue,
      userName: () => getUserFullNameOrEmail(user)
    };
  },
  receivers: getReceivers
};
