import { applyMiddleware } from 'plio-util';
import { Meteor } from 'meteor/meteor';

import DiscussionService from './discussion-service';
import { Messages, Discussions, Files } from '../collections';

function insert({ ...args }) {
  return this.collection.insert({ ...args });
}

function remove({ _id }) {
  return this.collection.remove({ _id });
}

const withDiscussion = (next, args, context) => {
  const { discussionId } = args;
  const discussion = Discussions.findOne({ _id: discussionId });
  return next(args, { ...context, discussion });
};

const beforeInsert = (next, args, context) => {
  const { discussionId } = args;
  const { userId, discussion: { participants = [] } = {} } = context;
  if (Meteor.isServer && participants.includes(userId)) {
    DiscussionService.participate(discussionId, userId);
  }

  return next(args, context);
};

const afterInsert = (next, args, context) => {
  const result = next(args, context);

  const { discussionId } = args;
  const { userId, discussion } = context;

  if (discussion && !discussion.isStarted) DiscussionService.start(discussionId, userId);

  return result;
};

function afterRemove(next, args) {
  const { _id } = args;
  const { fileId } = this.collection.findOne({ _id });
  const result = next(args);

  if (fileId) Files.remove({ _id: fileId });

  return result;
}

export default {
  collection: Messages,

  insert(args, context) {
    return applyMiddleware(
      withDiscussion,
      beforeInsert,
      afterInsert,
    )(insert.bind(this))(args, context);
  },

  remove({ _id }) {
    return applyMiddleware(
      afterRemove.bind(this),
    )(remove.bind(this))({ _id });
  },
};
