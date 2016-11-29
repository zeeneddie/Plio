import React, { PropTypes } from 'react';

import UnreadMessagesLabel from '../../UnreadMessagesLabel';
import Button from '../Button';

const DiscussButton = ({
  onClick,
  href,
  unreadMessagesCount,
  children,
}) => (
  <Button
    type="secondary"
    onClick={onClick}
    href={href}
  >
    {children}
    {!!unreadMessagesCount && (
      <UnreadMessagesLabel
        unreadMessagesCount={unreadMessagesCount}
      />
    )}
  </Button>
);

DiscussButton.propTypes = {
  onClick: PropTypes.func,
  href: PropTypes.string,
  unreadMessagesCount: PropTypes.number,
  title: PropTypes.string,
  children: PropTypes.node,
};

export default DiscussButton;
