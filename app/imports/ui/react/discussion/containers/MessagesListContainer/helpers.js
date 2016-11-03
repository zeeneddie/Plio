import { Meteor } from 'meteor/meteor';
import get from 'lodash.get';

import {
  isMessageSelected,
  getUser,
  getDate,
  scrollToSelectedMessage
} from '/imports/api/messages/helpers';

export const transformMessages = ({ discussion, messages, at }) => {
  const messagesMapped = messages.map((message, i, arr) => {
    const { _id, createdBy, createdAt } = message;

    const user = getUser(createdBy);

    const obj = (() => {
      const date = getDate(createdAt);
      const documentId = discussion.linkedTo;

      const isSelected = isMessageSelected(message, at);

      const dateToShow = ((() => {
        const prevCreatedAt = get(messages[i - 1], 'createdAt');
        const prevMessageDate = getDate(prevCreatedAt);

        return date !== prevMessageDate;
      })());

      const isMergedWithPreviousMessage = ((() => {
        const prevMessage = messages[i - 1];
        const prevCreatedAt = get(prevMessage, 'createdAt');
        const prevCreatedBy = get(prevMessage, 'createdBy');

         return (message.createdBy === prevCreatedBy &&
                 message.createdAt - prevCreatedAt < 5 * 60 * 1000);
      })());

      return {
        _id,
        date,
        documentId,
        createdAt,
        user,
        isSelected,
        dateToShow,
        isMergedWithPreviousMessage,
        ...(() => isSelected ? { scrollToSelectedMessage } : null)()
      };
    })();

    return Object.assign({}, message, obj);
  });

  return messagesMapped;
};
