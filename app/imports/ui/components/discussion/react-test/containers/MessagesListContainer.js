import React from 'react';

import MessagesList from '../components/MessagesList';
import { Messages } from '/imports/api/messages/messages.js';

export default class MessagesListContainer extends React.Component {
  constructor(props) {
    super(props);

    const discussionId = props.discussionId;

    this.state = {
      limit: 50,
      isReady: false,
      messages: []
    };

    Meteor.setInterval(() => {
      Meteor.subscribe('messages', discussionId, { limit: this.state.limit }, {
        onReady: () => this.setState({
          isReady: true,
          messages: Messages.find({ discussionId }, { sort: { createdAt: 1 } }).fetch()
        })
      });
    }, 1000);
  }

  render() {
    const { isReady, messages, limit } = this.state;
    const list = (<MessagesList
                  messages={messages}
                  limit={limit}
                  onHandleLoad={e => this._onHandleLoad(e)} />);

    return isReady ? list : null;
  }

  _onHandleLoad(e) {
    this.setState({
      limit: this.state.limit + 50
    });
  }
}
