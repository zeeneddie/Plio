import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';

const CardHeadingButtons = ({
  className, children, tag: Tag = 'div', ...other
}) => (
  <Tag className={cx('card-heading-buttons', className)} {...other}>
    {children}
  </Tag>
);

CardHeadingButtons.propTypes = {
  className: PropTypes.string,
  tag: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  children: PropTypes.node,
};

export default CardHeadingButtons;
