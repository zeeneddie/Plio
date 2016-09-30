import React from 'react';
import { composeAll, composeWithTracker } from 'react-komposer';
import { connect } from 'react-redux';
import { batchActions } from 'redux-batched-actions';
import get from 'lodash.get';
import property from 'lodash.property';
import { compose, withProps, lifecycle, shallowEqual } from 'recompose';

import MessagesListWrapper from '../../components/MessagesListWrapper';
import PreloaderPage from '/imports/ui/react/components/PreloaderPage';
import { Messages } from '/imports/api/messages/messages';
import { Discussions } from '/imports/api/discussions/discussions';
import { MessageSubs } from '/imports/startup/client/subsmanagers';
import {
  setMessages,
  setLoading,
  setLastMessageId,
  setResetCompleted
} from '/client/redux/actions/discussionActions';
import store, { getState } from '/client/redux/store';
import notifications from '/imports/startup/client/mixins/notifications';
import { pickFromDiscussion, pickC, omitC } from '/imports/api/helpers';
import { LastDiscussionMessage } from '/client/collections';

const getDiscussionState = () => getState('discussion');

let observerCleanup;

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

const onPropsChange = (props, onData) => {
  let {
    discussionId,
    dispatch,
    sort = { createdAt: -1 },
    at = null,
    limit = 50,
    priorLimit = 50,
    followingLimit = 50,
    resetCompleted = false
  } = props;
  const subOpts = { limit, sort, at, priorLimit, followingLimit };
  const subscription = Meteor.subscribe('messages', discussionId, subOpts);
  const lastMessageSubscription = Meteor.subscribe('discussionMessagesLast', discussionId);

  // dispatch(setLoading(true));
  //
  // const state = getDiscussionState();
  //
  // if (state.messages.length) {
  //   onData(null, state);
  // }

  if (subscription.ready()) {
    const query = { discussionId };
    const options = { sort: { createdAt: 1 } };
    const messages = Messages.find(query, options).fetch();

    const actions = [
      setLoading(false),
      setMessages(messages),
      setLastMessageId(get(LastDiscussionMessage.findOne(), 'lastMessageId'))
    ];

    dispatch(batchActions(actions));

    if (resetCompleted) {
      dispatch(setResetCompleted(false));
    }

    onData(null, getDiscussionState());
  }

  return () => {
    subscription.stop();
    lastMessageSubscription.stop();
    observerCleanup && observerCleanup();
  }
};

const shouldResubscribe = (props, nextProps) => {
  const omitProps = omitC(['at', 'resetCompleted']);
  // we don't want to trigger resubscribe when user selects a message
  return (!props.resetCompleted && nextProps.resetCompleted) ||
          !shallowEqual(omitProps(props), omitProps(nextProps));
}

export default composeAll(
  withProps(props =>
    ({ discussion: Discussions.findOne({ _id: props.discussionId }) })),
  lifecycle({
    componentWillMount() {
      // run observer that returns cleanup function
      observerCleanup = observer();
    }
  }),
  composeWithTracker(onPropsChange, PreloaderPage, null, { shouldResubscribe }),
  connect(pickFromDiscussion(['at', 'sort', 'limit', 'priorLimit', 'followingLimit', 'resetCompleted']))
)(MessagesListWrapper);
