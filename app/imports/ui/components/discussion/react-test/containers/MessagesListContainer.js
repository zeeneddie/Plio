import React from 'react';
import { composeWithTracker } from 'react-komposer';

import MessagesList from '../components/MessagesList';
import { Messages } from '/imports/api/messages/messages.js';

const composer = ({ discussionId, limit = 50 }, onData) => {
  const subscription = Meteor.subscribe('messages', discussionId, { limit });
  const getMessages = () => Messages.find({ discussionId }, { sort: { createdAt: 1 } }).fetch();

  onData(null, { messages: getMessages(), loading: true });

  if (subscription.ready()) {
    onData(null, { messages: getMessages(), loading: false });
  }
}

const Container = composeWithTracker(composer)(MessagesList);

export default class MessagesListContainer extends React.Component {
  constructor() {
    super();

    this.state = {
      limit: 50
    };
  }

  render() {
    const props = { ...this.props, ...this.state };
    return (<Container handleLoadData={e => this._handleLoadData(e)} {...props}/>);
  }

  _handleLoadData(e) {
    this.setState({
      limit: this.state.limit + 50
    });
  }
};
