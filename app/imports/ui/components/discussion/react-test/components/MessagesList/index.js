import React from 'react';

import Message from './message';
import { handleMouseWheel } from '/client/lib/scroll.js';

export default class MessagesList extends React.Component {
  constructor() {
    super();

    this._wheelListener = _.throttle(this._wheelListener, 1000).bind(this);
  }

  componentDidMount() {
    handleMouseWheel(this.refs.chat, this._wheelListener, 'addEventListener');
  }

  render() {
    return (
      <div className="chat-content scroll" ref="chat">
        <div className="chat-messages">
          <div className="infinite-load-older text-xs-center" ref="loader">
          </div>
          <div className="chat-messages-list">
            {this.props.messages.map(message => <Message key={message._id} {...message}/>)}
          </div>
        </div>
      </div>
    );
  }

  _wheelListener(e) {
    if ($(this.refs.loader).isAlmostVisible()) {
      this.props.handleLoadData(e);
    }
  }
};
