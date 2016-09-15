import React from 'react';
import { composeAll, composeWithTracker } from 'react-komposer';
import { connect } from 'react-redux';

import MessagesList from '../../components/Discussion/MessagesList';
import { Messages } from '/imports/api/messages/messages.js';
import { setMessages, setLimit } from '/client/redux/actions/messagesActions';
import store from '/client/redux/store';

const onPropsChange = ({ discussionId, limit = 50, dispatch }, onData) => {
  const subscription = Meteor.subscribe('messages', discussionId, { limit });

  onData(null, { messages: store.getState().messages.messages, loading: true });

  if (subscription.ready()) {
    const query = { discussionId };
    const options = { sort: { createdAt: 1 } };
    const messages = Messages.find(query, options).fetch();

    dispatch(setMessages(messages));

    onData(null, { messages, loading: false });
  }

  return () => subscription.stop();
};

class MessagesListContainer extends React.Component {
  render() {
    return (<MessagesList handleLoadData={e => this._handleLoadData(e)} {...this.props}/>);
  }

  _handleLoadData(e) {
    const { limit, dispatch } = this.props;

    dispatch(setLimit(limit + 50));
  }
};

export default composeAll(
  composeWithTracker(onPropsChange),
  connect(store => ({ limit: store.messages.limit }))
)(MessagesListContainer);
