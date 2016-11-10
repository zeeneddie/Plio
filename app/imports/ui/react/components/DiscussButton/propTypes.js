import { PropTypes } from 'react';

export default {
  onClick: PropTypes.func,
  href: PropTypes.string.isRequired,
  unreadMessagesCount: PropTypes.number,
  title: PropTypes.string,
};
