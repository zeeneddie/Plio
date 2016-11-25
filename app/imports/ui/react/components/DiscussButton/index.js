import React from 'react';

import UnreadMessagesLabel from '../UnreadMessagesLabel';
import propTypes from './propTypes';

const DiscussButton = ({
  onClick,
  href,
  unreadMessagesCount,
  title = 'Discuss',
}) => (
  <a
    className="btn btn-secondary"
    onClick={onClick}
    href={href}
  >
    {title}
    {!!unreadMessagesCount && (
      <UnreadMessagesLabel
        unreadMessagesCount={unreadMessagesCount}
      />
    )}
  </a>
);

DiscussButton.propTypes = propTypes;

export default DiscussButton;
