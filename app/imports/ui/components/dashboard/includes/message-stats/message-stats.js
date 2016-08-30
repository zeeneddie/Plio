import { FlowRouter } from 'meteor/kadira:flow-router';
import { moment } from 'meteor/momentjs:moment';
import { Template } from 'meteor/templating';

import { Discussions } from '/imports/api/discussions/discussions.js';
import { Messages } from '/imports/api/messages/messages.js';
import { updateViewedBy } from '/imports/api/messages/methods.js';
import { Organizations } from '/imports/api/organizations/organizations.js';
import { UnreadMessages } from '/imports/api/constants.js';


Template.Dashboard_MessageStats.viewmodel({
  mixin: ['user'],
  autorun: [
    function () {
      const tpl = this.templateInstance;

      this._subHandlers([
        tpl.subscribe('unreadMessagesWithCreatorsInfo'),
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
      const message = (msg.type === 'file')
        ? msg.files.map(file => file.name).join(', ')
        : msg.message;

      /**
       * Get route parameters from collections, not from the router - in order
       * to make the component most independent
       */
      const {
        linkedTo, organizationId
      } = Discussions.findOne({ _id: msg.discussionId });

      const orgSerialNumber = Organizations.findOne({
        _id: organizationId
      }).serialNumber;

      const url = FlowRouter.path(
        'standardDiscussion',
        { orgSerialNumber, standardId: linkedTo },
        { at: msg._id }
      );

      msgs.push({
        message,
        url,
        fullName: self.userNameOrEmail(msg.createdBy),
        timeString: moment(msg.createdAt).fromNow(),
      });
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
