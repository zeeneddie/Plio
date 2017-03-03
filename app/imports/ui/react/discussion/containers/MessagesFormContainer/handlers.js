import { FlowRouter } from 'meteor/kadira:flow-router';

import { MessageTypes } from '/imports/share/constants';
import { reset, submit as submitMessage } from '/imports/client/store/actions/discussionActions';
import { MESSAGES_COUNT_LIMIT_BEFORE_RESET, MESSAGES_PER_PAGE_LIMIT } from '../../constants';

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

    const { messages = [], lastMessageId } = getState().discussion;

    if (FlowRouter.getQueryParam('at') || messages.length > MESSAGES_COUNT_LIMIT_BEFORE_RESET) {
      FlowRouter.setQueryParams({ at: null });

      const resetParams = {
        lastMessageId,
        isDiscussionOpened: true,
        messages: messages.reverse().slice(0, MESSAGES_PER_PAGE_LIMIT),
      };

      dispatch(reset(resetParams));
    }
  };

  dispatch(submitMessage({
    discussionId,
    organizationId,
    text: value,
    type: MessageTypes.TEXT,
  }, callback));
};
