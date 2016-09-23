import { Meteor } from 'meteor/meteor';
import get from 'lodash.get';

import { getFormattedDate } from '/imports/api/helpers.js';

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

export const transformMessages = ({ discussion, messages }) => {
  const messagesMapped = messages.map((message, i, arr) => {
    const { _id, createdBy, createdAt } = message;

    const user = getUser(createdBy);

    const obj = (() => {
      const date = getDate(createdAt);
      const documentId = discussion.linkedTo;

      return {
        _id,
        date,
        documentId,
        createdAt,
        user,
        dateToShow: (() => {
          const prevCreatedAt = get(messages[i - 1], 'createdAt');
          const prevMessageDate = getDate(prevCreatedAt);

          return date !== prevMessageDate;
        })(),
        isMergedWithPreviousMessage: (() => {
          const prevMessage = messages[i - 1];
          const prevCreatedAt = get(prevMessage, 'createdAt');
          const prevCreatedBy = get(prevMessage, 'createdBy');

           return (message.createdBy === prevCreatedBy &&
                   message.createdAt - prevCreatedAt < 5 * 60 * 1000);
        })()
      };
    })();

    return Object.assign({}, message, obj);
  });

  return messagesMapped;
};
