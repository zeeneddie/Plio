import { Meteor } from 'meteor/meteor';
import get from 'lodash.get';
import ReactDOM from 'react-dom';

import { getFormattedDate } from '/imports/share/helpers.js';

const isMessageSelected = (props, at) => Object.is(props._id, at);

const getUser = (_id) => {
  const query = { _id };
  const options = {
    fields: {
      profile: 1,
      emails: 1,
      roles: 1
    }
  };

  return Meteor.users.findOne(query, options);
};

const getDate = date => {
  const format = 'MMMM Do, YYYY';
  return date ? getFormattedDate(date, format) : null;
};

const scrollToSelectedMessage = (component) => {
  const $chat = $('.chat-content');
  const $message = $(ReactDOM.findDOMNode(component));
  const msgOffset = $message.offset().top;

  // center the linked message in the chat box
  const elHeight = $message.height();
  const chatHeight = $chat.height();

  const offset = msgOffset - ((chatHeight / 2) - (elHeight / 2));

  $chat.scrollTop(offset);
};

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
