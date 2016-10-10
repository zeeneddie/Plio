import React from 'react';
import { composeAll, composeWithTracker } from 'react-komposer';
import { connect } from 'react-redux';
import { batchActions } from 'redux-batched-actions';
import get from 'lodash.get';
import { withProps, lifecycle, shallowEqual } from 'recompose';

import MessagesListWrapper from '../../components/MessagesListWrapper';
import PreloaderPage from '/imports/ui/react/components/PreloaderPage';
import { Messages } from '/imports/share/collections/messages';
import { Discussions } from '/imports/share/collections/discussions';
import {
  setMessages,
  setLoading,
  setLastMessageId,
  setResetCompleted
} from '/client/redux/actions/discussionActions';
import { getState } from '/client/redux/store';
import notifications from '/imports/startup/client/mixins/notifications';
import { pickFromDiscussion, pickC, omitC } from '/imports/api/helpers';
import { LastDiscussionMessage } from '/client/collections';
import { markMessagesAsRead } from './constants.js';

const getDiscussionState = () => getState('discussion');

let observerCleanup, intervalCleanup;

const observer = () => {
  const handle = LastDiscussionMessage.find().observe({
    changed({ lastMessageId, createdBy }) {
      if (!Object.is(createdBy, Meteor.userId())) {
        // play new-message sound if the sender is not a current user
        notifications.playNewMessageSound();
      }
    }
  });

  return () => handle.stop();
};

const interval = (fn) => {
  const handle = Meteor.setInterval(() => fn(), 3000);

  return () => Meteor.clearInterval(handle);
};

const onPropsChange = (props, onData) => {
  const {
    discussionId,
    dispatch,
    sort = { createdAt: -1 },
    at = null,
    priorLimit = 50,
    followingLimit = 50,
    resetCompleted = false
  } = props;
  const subOpts = { sort, at, priorLimit, followingLimit };
  const messagesSubscription = Meteor.subscribe('messages', discussionId, subOpts);
  const lastMessageSubscription = Meteor.subscribe('discussionMessagesLast', discussionId);
  const subscriptions = [messagesSubscription, lastMessageSubscription];

  dispatch(setLoading(true));

  const state = getDiscussionState();

  if (state.messages.length) {
    onData(null, state);
  }

  const isSubscriptionReady = handle => handle.ready();

  if (subscriptions.every(isSubscriptionReady)) {
    const query = { discussionId };
    const options = { sort: { createdAt: 1 } };
    const messages = Messages.find(query, options).fetch();
    let lastMessageId;

    Tracker.nonreactive(() => {
      lastMessageId = get(LastDiscussionMessage.findOne(), 'lastMessageId');
    });

    const actions = [
      setLoading(false),
      setLastMessageId(lastMessageId),
      setMessages(messages)
    ];

    dispatch(batchActions(actions));

    if (resetCompleted) {
      dispatch(setResetCompleted(false));
    }

    onData(null, getDiscussionState());
  }

  return () => {
    const stopSubscription = handle => handle.stop();

    subscriptions.map(stopSubscription);

    observerCleanup && observerCleanup();

    intervalCleanup && intervalCleanup();
  }
};

const shouldResubscribe = (props, nextProps) => {
  const omitProps = omitC(['at', 'resetCompleted']);
  // we don't want to trigger resubscribe when user selects a message
  return (!props.resetCompleted && nextProps.resetCompleted) ||
          !shallowEqual(omitProps(props), omitProps(nextProps));
}

export default composeAll(
  lifecycle({
    componentWillMount() {
      const getLastMessage = () => Object.assign({}, _.last(this.props.messages));

      markMessagesAsRead(this.props.discussion, getLastMessage());

      // run observer and interval that returns a cleanup function

      intervalCleanup = interval(() => markMessagesAsRead(this.props.discussion, getLastMessage()));

      observerCleanup = observer();
    }
  }),
  withProps(props =>
    ({ discussion: Discussions.findOne({ _id: props.discussionId }) })),
  withProps(props => ({})),
  composeWithTracker(onPropsChange, PreloaderPage, null, { shouldResubscribe }),
  connect(pickFromDiscussion(['at', 'sort', 'priorLimit', 'followingLimit', 'resetCompleted']))
)(MessagesListWrapper);
