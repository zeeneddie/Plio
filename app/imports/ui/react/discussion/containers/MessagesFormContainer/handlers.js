import { FlowRouter } from 'meteor/kadira:flow-router';

import { reset, submit as submitMessage } from '/client/redux/actions/discussionActions';

const MESSAGES_LENGTH_LIMIT_BEFORE_RESET = 100;

export const submit = ({
  discussionId,
  organizationId,
  disabled,
  dispatch
}) => {
  return (e) => {
    e.preventDefault();

    if (disabled) return;

    const messageInput = e.target.elements.message;

    if (!messageInput.value) return;

    const value = messageInput.value;

    messageInput.value = '';

    const callback = (dispatch, getState) => (err, _id) => {
      if (err) return;

      const { messages } = getState().discussion;

      if (FlowRouter.getQueryParam('at') || messages.length > MESSAGES_LENGTH_LIMIT_BEFORE_RESET) {
        FlowRouter.setQueryParams({ at: null });
        dispatch(reset());
      }
    };

    dispatch(submitMessage({
      organizationId,
      discussionId,
      text: value,
      type: 'text'
    }, callback));
  }
}
