import { Discussions } from '/imports/share/collections/discussions';
import { Messages } from '/imports/share/collections/messages';
import { Standards } from '/imports/share/collections/standards';
import { getUserId } from '../../utils/helpers';
import StandardAuditConfig from '../standards/standard-audit-config';


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
  ],
};
