import { Messages } from '/imports/share/collections/messages.js';

export default {
  _getMessages({ query, options }) {
    return Messages.find(query, options);
  },
  _getMessageByDiscussionId(discussionId, protection = {}) {
    return Messages.findOne({ discussionId }, protection);
  },
  _getMessagesByDiscussionId(discussionId, protection = {}) {
    return Messages.find({ discussionId }, protection);
  },
};
