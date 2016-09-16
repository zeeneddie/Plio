import React from 'react';
import { composeAll, composeWithTracker } from 'react-komposer';
import { connect } from 'react-redux';

import MessagesList from '../../components/Discussion/MessagesList';
import { Messages } from '/imports/api/messages/messages.js';
import { setMessages, setLoading } from '/client/redux/actions/messagesActions';
import store from '/client/redux/store';
import { $scrollToBottom } from '/imports/api/helpers.js';

const getMessagesState = () => store.getState().messages;

const onPropsChange = ({ discussionId, limit = 50, dispatch }, onData) => {
  const subscription = Meteor.subscribe('messages', discussionId, { limit });
  const $chat = $('.chat-content');
  let prevChatScrollTop, prevChatScrollHeight;

  dispatch(setLoading(true));

  const state = getMessagesState();

  if (state.messages.length) {
    onData(null, state);

    prevChatScrollTop = $chat.scrollTop();
    prevChatScrollHeight = $chat.prop('scrollHeight');
  }

  if (subscription.ready()) {
    const query = { discussionId };
    const options = { sort: { createdAt: 1 } };
    const messages = Messages.find(query, options).fetch();

    dispatch(setLoading(false));
    dispatch(setMessages(messages));

    onData(null, getMessagesState());

    if (!_.every([prevChatScrollTop, prevChatScrollHeight], _.isUndefined)) {
      $chat.scrollTop(prevChatScrollTop + $chat.prop('scrollHeight') - prevChatScrollHeight);
    }
  }

  return () => subscription.stop();
};

export default composeAll(
  composeWithTracker(onPropsChange),
  connect(store => _.pick(store.messages, 'limit'))
)(MessagesList);
