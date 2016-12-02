import invoke from 'lodash.invoke';
import { Meteor } from 'meteor/meteor';
import ReactDOM from 'react-dom';
import { getFormattedDate } from '/imports/share/helpers';

export const isAuthor = message => Object.is(Meteor.userId(), message.createdBy);

export const getStartedByText = ({ discussion: { startedBy } = {} }) =>
  invoke(Meteor.users.findOne({ _id: startedBy }), 'fullNameOrEmail');

export const getStartedAtText = ({ discussion: { startedAt } = {} }) =>
  getFormattedDate(startedAt, 'MMMM Do, YYYY');

export const isMessageSelected = (props, at) => Object.is(props._id, at);

export const getUser = (_id) => {
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

export const getDate = (date) => {
  const format = 'MMMM Do, YYYY';
  return date ? getFormattedDate(date, format) : null;
};

export const scrollToSelectedMessage = (component) => {
  const $chat = $('.chat-content');
  const $message = $(ReactDOM.findDOMNode(component));
  const msgOffset = $message.offset().top;

  // center the linked message in the chat box
  const elHeight = $message.height();
  const chatHeight = $chat.height();

  const offset = msgOffset - ((chatHeight / 2) - (elHeight / 2));

  $chat.scrollTop(offset);
};
