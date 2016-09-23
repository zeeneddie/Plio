import React from 'react';
import { composeAll, composeWithTracker } from 'react-komposer';
import { connect } from 'react-redux';
import { batchActions } from 'redux-batched-actions';
import uniqBy from 'lodash.uniqby';
import get from 'lodash.get';
import { withProps } from 'recompose';

import MessagesListWrapper from '../../components/MessagesListWrapper';
import { Messages } from '/imports/api/messages/messages.js';
import { Discussions } from '/imports/api/discussions/discussions.js';
import { MessageSubs } from '/imports/startup/client/subsmanagers.js';
import {
  setMessages,
  setLoading,
  setLastMessageId,
  setShouldScrollToBottom
} from '/client/redux/actions/discussionActions';
import store, { getState } from '/client/redux/store';
import notifications from '/imports/startup/client/mixins/notifications';

const lastDiscussionMessage = new Mongo.Collection('lastDiscussionMessage');

const getDiscussionState = () => getState('discussion');

const observer = () => {
  const handle = lastDiscussionMessage.find().observe({
    changed({ lastMessageId, createdBy }) {
      if (Object.is(createdBy, Meteor.userId())) {
        store.dispatch(setShouldScrollToBottom(true));
      } else {
        // play new-message sound if the sender is not a current user
        notifications.playNewMessageSound();
      }
    }
  });

  return () => handle.stop();
};

const observerCleanup = observer();

const onPropsChange = (props, onData) => {
  const {
    discussionId,
    dispatch,
    limit = 50,
    sort = { createdAt: -1 },
    at = null
  } = props;
  console.log(props);

  const subscription = Meteor.subscribe('messages', discussionId, { limit, sort, at });
  const lastMessageSubscription = Meteor.subscribe('discussionMessagesLast', discussionId);

  dispatch(setLoading(true));

  const state = getDiscussionState();

  if (state.messages.length) {
    onData(null, state);
  }

  if (subscription.ready()) {
    const query = { discussionId };
    const options = { sort: { createdAt: 1 } };
    const messages = Messages.find(query, options).fetch();
    const newMessages = ((() => {
      if (at) {
        const allMessages = getDiscussionState().messages.concat(messages);
        const uniqMessages = uniqBy(allMessages, '_id');
        const sorter = ({ createdAt:c1 }, { createdAt:c2 }) => c1 - c2;
        const sortedMessages = uniqMessages.sort(sorter);

        return sortedMessages;
      }

      return messages;
    })());

    const actions = [
      setLoading(false),
      setMessages(newMessages),
      setLastMessageId(get(lastDiscussionMessage.findOne(), 'lastMessageId'))
    ];

    dispatch(batchActions(actions));

    onData(null, getDiscussionState());
  }

  return () => {
    subscription.stop();
    lastMessageSubscription.stop();
    observerCleanup();
  }
};

export default composeAll(
  withProps(props =>
    ({ discussion: Discussions.findOne({ _id: props.discussionId }) })),
  composeWithTracker(onPropsChange),
  connect(store => _.pick(store.discussion, 'limit', 'sort', 'at'))
)(MessagesListWrapper);
