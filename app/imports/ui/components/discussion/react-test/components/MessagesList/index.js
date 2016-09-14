import React from 'react';

import Message from './message';
import { handleMouseWheel } from '/client/lib/scroll.js';
import { $isScrolledElementVisible } from '/imports/api/helpers.js';

export default class MessagesList extends React.Component {
  constructor() {
    super();

    this._wheelListener = _.throttle(this._wheelListener, 1500).bind(this);
  }

  componentDidMount() {
    handleMouseWheel(this.refs.chat, this._wheelListener, 'addEventListener');
  }

  render() {
    return (
      <div className="chat-messages">
        <div className="infinite-load-older text-xs-center" ref="loader"></div>
        <div className="chat-messages-list">
          {this.props.messages.map(message => <Message key={message._id} {...message}/>)}
        </div>
      </div>
    );
  }

  _wheelListener(e) {
    if ($isScrolledElementVisible(this.refs.loader, document.getElementById('discussion'))) {
      this.props.onHandleLoad(this.props.limit);
    }
  }
};
