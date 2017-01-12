import { Discussions } from '/imports/share/collections/discussions';
import { Messages } from '/imports/share/collections/messages';
import { Standards } from '/imports/share/collections/standards';
import { getUserId, getLinkedDocAuditConfig } from '../../utils/helpers';
import StandardAuditConfig from '../standards/standard-audit-config';
import { getLinkedDoc } from '/imports/share/helpers';
import { getMentionData, getMentionDataWithUsers } from '/imports/share/mentions';

const getDiscussionStandard = (discussionId) => {
  const { linkedTo } = Discussions.findOne({ _id: discussionId }) || {};
  return linkedTo && (Standards.findOne({ _id: linkedTo }) || {});
};

export default {
  logs: [],
  notifications: [
    {
      text:
        '{{{userName}}}' +
        '{{#if isFile}} uploaded new file for ' +
        '{{else}} added new message to {{/if}}' +
        'the discussion of {{{docDesc}}} {{{docName}}}',
      title: 'New message in discussion',
      data({ newDoc: { discussionId, type } }) {
        const standard = getDiscussionStandard(discussionId);

        return {
          docDesc: StandardAuditConfig.docDescription(standard),
          docName: StandardAuditConfig.docName(standard),
          isFile: type === 'file',
        };
      },
      emailTemplateData({ newDoc, auditConfig }) {
        return {
          button: {
            label: 'View message',
            url: auditConfig.docUrl(newDoc),
          },
        };
      },
      receivers({ newDoc: { discussionId }, user }) {
        const receivers = new Set();
        const userId = getUserId(user);

        const { owner } = getDiscussionStandard(discussionId) || {};
        if (owner !== userId) receivers.add(owner);

        Messages.find({
          discussionId,
          createdBy: { $ne: userId },
        }).forEach(({ createdBy }) => receivers.add(createdBy));

        return Array.from(receivers);
      },
    },
    {
      text: '{{userName}} have mentioned you in the discussion of {{{docDesc}}} {{{docName}}}',
      title: 'You have been mentioned',
      data({ newDoc: { discussionId } }) {
        const { linkedTo, documentType } = { ...Discussions.findOne({ _id: discussionId }) };
        const config = getLinkedDocAuditConfig(documentType);
        const doc = getLinkedDoc(linkedTo, documentType);
        const docDesc = config.docDescription && config.docDescription(doc);
        const docName = config.docName && config.docName(doc);
        return {
          docDesc,
          docName,
        };
      },
      emailTemplateData({ newDoc, auditConfig }) {
        return {
          button: {
            label: 'View message',
            url: auditConfig.docUrl(newDoc),
          },
        };
      },
      receivers({ newDoc: { text, type }, organization, user }) {
        if (type !== 'text') return [];

        const data = getMentionDataWithUsers(getMentionData(text));
        const reducer = (receivers, mention) => {
          const shouldSkip = !!(
            !mention.user ||
            mention.user._id === user._id ||
            ![...organization.users].find(({ userId }) => userId === mention.user._id)
          );

          if (shouldSkip) return receivers;

          return receivers.concat(mention.user._id);
        };
        const receivers = data.reduce(reducer, []);

        return receivers;
      },
    },
  ],
};
