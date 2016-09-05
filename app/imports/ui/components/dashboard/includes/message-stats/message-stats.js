import { FlowRouter } from 'meteor/kadira:flow-router';
import { moment } from 'meteor/momentjs:moment';
import { Template } from 'meteor/templating';

import { Discussions } from '/imports/api/discussions/discussions.js';
import { Messages } from '/imports/api/messages/messages.js';
import { Files } from '/imports/api/files/files.js';
import { updateViewedBy } from '/imports/api/messages/methods.js';
import { Organizations } from '/imports/api/organizations/organizations.js';
import { UnreadMessages } from '/imports/api/constants.js';

Template.Dashboard_MessageStats.viewmodel({
  mixin: ['user', 'organization'],
  autorun: [
    function () {
      const tpl = this.templateInstance;
      this._subHandlers([
        tpl.subscribe('unreadMessages', { organizationId: this.organizationId() }),
      ]);
    },

    function () {
      this.isReady(this._subHandlers().every(handle => handle.ready()));
    }
  ],

  _subHandlers: [],
  isReady: false,
  unreadMessagesLimited: true,

  areItemsToLoad() {
    return this.messagesCount() > UnreadMessages.limit;
  },

  // This cursor is used in few helpers
  cursorMessagesNotViewed() {
    return Messages.find({
      viewedBy: { $nin: [Meteor.userId()] }
    }, {
      fields: { viewedBy: 0 },
      limit: this.unreadMessagesLimited() ? UnreadMessages.limit : 0
    });
  },

  hideExcessiveItems() {
    this.unreadMessagesLimited(true);
  },

  itemsToLoadMore() {
    return this.messagesCount() - UnreadMessages.limit;
  },

  loadAllItems() {
    this.unreadMessagesLimited(false);
  },

  // Mark all visible messages as "read"
  markMessagesRead(ev) {
    ev.preventDefault();

    this.cursorMessagesNotViewed().forEach(
      msg => updateViewedBy.call({ _id: msg._id })
    );
  },

  messages() {
    const self = this;
    const msgs = [];

    this.cursorMessagesNotViewed().forEach((msg) => {
      let messageData = {};

      if (msg.type === 'file') {
        const file = Files.findOne({ _id: msg.fileId });
        messageData.message = file && file.name;
        messageData.extension = file && file.extension;
      } else {
        messageData.message = msg.message;
      }

      /**
       * Get route parameters from collections, not from the router - in order
       * to make the component most independent
       */
      const discussion = Discussions.findOne({ _id: msg.discussionId });

      if (!discussion) {
        return;
      }

      const {
        linkedTo, organizationId
      } = discussion;

      const orgSerialNumber = Organizations.findOne({
        _id: organizationId
      }).serialNumber;

      const url = FlowRouter.path(
        'standardDiscussion',
        { orgSerialNumber, standardId: linkedTo },
        { at: msg._id }
      );

      _.extend(messageData, {
        url,
        fullName: self.userNameOrEmail(msg.createdBy),
        timeString: moment(msg.createdAt).fromNow()
      });

      msgs.push(messageData);
    });

    return msgs;
  },

  messagesCount() {
    return Messages.find({
      viewedBy: { $nin: [Meteor.userId()] }
    }, {
      fields: { _id: 1 }
    }).count();
  },

  unreadMessages() {
    const msgs = this.messagesCount();

    return `${msgs} unread ${msgs === 1 ? 'message' : 'messages'}`;
  },
});
