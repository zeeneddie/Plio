import { updateViewedBy } from '/imports/api/discussions/methods';

export const markMessagesAsRead = (discussion = {}, doc = {}) => {
  const { _id, viewedBy = [] } = discussion;
  const { createdAt = null } = doc;
  const { viewedUpTo = null } = Object.assign({}, viewedBy.find(fields =>
      Object.is(fields.userId, Meteor.userId())));

  // mark messages as read if the last message is actually a new one
  if (viewedUpTo < doc.createdAt) {
    updateViewedBy.call({
      _id,
      messageId: doc._id
    });
  }
}
