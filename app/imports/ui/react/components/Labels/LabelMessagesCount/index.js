import React, { PropTypes } from 'react';

const LabelMessagesCount = ({ count }) => (
  <span className="chat-indicator">
    <i className="fa fa-comment"></i>
    <span className="label label-danger">{count}</span>
  </span>
);

LabelMessagesCount.propTypes = {
  count: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default LabelMessagesCount;
