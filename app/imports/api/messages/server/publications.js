import { Meteor } from 'meteor/meteor';
import get from 'lodash.get';
import { check } from 'meteor/check';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { _ } from 'meteor/underscore';
import { findByUserId, getNewestDate } from 'plio-util';

import { Discussions } from '/imports/share/collections/discussions';
import { getJoinUserToOrganizationDate } from '/imports/api/organizations/utils';
import { Messages } from '/imports/share/collections/messages';
import { Organizations } from '/imports/share/collections/organizations';
import { Files } from '/imports/share/collections/files';
import { isOrgMember } from '../../checkers';
import Counter from '../../counter/server';

const getLastMessageId = (query, options) => ({
  lastMessageId: get(Messages.findOne(query, _.omit(options, 'limit')), '_id'),
});

const getMessageData = (id) => {
  let text = '';
  const message = Object.assign({}, Messages.findOne({ _id: id }));

  if (message.type === 'file' && message.fileId) {
    const file = Files.findOne({ _id: message.fileId }, { fields: { name: 1 } });
    text = file.name;
  } else {
    ({ text } = message);
  }

  const organization = Object.assign({}, Organizations.findOne({
    _id: message.organizationId,
  }, {
    fields: { serialNumber: 1 },
  }));

  const discussion = Object.assign({}, Discussions.findOne({
    _id: message.discussionId,
  }, {
    fields: { linkedTo: 1, documentType: 1 },
  }));

  const route = {};
  if (discussion.documentType === 'standard') {
    route.name = 'standardDiscussion';
    route.params = { orgSerialNumber: organization.serialNumber, standardId: discussion.linkedTo };
    route.query = { at: message._id };
  }

  const user = Meteor.users.findOne({
    _id: message.createdBy,
  }, {
    fields: { profile: 1, emails: 1 },
  });

  const messageData = {
    text,
    route,
    userAvatar: user && user.profile.avatar,
    userFullNameOrEmail: user && user.fullNameOrEmail(),
    createdBy: message.createdBy,
  };

  return messageData;
};

Meteor.publishComposite('messages', (discussionId, {
  sort = { createdAt: -1 },
  at = null,
  priorLimit = 50,
  followingLimit = 50,
} = {}) => {
  check(discussionId, String);

  new SimpleSchema({
    priorLimit: { type: Number },
    followingLimit: { type: Number },
    at: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
      optional: true,
    },
    sort: {
      type: new SimpleSchema({
        createdAt: { type: Number },
      }),
    },
  }).validate({
    sort, at, priorLimit, followingLimit,
  });

  return {
    find() {
      if (at) {
        const msg = Object.assign({}, Messages.findOne({ _id: at }));
        const getMessages = (l, c) => {
          const sign = c > 0 ? '$gte' : '$lte';
          const query = { createdAt: { [sign]: msg.createdAt } };
          const options = { limit: l, sort: { createdAt: c } };
          return Messages.find(query, options).fetch();
        };
        const prior = getMessages(priorLimit, -1);
        const following = getMessages(followingLimit, 1);
        const query = {
          createdAt: {
            $lte: following.length && _.last(following).createdAt,
            $gte: prior.length && _.last(prior).createdAt,
          },
        };
        const options = { sort: { createdAt: 1 } };
        return Messages.find(query, options);
      }

      const query = { discussionId };
      const options = { sort, limit: followingLimit };
      return Messages.find(query, options);
    },
    children: [{
      find(message) {
        return Meteor.users.find({ _id: message.userId }, { fields: { profile: 1 } });
      },
    }, {
      find({ fileId }) {
        if (fileId) {
          return Files.find({ _id: fileId });
        }

        return undefined;
      },
    }],
  };
});

Meteor.publish('discussionMessagesLast', function (discussionId) {
  check(discussionId, String);

  const discussion = Object.assign({}, Discussions.findOne({ _id: discussionId }));

  if (!this.userId || !isOrgMember(this.userId, get(discussion, 'organizationId'))) {
    return this.ready();
  }

  let initializing = true;

  const query = { discussionId };
  const options = { sort: { createdAt: -1 }, limit: 1, fields: { _id: 1 } };

  const getId = () => Object.assign({}, getLastMessageId(query, options)).lastMessageId;
  const getData = (_id) => {
    const { _id: lastMessageId, createdBy } = Object.assign({}, Messages.findOne({ _id }));
    return { lastMessageId, createdBy };
  };

  const handle = Messages.find(query, options).observeChanges({
    added: (id) => {
      if (!initializing) {
        this.changed('lastDiscussionMessage', discussionId, getData(id));
      }
    },
    removed: () => {
      if (!initializing) {
        this.changed('lastDiscussionMessage', discussionId, getData(getId()));
      }
    },
  });

  initializing = false;

  this.added('lastDiscussionMessage', discussionId, getData(getId()));

  this.ready();

  this.onStop(() => handle.stop());
});

