import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';

const MessageCard = ({ className, children, ...other }) => (
  <div className={cx('chat-item-card', className)} {...other}>
    {children}
  </div>
);

MessageCard.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

export default MessageCard;
