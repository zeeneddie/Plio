import React from 'react';
import ReactDOM from 'react-dom';
import { batchActions } from 'redux-batched-actions';
import get from 'lodash.get';
import Clipboard from 'clipboard';

import InfiniteLoader from '../InfiniteLoader';
import MessagesList from '../MessagesList';
import MessagesListHeader from '../MessagesListHeader';
import { handleMouseWheel, wheelDirection } from '/client/lib/scroll.js';
import {
  setLimit,
  setSort,
  setAt,
  setShouldScrollToBottom
} from '/client/redux/actions/discussionActions';
import { swipedetect, isTouchDevice } from '/client/lib/mobile.js';

let prevChatScrollTop, prevChatScrollHeight, shouldScroll;

export default class MessagesListWrapper extends React.Component {
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

    if (prevProps.shouldScrollToBotom) {
      $(chat).scrollTop(9E99);
      this.props.dispatch(setShouldScrollToBottom(false));
    }

    if (shouldScroll) {
      if (prevProps.sort.createdAt > 0) {
        // downscroll
        $(chat).scrollTop(prevChatScrollTop);
      } else {
        // upscroll
        $(chat).scrollTop(prevChatScrollTop + chat.scrollHeight - prevChatScrollHeight);
      }

      shouldScroll = false;
    }
  }

  componentDidMount() {
    const { chat } = this.refs;
    const scrollHeight = chat.scrollHeight;
    const height = $(chat).height();

    if (this.props.at) {
      // scroll to the center of the chat
      const center = (scrollHeight - height) / 2;
      $(chat).scrollTop(center);
    } else {
      // scroll to the bottom of the chat
      $(chat).scrollTop(9E99);
    }

    swipedetect(chat, this._triggerLoadMore.bind(this), 'addEventListener');

    handleMouseWheel(chat, this._triggerLoadMore.bind(this), 'addEventListener');

    new Clipboard('.js-message-copy-link');
  }

  componentWillUnmount() {
    const { chat } = this.refs;

    handleMouseWheel(chat, this._triggerLoadMore.bind(this), 'removeEventListener');

    swipedetect(chat, this._triggerLoadMore.bind(this), 'removeEventListener');
  }

  render() {
    const { discussion, messages } = this.props;

    return (
      <div className="chat-content scroll" ref="chat">
        <div className="chat-messages">
          {discussion.isStarted && <MessagesListHeader discussion={discussion}/>}

          <InfiniteLoader
            loading={this.props.loading}
            className='infinite-load-older text-xs-center'/>

          <div className="chat-messages-list">
            <MessagesList messages={messages} discussion={discussion}/>
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
    const { loading, limit, dispatch, messages = [], lastMessageId } = this.props;

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

      dispatch(batchActions(allActions));
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
        // load if the last message of discussion is not equal to the last rendered message
        if (!Object.is(get(message, '_id'), lastMessageId)) {
          dispatchAll();
        }
      }
    }
  }
};
