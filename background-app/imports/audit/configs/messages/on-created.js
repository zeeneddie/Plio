import { Discussions } from '/imports/share/collections/discussions.js';
import { Messages } from '/imports/share/collections/messages.js';
import { Standards } from '/imports/share/collections/standards.js';
import { getUserFullNameOrEmail, getUserId } from '../../utils/helpers.js';
import StandardAuditConfig from '../standards/standard-audit-config.js';


const getDiscussionStandard = (discussionId) => {
  const { linkedTo } = Discussions.findOne({ _id: discussionId }) || {};
  return linkedTo && (Standards.findOne({ _id: linkedTo }) || {});
};

export default {
  logs: [],
  notifications: [
    {
      text: 'messages.on-created.text',
      title: 'messages.on-created.title',
      data({ newDoc: { discussionId, type }, user }) {
        const isFile = type === 'file';
        const standard = getDiscussionStandard(discussionId);
        const docDesc = StandardAuditConfig.docDescription(standard);
        const docName = StandardAuditConfig.docName(standard);

        return {
          docDesc,
          docName,
          isFile,
          userName: getUserFullNameOrEmail(user)
        };
      },
      emailTemplateData({ newDoc }) {
        return {
          button: {
            label: 'View message',
            url: this.docUrl(newDoc)
          }
        };
      },
      receivers({ newDoc: { discussionId }, user }) {
        const receivers = new Set();
        const userId = getUserId(user);

        const { owner } = getDiscussionStandard(discussionId) || {};
        (owner !== userId) && receivers.add(owner);

        Messages.find({
          discussionId,
          createdBy: { $ne: userId }
        }).forEach(({ createdBy }) => receivers.add(createdBy));

        return Array.from(receivers);
      }
    }
  ]
};
