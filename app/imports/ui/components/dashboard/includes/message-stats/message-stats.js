import { FlowRouter } from 'meteor/kadira:flow-router';
import { moment } from 'meteor/momentjs:moment';
import { Template } from 'meteor/templating';

import { Discussions } from '/imports/api/discussions/discussions.js';
import { Messages } from '/imports/api/messages/messages.js';
import { Files } from '/imports/api/files/files.js';
import { bulkUpdateViewedByTotal } from '/imports/api/messages/methods.js';
import { Organizations } from '/imports/api/organizations/organizations.js';
import { CountSubs, MessageSubs } from '/imports/startup/client/subsmanagers.js';
import pluralize from 'pluralize';

Template.Dashboard_MessageStats.viewmodel({
  mixin: ['user', 'organization', {
    counter: 'counter'
  }],
  _subHandlers: [],
  isInitialDataReady: false,
  isReady: false,
  enableLimit: true,
  limit: 5,
  currentDate: new Date(),

  autorun() {
    const isReady = this._subHandlers().every(handler => handler.ready());

    if (!this.isInitialDataReady()) {
      this.isInitialDataReady(isReady);
    } else {
      this.isReady(isReady);
    }
  },
  onCreated(template) {
    template.autorun(() => {
      const limit = this.enableLimit() ? this.limit() : false;
      const organizationId = this.organizationId();

      this._subHandlers([
        MessageSubs.subscribe('unreadMessages', { organizationId: organizationId, limit }),
        CountSubs.subscribe('messagesNotViewedCountTotal', 'unread-messages-count-' + organizationId, organizationId)
      ]);
    });

    this.interval = Meteor.setInterval(() => {
      this.currentDate(new Date());
    }, 60 * 1000);
  },
  onDestroyed() {
    this.clearInterval();
  },
  clearInterval() {
    Meteor.clearInterval(this.interval);
  },
  hasItemsToLoad() {
    const total = this.unreadMessagesCount();
    const current = Object.assign([], this.unreadMessages()).length;
    return total > current;
  },
  unreadMessagesCount() {
    return this.counter.get('unread-messages-count-' + this.organizationId());
  },
  hiddenUnreadMessagesNumber() {
    const count = this.unreadMessagesCount() || Object.assign([], this.unreadMessages()).length;
    return count - this.limit();
  },
  countText() {
    const count = this.unreadMessagesCount() || Object.assign([], this.unreadMessages()).length;
    return pluralize('unread message', count, true);
  },
  messages() {
    return Messages.find({
      organizationId: this.organizationsId(),
      viewedBy: { $ne: Meteor.userId() }
    }, {
      fields: { viewedBy: 0 },
      limit: this.enableLimit() ? this.limit() : 0
    }).fetch();
  },
  unreadMessages() {
    const self = this;
    const messages = Object.assign([], this.messages());
    const docs = messages.map((message) => {
      let messageData = {};
      if (message.type === 'file') {
        const file = Files.findOne({ _id: message.fileId });
        messageData.text = file && file.name;
        messageData.extension = file && file.extension;
      } else {
        messageData.text = message.text;
      }

      /**
       * Get route parameters from collections, not from the router - in order
       * to make the component most independent
       */
      const discussion = Discussions.findOne({ _id: message.discussionId });

      if (!discussion) {
        return;
      }

      const {
        linkedTo, organizationId
      } = discussion;

      const orgSerialNumber = this.organizationSerialNumber();

      let url = '';
      if (discussion.documentType === 'standard') {
        url = FlowRouter.path(
          'standardDiscussion',
          { orgSerialNumber, standardId: linkedTo },
          { at: message._id }
        );
      }

      _.extend(messageData, {
        url,
        fullName: self.userNameOrEmail(message.createdBy),
        timeString: moment(message.createdAt).from(this.currentDate(), true)
      });

      return messageData;
    });

    return docs;
  },
  loadAll() {
    this.enableLimit(false);
  },

  // Mark all messages as "read"
  bulkUpdateViewedByTotal(e) {
    e.preventDefault();
    bulkUpdateViewedByTotal.call({ organizationId: this.organizationId() });
  }
});
