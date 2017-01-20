import { $ } from 'meteor/jquery';
import ReactDOM from 'react-dom';
import { getFormattedDate } from '/imports/share/helpers';

import { getFullName } from '/imports/api/users/helpers';
import { propEqId } from '/imports/api/helpers';

export const isAuthor = ({ userId, createdBy }) => Object.is(userId, createdBy);

export const getStartedByText = ({ users = [], discussion: { startedBy } = {} }) =>
  getFullName(users.find(propEqId(startedBy)));

export const getStartedAtText = ({ discussion: { startedAt } = {} }) =>
  getFormattedDate(startedAt, 'MMMM Do, YYYY');

export const isMessageSelected = (props, at) => Object.is(props._id, at);

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
