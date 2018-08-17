import { findByUserId, getNewestDate, compareDates } from 'plio-util';
import { Messages, Discussions } from '../collections';
import { getJoinUserToOrganizationDate } from '../utils';

export default {
  collection: Discussions,

  insert({ ...args }) {
    return this.collection.insert({ ...args });
  },

  start(_id, startedBy) {
    this.collection.update({ _id }, {
      $set: {
        startedBy,
        startedAt: new Date(),
        isStarted: true,
      },
    });
  },

  remove({ _id }) {
    Messages.remove({ discussionId: _id });

    return this.collection.remove({ _id });
  },

  updateViewedByDiscussion({ _id, messageId, userId }) {
    const query = {
      _id,
      viewedBy: {
        $elemMatch: { userId },
      },
    };

    const message = Object.assign({}, Messages.findOne({ _id: messageId }));

    const doc = {
      userId,
      messageId,
      viewedUpTo: message.createdAt,
    };

    if (!this.collection.findOne(query)) {
      const newQuery = { _id };
      const modifier = {
        $addToSet: {
          viewedBy: doc,
        },
      };

      return this.collection.update(newQuery, modifier);
    }

    const modifier = {
      $set: {
        'viewedBy.$': doc,
      },
    };

    return this.collection.update(query, modifier);
  },

  updateViewedByOrganization({ _id: organizationId, userId }) {
    const currentOrgUserJoinedAt = getJoinUserToOrganizationDate({
      organizationId, userId,
    });

    const discussions = this.collection.find({ organizationId }).fetch();

    discussions.map((discussion) => {
      const { _id: discussionId, viewedBy = [] } = discussion;
      const {
        viewedUpTo = discussion.createdAt,
      } = Object.assign({}, findByUserId(userId, viewedBy));
      const query = {
        organizationId,
        discussionId,
        createdAt: {
          $gt: getNewestDate(currentOrgUserJoinedAt, viewedUpTo),
        },
      };
      const options = { sort: { createdAt: -1 }, limit: 1 };
      const lastMessage = Messages.findOne(query, options);

      if (lastMessage) {
        if (compareDates(viewedUpTo, lastMessage.createdAt) === -1) {
          return this.updateViewedByDiscussion({
            userId,
            _id: discussionId,
            messageId: lastMessage._id,
          });
        }
      }

      return true;
    });
  },

  participate(_id, userId) {
    const query = { _id };
    const modifier = { $addToSet: { participants: userId } };
    return this.collection.update(query, modifier);
  },

  unsubscribe({ documentId: linkedTo, documentType, userId }) {
    const query = { linkedTo, documentType };
    const modifier = {
      $addToSet: {
        mutedBy: userId,
      },
    };

    return this.collection.update(query, modifier);
  },

  toggleMute({ _id, userId }, { doc }) {
    const query = { _id };
    const modifier = {};

    if (doc.mutedBy && doc.mutedBy.includes(userId)) {
      Object.assign(modifier, { $pull: { mutedBy: userId } });
    } else {
      Object.assign(modifier, { $addToSet: { mutedBy: userId } });
    }

    this.collection.update(query, modifier);
  },
};
