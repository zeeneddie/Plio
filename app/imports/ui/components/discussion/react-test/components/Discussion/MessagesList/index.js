import React from 'react';

import Message from './Message';
import { handleMouseWheel, wheelDirection } from '/client/lib/scroll.js';
import { setLimit, setScrollDir } from '/client/redux/actions/messagesActions';

export default class MessagesList extends React.Component {
  constructor() {
    super();

    this._wheelListener = _.throttle(this._wheelListener, 1000).bind(this);
  }

  componentDidMount() {
    const { chat } = this.refs;
    $(chat).scrollTop(chat.scrollHeight);

    handleMouseWheel(chat, this._wheelListener, 'addEventListener');
  }

  render() {
    const messages = this.props.messages.map(message => <Message key={message._id} {...message}/>);
    return (
      <div className="chat-content scroll" ref="chat">
        <div className="chat-messages">
          <div className="infinite-load-older text-xs-center" ref="loader">
            {this.props.loading && 'Loading...'}
          </div>
          <div className="chat-messages-list">
            {messages}
          </div>
        </div>
      </div>
    );
  }

  _wheelListener(e) {
    const { loading, limit, dispatch } = this.props;
    if (loading) return;

    const wheelDir = wheelDirection(e);

    dispatch(setScrollDir(wheelDir));

    if (wheelDir > 0) {
      if ($(this.refs.loader).isAlmostVisible()) {
        dispatch(setLimit(limit + 50));
      }
    }
  }
};
