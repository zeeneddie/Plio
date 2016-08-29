import { FlowRouter } from 'meteor/kadira:flow-router';
import { moment } from 'meteor/momentjs:moment';
import { Template } from 'meteor/templating';

import { Discussions } from '/imports/api/discussions/discussions.js';
import { Messages } from '/imports/api/messages/messages.js';
import { Organizations } from '/imports/api/organizations/organizations.js';
import { UnreadMessages } from '/imports/api/constants.js';


Template.Dashboard_MessagesStats.viewmodel({
  mixin: ['user'],
  autorun: [
    function(){
      const tpl = this.templateInstance;

      this._subHandlers([
        tpl.subscribe('unreadMessagesWithCreatorsInfo'),
      ]);
    },
    function(){
      this.isReady(this._subHandlers().every(handle => handle.ready()));
    }
  ],
  _subHandlers: [],
  isReady: false,
  unreadMessagesLimited: true,

  areItemsToLoad(){
    return this.messagesCount() > UnreadMessages.limit;
  },
  hideExcessiveItems(){
    console.log('Hiding excessive items');
    this.unreadMessagesLimited(true);
  },
  loadAllItems(){
    console.log('Loading all items');
    this.unreadMessagesLimited(false);
  },
  markMessagesRead(ev){
    ev.preventDefault();console.log('Messages are marked as read');
  },
  messages(){
    const self = this;
    const msgs = [];

    Messages.find({
      viewedBy: { $nin: [Meteor.userId()] }
    }, {
      fields: { viewedBy: 0 },
      limit: self.unreadMessagesLimited() ? UnreadMessages.limit : 0
    }).forEach((msg) => {
      const message = (msg.type === 'file')
        ? msg.files.map((file) => { return file.name }).join(', ')
        : msg.message;

      // Get route parameters from collections, not from the router - in order
      // to make the component most independent
      const {
        linkedTo, organizationId
      } = Discussions.findOne({ _id: msg.discussionId });
      const orgSerialNumber = Organizations.findOne({
        _id: organizationId
      }).serialNumber;
      const url = FlowRouter.path(
        'standardDiscussion', { orgSerialNumber, standardId: linkedTo },
        { at: msg._id }
      );

      msgs.push({
        fullName: self.userNameOrEmail(msg.createdBy),
        message,
        timeString: moment(msg.createdAt).fromNow(),
        url
      });
    });

    return msgs;
  },
  messagesCount(){
    return Messages.find({
      viewedBy: { $nin: [Meteor.userId()] }
    }, {
      fields: { _id: 1 }
    }).count();
  },
  unreadMessages(){
    const msgs = this.messagesCount();

    return `${msgs} unread ${msgs === 1 ? 'message' : 'messages'}`;
  }
});
