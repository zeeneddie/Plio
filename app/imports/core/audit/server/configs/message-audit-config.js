import { Discussions } from '/imports/api/discussions/discussions.js';
import { Messages } from '/imports/api/messages/messages.js';
import { Standards } from '/imports/api/standards/standards.js';
import { CollectionNames, SystemName } from '/imports/api/constants.js';
import { getUserFullNameOrEmail, getUserId } from '../utils/helpers.js';
import StandardAuditConfig from './standard-audit-config.js';


const getDiscussionStandard = (discussionId) => {
  const { linkedTo } = Discussions.findOne({ _id: discussionId }) || {};
  return linkedTo && (Standards.findOne({ _id: linkedTo }) || {});
};

export default MessageAuditConfig = {

  collection: Messages,

  collectionName: CollectionNames.MESSAGES,

  onCreated: {
    logs: [],
    notifications: [
      {
        text:
          '{{userName}}' +
          '{{#if isFile}} uploaded new file for ' +
          '{{else}} added new message to {{/if}}' +
          'the discussion of {{{docDesc}}}',
        title: 'New message in discussion',
        data({ newDoc: { discussionId, type }, user }) {
          const isFile = type === 'file';

          const getStandardDesc = () => {
            return StandardAuditConfig.docDescription(
              getDiscussionStandard(discussionId)
            );
          };

          return {
            docDesc: getStandardDesc,
            isFile: () => isFile,
            userName: () => getUserFullNameOrEmail(user)
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
  },

  updateHandlers: [],

  onRemoved: {},

  docId({ _id }) {
    return _id;
  },

  docDescription({ message }) {
    return message;
  },

  docOrgId({ discussionId }) {
    const { organizationId } = Discussions.findOne({ _id: discussionId }) || {};
    return organizationId;
  },

  docUrl({ _id, discussionId }) {
    const { organizationId, linkedTo } = Discussions.findOne({
      _id: discussionId
    }) || {};

    const { serialNumber } = Organizations.findOne({
      _id: organizationId
    }) || {};

    return Meteor.absoluteUrl(
      `${serialNumber}/standards/${linkedTo}/discussion?at=${_id}`
    );
  }

};