Meteor.publish('organizationMessagesLast', function (organizationId) {
  check(organizationId, String);

  if (!this.userId || !isOrgMember(this.userId, organizationId)) {
    return this.ready();
  }

  let initializing = true;

  const query = { organizationId };
  const options = { sort: { createdAt: -1 }, limit: 1, fields: { _id: 1 } };

  const handle = Messages.find(query, options).observeChanges({
    added: (id) => {
      if (!initializing) {
        this.changed('lastOrganizationMessage', organizationId, getMessageData(id));
      }
    },
    removed: () => {
      if (!initializing) {
        this.changed('lastOrganizationMessage', organizationId);
      }
    },
  });

  initializing = false;

  const messageId = getLastMessageId(query, options);
  this.added('lastOrganizationMessage', organizationId, getMessageData(messageId));

  this.ready();

  this.onStop(() => handle.stop());
});

// Unread messages by the logged in user, with info about users that created
// the messages.
Meteor.publishComposite('unreadMessages', function ({ organizationId, limit }) {
  check(organizationId, String);
  check(limit, Number);

  const { userId } = this;

  if (!userId || !isOrgMember(userId, organizationId)) {
    return this.ready();
  }

  const getUserData = findByUserId(userId);
  const currentOrgUserJoinedAt = getJoinUserToOrganizationDate({
    organizationId,
    userId,
  });

  return {
    find() {
      return Discussions.find({ organizationId });
    },
    children: [{
      find(discussion) {
        const { _id: discussionId, viewedBy = [] } = discussion;
        const { viewedUpTo } = Object.assign({}, getUserData(viewedBy));
        const query = {
          discussionId,
          organizationId,
          createdAt: {
            $gt: getNewestDate(currentOrgUserJoinedAt, viewedUpTo),
          },
        };
        const options = {
          limit,
          sort: {
            createdAt: -1,
          },
        };

        return Messages.find(query, options);
      },
      children: [{
        find(message) {
          return Meteor.users.find({ _id: message.createdBy }, { fields: { profile: 1 } });
        },
      }, {
        find(message) {
          if (message.fileId) {
            return Files.find({ _id: message.fileId });
          }

          return undefined;
        },
      }],
    }],
  };
});

Meteor.publish('messagesNotViewedCount', function (counterName, documentId) {
  check(counterName, String);
  check(documentId, String);

  const { userId } = this;
  const discussion = Object.assign({}, Discussions.findOne({
    linkedTo: documentId,
    isPrimary: true,
  }));
  const discussionId = discussion._id;
  const { organizationId, viewedBy = [] } = discussion;

  if (!discussionId || !userId || !isOrgMember(userId, organizationId)) {
    return this.ready();
  }

  const currentOrgUserJoinedAt = getJoinUserToOrganizationDate({
    organizationId, userId,
  });
  const { viewedUpTo = null } = Object.assign({}, findByUserId(userId, viewedBy));

  return new Counter(counterName, Messages.find({
    discussionId,
    organizationId,
    createdAt: {
      $gt: getNewestDate(viewedUpTo, currentOrgUserJoinedAt),
    },
  }));
});

Meteor.publish('messagesNotViewedCountTotal', function (counterName, organizationId) {
  check(counterName, String);
  check(organizationId, String);

  const { userId } = this;

  if (!userId || !isOrgMember(userId, organizationId)) {
    return this.ready();
  }

  const currentOrgUserJoinedAt = getJoinUserToOrganizationDate({
    organizationId, userId,
  });
  const discussions = Discussions.find({ organizationId });
  const viewedByData = discussions.map((discussion) => {
    const { viewedBy = [] } = discussion;
    const { viewedUpTo } = Object.assign({}, findByUserId(userId, viewedBy));

    return {
      viewedUpTo,
      discussionId: discussion._id,
    };
  });

  const $or = viewedByData.map(({ viewedUpTo, discussionId }) => ({
    discussionId,
    createdAt: {
      $gt: getNewestDate(viewedUpTo, currentOrgUserJoinedAt),
    },
  }));

  const query = { organizationId };

  if ($or.length) Object.assign(query, { $or });

  return new Counter(counterName, Messages.find(query));
});
