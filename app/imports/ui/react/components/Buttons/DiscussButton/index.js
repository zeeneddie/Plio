import PropTypes from 'prop-types';
import React from 'react';

import LabelUnreadMessages from '../../Labels/LabelUnreadMessages';
import Button from '../Button';

const DiscussButton = ({
  onClick,
  href,
  unreadMessagesCount,
  children,
}) => (
  <Button
    color="secondary"
    onClick={onClick}
    href={href}
  >
    {children}
    {!!unreadMessagesCount && (
      <LabelUnreadMessages>
        {unreadMessagesCount}
      </LabelUnreadMessages>
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
