import { Template } from 'meteor/templating';

import { Messages } from '/imports/api/messages/messages.js';


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

  markMessagesRead(ev){
    ev.preventDefault();console.log('Messages are marked as read');
  },
  messages(){
    const self = this;
    /*
    {
      createdAt: new Date(),
      createdBy: 'SQHmBKJ94gJvpLKLt',
    	discussionId: '123',
    	viewedBy: [],
      files: [],
  		message: 'A',
  		type: 'text'
    },
    {
      createdAt: new Date(),
      createdBy: 'SQHmBKJ94gJvpLKLt',
    	discussionId: '123',
    	viewedBy: [],
      files: [],
  		message: 'B',
  		type: 'text'
    },
    {
      createdAt: new Date(),
      createdBy: 'SQHmBKJ94gJvpLKLt',
    	discussionId: '123',
    	viewedBy: [],
      files: [],
  		message: 'C',
  		type: 'text'
    },
    */
    const msgs = [
      /*{
        fullName: 'Mike Smith',
        isFile: false,
        message: 'Hi Steve, can we discuss yesterday\'s NC?',
        timeString: '30 mins ago',
        url: 'discussions.html'
      },
      {
        fullName: 'Larry King',
        isFile: false,
        message: 'I have completed few things',
        timeString: '1 hour ago',
        url: 'discussions.html'
      },
      {
        fullName: 'Larry King',
        isFile: true,
        message: 'I have completed few things',
        timeString: '1 hour ago',
        url: 'discussions.html'
      }*/
    ];

    Messages.find({
      viewedBy: { $nin: [Meteor.userId()] }
    }, {
      fields: { discussionId: 0, viewedBy: 0 }
    }).forEach((msg) => {
      console.log(msg);

      msgs.push({
        fullName: self.userNameOrEmail(msg.createdBy),
        isFile: msg.type === 'file',
        message: msg.message,
        timeString: 'what is timestring format behaviour?', // ToDo
        url: 'from where?' // ToDo
      });
    });console.dir(msgs);

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
    const msgs = this.messages().length;

    return `${msgs} unread ${msgs === 1 ? 'message' : 'messages'}`;
  }
});
