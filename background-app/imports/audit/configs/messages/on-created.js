import { _ } from 'meteor/underscore';
import property from 'lodash.property';

import { Discussions } from '/imports/share/collections/discussions';
import { getUserId, getLinkedDocAuditConfig } from '../../utils/helpers';
import { getLinkedDoc } from '/imports/share/helpers';
import { getMentionData, getMentionDataWithUsers } from '/imports/share/mentions';

const getDocAndConfigByDiscussionId = (discussionId) => {
  const discussion = { ...Discussions.findOne({ _id: discussionId }) };
  const { linkedTo, documentType } = discussion;
  const config = getLinkedDocAuditConfig(documentType);
  const doc = getLinkedDoc(linkedTo, documentType);

  return { doc, config, discussion };
};

const getDocNameDesc = ({ doc, config }) => ({
  docName: config.docName && config.docName(doc),
  docDesc: config.docDescription && config.docDescription(doc),
});

const getDocNameDescByData = _.compose(getDocNameDesc, getDocAndConfigByDiscussionId);

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
        return {
          ...getDocNameDescByData(discussionId),
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
        const {
          doc,
          config,
          discussion: { participants = [], mutedBy = [] } = {},
        } = getDocAndConfigByDiscussionId(discussionId);
        const owner = config.docOwner && config.docOwner(doc);

        receivers.add(owner);

        participants.forEach(receivers.add.bind(receivers));

        [...mutedBy, userId].forEach(receivers.delete.bind(receivers));

        return Array.from(receivers);
      },
    },
    {
      text: '{{userName}} have mentioned you in the discussion of {{{docDesc}}} {{{docName}}}',
      title: 'You have been mentioned',
      data: _.compose(getDocNameDescByData, property('newDoc.discussionId')),
      emailTemplateData({ newDoc, auditConfig }) {
        return {
          button: {
            label: 'View message',
            url: auditConfig.docUrl(newDoc),
          },
        };
      },
      receivers({ newDoc: { text, type, discussionId }, organization, user }) {
        if (type !== 'text') return [];
        const userId = getUserId(user);
        const data = getMentionDataWithUsers(getMentionData(text));
        const reducer = (receivers, mention) => {
          const shouldSkip = !!(
            !mention.user ||
            mention.user._id === userId ||
            ![...organization.users].find(usr => usr.userId === mention.user._id)
          );

          if (shouldSkip) return receivers;

          return receivers.add(mention.user._id);
        };
        const receivers = data.reduce(reducer, new Set());

        const { mutedBy = [] } = { ...Discussions.findOne({ _id: discussionId }) };

        mutedBy.forEach(receivers.delete.bind(receivers));

        return Array.from(receivers);
      },
    },
  ],
};
