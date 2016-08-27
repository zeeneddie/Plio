import { Template } from 'meteor/templating';


Template.Dashboard_MessagesStats.viewmodel({
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
    const msgs = [
      {
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
      }
    ];

    return msgs;
  },
  unreadMessages(){
    const msgs = this.messages().length;
    
    return `${msgs} unread ${msgs === 1 ? 'message' : 'messages'}`;
  }
});
