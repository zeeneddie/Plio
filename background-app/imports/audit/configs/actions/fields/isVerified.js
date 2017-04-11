import { ChangesKinds } from '../../../utils/changes-kinds';
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
        [ChangesKinds.FIELD_CHANGED]:
          '{{#if verified}}' +
            '{{#if verifiedAsEffective}}' +
              'Action verified as effective{{#if comments}}: {{{comments}}}{{/if}}' +
            '{{else}}' +
              'Action failed verification{{#if comments}}: {{{comments}}}{{/if}}' +
            '{{/if}}' +
          '{{else}}' +
            'Action verification canceled' +
          '{{/if}}',
      },
    },
  ],
  notifications: [
    {
      shouldSendNotification({ diffs: { verifiedAt, verifiedBy } }) {
        return verifiedAt && verifiedBy;
      },
      sendBoth: true,
      text: {
        [ChangesKinds.FIELD_CHANGED]:
          '{{#if verified}}' +
            '{{#if verifiedAsEffective}}' +
              '{{{userName}}} verified {{{docDesc}}} {{{docName}}} as effective' +
              '{{#if comments}} with following comments: {{{comments}}}{{/if}}' +
            '{{else}}' +
              '{{{userName}}} failed verification of {{{docDesc}}} {{{docName}}}' +
              '{{#if comments}} with following comments: {{{comments}}}{{/if}}' +
            '{{/if}}' +
          '{{else}}' +
            '{{{userName}}} canceled verification of {{{docDesc}}} {{{docName}}}' +
          '{{/if}}',
      },
    },
  ],
  data({ diffs }) {
    const { isVerified, isVerifiedAsEffective, verificationComments } = diffs;

    return {
      verified: isVerified.newValue,
      verifiedAsEffective: isVerifiedAsEffective && isVerifiedAsEffective.newValue,
      comments: verificationComments && verificationComments.newValue,
    };
  },
  receivers({ newDoc, user }) {
    return getReceivers(newDoc, user);
  },
  trigger({ diffs, newDoc }) {
    if (diffs.verifiedAt && diffs.verifiedBy) {
      new ActionWorkflow(newDoc._id).refreshStatus();
    }
  },
};
