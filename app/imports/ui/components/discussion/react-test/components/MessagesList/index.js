import React from 'react';
import ReactDOM from 'react-dom';
import { batchActions } from 'redux-batched-actions';
import get from 'lodash.get';

import Message from '../Message';
import InfiniteLoader from '../InfiniteLoader';
import { handleMouseWheel, wheelDirection } from '/client/lib/scroll.js';
import { setLimit, setSort, setAt } from '/client/redux/actions/discussionActions';
import { $isScrolledElementVisible } from '/imports/api/helpers.js';
import { swipedetect, isTouchDevice } from '/client/lib/mobile.js';

let prevChatScrollTop, prevChatScrollHeight, shouldScroll;


export default class MessagesList extends React.Component {
  constructor(props) {
    super(props);

    this._triggerLoadMore = _.throttle(this._triggerLoadMore, 1000).bind(this);
  }

  componentWillUpdate(nextProps) {
    const { chat } = this.refs;

    if (nextProps.loading && !this.props.loading) {
      prevChatScrollTop = $(chat).scrollTop();
      prevChatScrollHeight = chat.scrollHeight;
    }

    if (!nextProps.loading && nextProps.messages.length > this.props.messages.length) {
      if (!_.every([prevChatScrollTop, prevChatScrollHeight], _.isUndefined)) {
        shouldScroll = true;
      }
    }
  }

  componentDidUpdate(prevProps) {
    const { chat } = this.refs;

    if (shouldScroll) {
      $(chat).scrollTop(prevChatScrollTop + chat.scrollHeight - prevChatScrollHeight);

      shouldScroll = false;
    }
  }

  componentDidMount() {
    const { chat } = this.refs;

    $(chat).scrollTop(chat.scrollHeight);

    swipedetect(chat, this._triggerLoadMore.bind(this), 'addEventListener');

    handleMouseWheel(chat, this._triggerLoadMore.bind(this), 'addEventListener');
  }

  componentWillUnmount() {
    const { chat } = this.refs;

    handleMouseWheel(chat, this._triggerLoadMore.bind(this), 'removeEventListener');

    swipedetect(chat, this._triggerLoadMore.bind(this), 'removeEventListener');
  }

  render() {
    const messages = this.props.messages.map(message => <Message key={message._id} {...message}/>);
    return (
      <div className="chat-content scroll" ref="chat">
        <div className="chat-messages">
          <InfiniteLoader
            loading={this.props.loading}
            className='infinite-load-older text-xs-center'/>
          <div className="chat-messages-list">
            {messages}
          </div>
          <InfiniteLoader
            loading={this.props.loading}
            className='infinite-load-newer text-xs-center'/>
        </div>
      </div>
    );
  }

  _triggerLoadMore(e) {
    if (e instanceof Event) {
      this._handleMouseEvents(e);
    } else {
      // e === direction
      this._handleTouchEvents(e);
    }
  }

  _handleMouseEvents(e) {
    const wheelDir = wheelDirection(e);

    this._loadMore(-(wheelDir));
  }

  _handleTouchEvents(dir) {
    // we need to reverse sort direction because of how swipe works: to scroll up you need to swipe down
    if (Object.is(dir, 'up')) {
      this._loadMore(1);
    } else if (Object.is(dir, 'down')) {
      this._loadMore(-1);
    }
  }

  _loadMore(sortDir) {
    const { loading, limit, dispatch, messages = [] } = this.props;

    if (loading) return;

    const sort = { createdAt: sortDir };
    const message = sortDir > 0 ? _.last(messages) : _.first(messages);

    const dispatchAll = () => {
      const actions = [
        setLimit(limit + 50),
        setSort(sort)
      ];
      const allActions = FlowRouter.getQueryParam('at')
        ? actions.concat(setAt(get(message, '_id')))
        : actions;

      dispatch(batchActions(allActions))
    };

    if (sortDir < 0) {
      // upscroll
      if (messages.length < 50) return;

      if ($('.infinite-load-older').isAlmostVisible()) {
        dispatchAll();
      }
    } else {
      // downscroll
      if ($('.infinite-load-newer').isAlmostVisible()) {
        dispatchAll();
      }
    }
  }
};
