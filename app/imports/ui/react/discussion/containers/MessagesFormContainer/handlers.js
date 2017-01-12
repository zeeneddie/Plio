import { FlowRouter } from 'meteor/kadira:flow-router';

import { reset, submit as submitMessage } from '/imports/client/store/actions/discussionActions';

const MESSAGES_COUNT_LIMIT_BEFORE_RESET = 100;

export const submit = ({
  value,
  setValue,
  discussionId,
  organizationId,
  disabled,
  dispatch,
}) => (e) => {
  e.preventDefault();

  if (disabled || !value) return;

  setValue('');

  const callback = (__, getState) => (err) => {
    if (err) return;

    const { messages } = getState().discussion;

    if (FlowRouter.getQueryParam('at') || messages.length > MESSAGES_COUNT_LIMIT_BEFORE_RESET) {
      FlowRouter.setQueryParams({ at: null });
      dispatch(reset(true));
    }
  };

  dispatch(submitMessage({
    discussionId,
    organizationId,
    text: value,
    type: 'text',
  }, callback));
};
