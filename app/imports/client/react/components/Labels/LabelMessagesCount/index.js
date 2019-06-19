import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';

const LabelMessagesCount = ({ count, className }) => (
  <span className={cx('chat-indicator', className)}>
    <i className="fa fa-comment" />
    <span className="label label-danger">{count}</span>
  </span>
);

LabelMessagesCount.propTypes = {
  count: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  className: PropTypes.string,
};

export default LabelMessagesCount;
