import React from 'react';
import ReactDOM from 'react-dom';
import { batchActions } from 'redux-batched-actions';
import get from 'lodash.get';
import Clipboard from 'clipboard';
import { connect } from 'react-redux';
import { shallowEqual } from 'recompose';

import InfiniteLoader from '/imports/ui/react/components/InfiniteLoader';
import MessagesListContainer from '../../containers/MessagesListContainer';
import MessagesListHeader from '../MessagesListHeader';
import { handleMouseWheel, wheelDirection } from '/client/lib/scroll';
import {
  setSort,
  setPriorLimit,
  setFollowingLimit
} from '/client/redux/actions/discussionActions';
import { swipedetect } from '/client/lib/mobile';
import { lengthMessages, $isAlmostScrolledToBottom } from '/imports/api/helpers';

const receivedOneNewMessage = (props, prevProps) =>
  Object.is(lengthMessages(props), lengthMessages(prevProps) + 1);
const isOwnerOfNewMessage = props =>
  Object.is(Object.assign({}, _.last(props.messages)).createdBy, Meteor.userId());

let prevChatScrollTop, prevChatScrollHeight;

export default class MessagesListWrapper extends React.Component {
  constructor(props) {
    super(props);

    this._triggerLoadMore = _.throttle(this._triggerLoadMore, 1000).bind(this);
  }

  componentWillUpdate(nextProps) {
    const { chat } = this.refs;

    if (nextProps.loading) {
      prevChatScrollTop = $(chat).scrollTop();
      prevChatScrollHeight = chat.scrollHeight;
    }
  }

  componentDidUpdate(prevProps) {
    const { chat } = this.refs;

    const notLoading = !this.props.loading;
    const receivedOneMessage = receivedOneNewMessage(this.props, prevProps);

    // scroll to the last position if not loading, current messages count is bigger than last count and it receives more than 1 message (means it has loaded messages through subscription)
    if (notLoading &&
        !receivedOneMessage &&
        lengthMessages(this.props) > lengthMessages(prevProps)) {
      if (prevProps.sort.createdAt > 0) {
        // downscroll
        $(chat).scrollTop(prevChatScrollTop);
      } else {
        // upscroll
        $(chat).scrollTop(prevChatScrollTop + chat.scrollHeight - prevChatScrollHeight);
      }
    }

    // scroll to the bottom if component receives only 1 new message and the sender is current user
    // have to use $isAlmostScrolledToBottom because sometimes chat is not scrolled down when new message was appended
    if (notLoading &&
        receivedOneMessage &&
        (isOwnerOfNewMessage(this.props) || $isAlmostScrolledToBottom($(chat)))) {
      $(chat).scrollTop(9E99);
    }
  }

  componentDidMount() {
    const { chat } = this.refs;
    const scrollHeight = chat.scrollHeight;
    const height = $(chat).height();

    if (!this.props.at) {
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
            <MessagesListContainer messages={messages} discussion={discussion}/>
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
    const {
      loading,
      limit,
      priorLimit,
      followingLimit,
      dispatch,
      messages = [],
      lastMessageId
    } = this.props;

    if (loading) return;

    const sort = { createdAt: sortDir };
    const message = sortDir > 0 ? _.last(messages) : _.first(messages);

    const dispatchAll = () => {
      const actions = ((() => {
        const _at = FlowRouter.getQueryParam('at');
        const setSortDir = setSort(sort);
        const incFollowingLimitBy50 = setFollowingLimit(followingLimit + 50);
        const incPriorLimitBy50 = setPriorLimit(priorLimit + 50);

        const _actions = _at
          ? [setSortDir, sortDir > 0 ? incFollowingLimitBy50 : incPriorLimitBy50]
          : [setSortDir, incFollowingLimitBy50];

        return _actions;
      })());

      return dispatch(batchActions(actions));
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
