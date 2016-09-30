import { sanitizeHtml } from 'meteor/djedi:sanitize-html-client';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { insert } from '/imports/api/messages/methods';
import { handleMethodResult } from '/imports/api/helpers';
import { reset } from '/client/redux/actions/discussionActions';

const MESSAGES_LENGTH_LIMIT_BEFORE_RESET = 100;

// Handlers

export const submit = ({
  discussionId, organizationId, dispatch, messages, disabled
}) => {
  return (e) => {
    e.preventDefault();

    if (disabled) return;

    const messageInput = e.target.elements.message;

    if (!messageInput.value) return;

    insert.call({
      organizationId,
      discussionId,
      text: sanitizeHtml(messageInput.value),
      type: 'text'
    }, handleMethodResult((err, _id) => {
      if (err) return;

      messageInput.value = '';

      if (FlowRouter.getQueryParam('at') || messages.length > MESSAGES_LENGTH_LIMIT_BEFORE_RESET) {
        FlowRouter.setQueryParams({ at: null });
        dispatch(reset());
      }
    }));
  }
}
