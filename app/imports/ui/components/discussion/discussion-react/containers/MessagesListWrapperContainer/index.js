import React from 'react';
import { composeAll, composeWithTracker } from 'react-komposer';
import { connect } from 'react-redux';
import { batchActions } from 'redux-batched-actions';
import get from 'lodash.get';
import property from 'lodash.property';
import { compose, withProps, withPropsOnChange, lifecycle, branch, renderComponent } from 'recompose';

import MessagesListWrapper from '../../components/MessagesListWrapper';
import { Messages } from '/imports/api/messages/messages';
import { Discussions } from '/imports/api/discussions/discussions';
import { MessageSubs } from '/imports/startup/client/subsmanagers';
import {
  setMessages,
  setLoading,
  setLastMessageId,
  setShouldScrollToBottom,
  subscribeToMessages,
  fetchMessages,
  fetchLastMessage
} from '/client/redux/actions/discussionActions';
import store, { getState } from '/client/redux/store';
import notifications from '/imports/startup/client/mixins/notifications';
import { pickFromDiscussion, pickC } from '/imports/api/helpers';
import { LastDiscussionMessage } from '/client/collections';
import showSpinnerWhileLoading from '/imports/ui/react/helpers/spinnerWhileLoading';

const getDiscussionState = () => getState('discussion');

const observer = () => {
  const handle = LastDiscussionMessage.find().observe({
    changed({ lastMessageId, createdBy }) {
      store.dispatch(setLastMessageId(lastMessageId));

      if (!Object.is(createdBy, Meteor.userId())) {
        // play new-message sound if the sender is not a current user
        notifications.playNewMessageSound();
      }
    }
  });

  return () => handle.stop();
};

const observerCleanup = observer();

const getSubOptions = pickC(['limit', 'sort', 'at', 'priorLimit', 'followingLimit']);

const subscribe = ({ dispatch, discussionId, ...props } = {}) => {
  const lastMessageHandle = dispatch(fetchLastMessage(discussionId));
  const messagesHandle = dispatch(subscribeToMessages(discussionId, getSubOptions(props)));
  return [lastMessageHandle, messagesHandle];
}

export default compose(
  withProps(props =>
    ({ discussion: Discussions.findOne({ _id: props.discussionId }) })),
  connect(pickFromDiscussion(['sort', 'limit', 'priorLimit', 'followingLimit'])),
  lifecycle({
    componentWillUpdate(nextProps) {
      this._subs = this._subs.concat(subscribe(nextProps));
      if (this._subs.length > 1) {
        Object.assign([], this._subs[0]).map(sub => sub.stop && sub.stop());
        this._subs = this._subs.slice(1);
      }
    },
    componentWillMount() {
      this._subs = [];

      this._subs = this._subs.concat(subscribe(this.props));

      this.props.dispatch(fetchMessages(this.props.discussionId));
    },
    componentWillUnmount() {
      observerCleanup();
      this._subs.map((subs = []) => subs.map(sub => sub.stop()));
    }
  }),
  connect(state => ({ ...state.discussion })),
  showSpinnerWhileLoading(property('isInitialDataLoaded')),
  // branch(
  //   props => props.isInitialDataLoaded,
  //   _.identity,
  //   renderComponent(PreloaderPage)
  // ),
)(MessagesListWrapper);
