import React, { PropTypes } from 'react';

const MessagesCount = ({ count }) => (
  <span>
    <i className="fa fa-comments margin-right"></i>
    <span>{count}</span>
  </span>
);

MessagesCount.propTypes = {
  count: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default MessagesCount;
