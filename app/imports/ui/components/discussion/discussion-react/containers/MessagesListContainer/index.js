import React from 'react';
import { composeAll, composeWithTracker } from 'react-komposer';
import { connect } from 'react-redux';
import { batchActions } from 'redux-batched-actions';
import uniqBy from 'lodash.uniqby';
import get from 'lodash.get';
import { withProps } from 'recompose';

import MessagesListWrapper from '../../components/MessagesListWrapper';
import PreloaderPage from '../../components/PreloaderPage';
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
    sort = { createdAt: -1 },
    at = null,
    limit = 50,
    priorLimit = 50,
    followingLimit = 50
  } = props;
  console.log(props);

  const subOpts = { limit, sort, at, priorLimit, followingLimit };
  const subscription = Meteor.subscribe('messages', discussionId, subOpts);
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

    const actions = [
      setLoading(false),
      setMessages(messages),
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
  composeWithTracker(onPropsChange, PreloaderPage),
  connect(store => _.pick(store.discussion, 'sort', 'at', 'limit', 'priorLimit', 'followingLimit'))
)(MessagesListWrapper);
