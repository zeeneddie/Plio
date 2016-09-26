import { sanitizeHtml } from 'meteor/djedi:sanitize-html-client';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { insert } from '/imports/api/messages/methods';
import { handleMethodResult } from '/imports/api/helpers';
import { reset, setShouldScrollToBottom } from '/client/redux/actions/discussionActions';

// Handlers

export const submit = ({ disabled, discussionId, organizationId, dispatch }) => {
  return (e) => {
    e.preventDefault();

    if (disabled) return;

    const messageInput = e.target.elements.message;

    insert.call({
      organizationId,
      discussionId,
      text: sanitizeHtml(messageInput.value),
      type: 'text'
    }, handleMethodResult((err, _id) => {
      if (err) return;

      messageInput.value = '';

      if (FlowRouter.getQueryParam('at')) {
        dispatch(reset());
        dispatch(setShouldScrollToBottom(true));
      }
    }));
  }
}
