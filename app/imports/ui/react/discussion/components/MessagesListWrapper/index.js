/* eslint-disable no-new */

import PropTypes from 'prop-types';

import React from 'react';
import { batchActions } from 'redux-batched-actions';
import get from 'lodash.get';
import Clipboard from 'clipboard';
import { $ } from 'meteor/jquery';
import { _ } from 'meteor/underscore';
import { FlowRouter } from 'meteor/kadira:flow-router';
import cx from 'classnames';

import InfiniteLoader from '/imports/ui/react/components/InfiniteLoader';
import MessagesListContainer from '../../containers/MessagesListContainer';
import MessagesListHeaderContainer from '../../containers/MessagesListHeaderContainer';
import { handleMouseWheel, wheelDirection } from '/imports/client/lib/scroll';
import {
  setSort,
  setPriorLimit,
  setFollowingLimit,
} from '/imports/client/store/actions/discussionActions';
import { swipedetect } from '/imports/client/lib/mobile';
import { lengthMessages, $isAlmostScrolledToBottom } from '/imports/api/helpers';
import { MESSAGES_PER_PAGE_LIMIT } from '../../constants';

const receivedOneNewMessage = (props, prevProps) =>
  Object.is(lengthMessages(props), lengthMessages(prevProps) + 1);
const isOwnerOfNewMessage = ({ messages, userId }) =>
  Object.is(Object.assign({}, _.last(messages)).createdBy, userId);

const propTypes = {
  at: PropTypes.string,
  loading: PropTypes.bool,
  priorLimit: PropTypes.number,
  followingLimit: PropTypes.number,
  dispatch: PropTypes.func,
  messages: PropTypes.arrayOf(PropTypes.object),
  lastMessageId: PropTypes.string,
  discussion: PropTypes.object.isRequired,
  userId: PropTypes.string.isRequired,
  users: PropTypes.arrayOf(PropTypes.object).isRequired,
};

class MessagesListWrapper extends React.Component {
  constructor(props) {
    super(props);

    this._triggerLoadMore = _.throttle(this._triggerLoadMore, 500).bind(this);
    this._scrollToBottom = this._scrollToBottom.bind(this);
  }

  componentDidMount() {
    if (!this.props.at) this._scrollToBottom();

    const args = [this.chat, this._triggerLoadMore.bind(this), 'addEventListener'];

    swipedetect(...args);

    handleMouseWheel(...args);

    new Clipboard('.js-message-copy-link');
  }

  componentWillUpdate(nextProps) {
    if (nextProps.loading) {
      this.prevChatScrollTop = $(this.chat).scrollTop();
      this.prevChatScrollHeight = this.chat.scrollHeight;
    }
  }

  componentDidUpdate(prevProps) {
    const notLoading = !this.props.loading;
    const receivedOneMessage = receivedOneNewMessage(this.props, prevProps);

    // scroll to the last position if not loading,
    // current messages count is bigger than last count and it receives more than 1 message
    // (means it has loaded messages through subscription)
    if (notLoading &&
        !receivedOneMessage &&
        lengthMessages(this.props) > lengthMessages(prevProps)) {
      if (prevProps.sort.createdAt > 0) {
        // downscroll
        $(this.chat).scrollTop(this.prevChatScrollTop);
      } else {
        // upscroll
        const st = this.prevChatScrollTop + this.chat.scrollHeight - this.prevChatScrollHeight;
        $(this.chat).scrollTop(st);
      }
    }

    // scroll to the bottom if component receives only 1 new message and the sender is current user
    // have to use $isAlmostScrolledToBottom because sometimes
    // chat is not scrolled down when new message was appended
    if (notLoading &&
        receivedOneMessage &&
        (isOwnerOfNewMessage(this.props) || $isAlmostScrolledToBottom($(this.chat)))) {
      this._scrollToBottom();
    }
  }

  componentWillUnmount() {
    const args = [this.chat, this._triggerLoadMore.bind(this), 'removeEventListener'];
    handleMouseWheel(...args);

    swipedetect(...args);
  }

  _scrollToBottom() {
    const $chat = $(this.chat);

    $chat.scrollTop($chat.prop('scrollHeight'));
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
    // we need to reverse sort direction because of how swipe works:
    // to scroll up you need to swipe down
    if (Object.is(dir, 'up')) {
      this._loadMore(1);
    } else if (Object.is(dir, 'down')) {
      this._loadMore(-1);
    }
  }

  _loadMore(sortDir) {
    const {
      loading,
      priorLimit,
      followingLimit,
      dispatch,
      messages = [],
      lastMessageId,
    } = this.props;

    if (loading) return;

    const sort = { createdAt: sortDir };
    const message = sortDir > 0 ? _.last(messages) : _.first(messages);

    const dispatchAll = () => {
      const actions = ((() => {
        const _at = FlowRouter.getQueryParam('at');
        const setSortDir = setSort(sort);
        const incFollowingLimit = setFollowingLimit(followingLimit + MESSAGES_PER_PAGE_LIMIT);
        const incPriorLimit = setPriorLimit(priorLimit + MESSAGES_PER_PAGE_LIMIT);

        const _actions = _at
          ? [setSortDir, sortDir > 0 ? incFollowingLimit : incPriorLimit]
          : [setSortDir, incFollowingLimit];

        return _actions;
      })());

      return dispatch(batchActions(actions));
    };

    if (sortDir < 0) {
      // upscroll
      if (messages.length < MESSAGES_PER_PAGE_LIMIT * 2) return;

      if ($(this.loaderOlder).isAlmostVisible()) {
        dispatchAll();
      }
    } else {
      // downscroll
      if ($(this.loaderNewer).isAlmostVisible()) {
        // load if the last message of discussion is not equal to the last rendered message
        if (!Object.is(get(message, '_id'), lastMessageId)) {
          dispatchAll();
        }
      }
    }
  }

  render() {
    const {
      discussion, messages, loading, userId, users,
    } = this.props;
    const loader = innerRef => (
      <InfiniteLoader
        {...{ innerRef }}
        loading
        className={cx('text-xs-center', { invisible: !loading })}
      />
    );

    return (
      <div className="chat-content scroll" ref={node => (this.chat = node)}>
        <div className="chat-messages">
          {discussion.isStarted && <MessagesListHeaderContainer {...{ discussion, users }} />}

          {loader(node => (this.loaderOlder = node))}

          <div className="chat-messages-list">
            <MessagesListContainer {...{
              messages, discussion, userId, users,
            }}
            />
          </div>

          {loader(node => (this.loaderNewer = node))}

        </div>
      </div>
    );
  }
}

MessagesListWrapper.propTypes = propTypes;

export default MessagesListWrapper;
