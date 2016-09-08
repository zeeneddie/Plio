import { Discussions } from '/imports/api/discussions/discussions.js';
import { Messages } from '/imports/api/messages/messages.js';
import { Standards } from '/imports/api/standards/standards.js';
import { CollectionNames, SystemName } from '/imports/api/constants.js';
import { getUserFullNameOrEmail } from '/imports/api/helpers.js';
import StandardAuditConfig from './standard-audit-config.js';


export default MessageAuditConfig = {

  collection: Messages,

  collectionName: CollectionNames.MESSAGES,

  onCreated: {
    logs: [],
    notifications: [
      {
        template:
          '{{userName}}' +
          '{{#if isFile}} uploaded new file for ' +
          '{{else}} added new message to {{/if}}' +
          'the discussion of {{{docDesc}}}',
        templateData({ newDoc: { discussionId, type }, user }) {
          const isFile = type === 'file';

          const { linkedTo } = Discussions.findOne({ _id: discussionId }) || {};
          const standard = Standards.findOne({ _id: linkedTo }) || {};
          const docDesc = StandardAuditConfig.docDescription(standard);

          return {
            docDesc,
            isFile,
            userName: getUserFullNameOrEmail(user)
          };
        },
        subjectTemplate: 'New message in discussion',
        subjectTemplateData() { },
        notificationData({ newDoc }) {
          return {
            templateData: {
              button: {
                label: 'View message',
                url: this.docUrl(newDoc)
              }
            }
          };
        },
        receivers({ newDoc: { discussionId }, user }) {
          const receivers = new Set();
          const userId = (user === SystemName) ? user : user._id;

          const { linkedTo } = Discussions.findOne({ _id: discussionId }) || {};
          const { owner } = Standards.findOne({ _id: linkedTo }) || {};
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
