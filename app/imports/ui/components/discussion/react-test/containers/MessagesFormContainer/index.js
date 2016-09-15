import React from 'react';
import { sanitizeHtml } from 'meteor/djedi:sanitize-html-client';

import MessagesForm from '../../components/Discussion/MessagesForm';
import { handleMethodResult, $scrollToBottom } from '/imports/api/helpers.js';
import { insert } from '/imports/api/messages/methods.js';

export default class MessagesFormContainer extends React.Component {
  render() {
    return <MessagesForm onSubmit={e => this._onSubmit(e)} />
  }

  _onSubmit(e) {
    e.preventDefault();

    const { discussionId, organizationId } = this.props;

    const messageInput = e.target.elements.message;

    insert.call({
      organizationId,
      discussionId,
      text: sanitizeHtml(messageInput.value),
      type: 'text'
    }, handleMethodResult((err, _id) => {
      if (err) return;

      $scrollToBottom($('.chat-content'));

      messageInput.value = '';
    }))
  }
}
