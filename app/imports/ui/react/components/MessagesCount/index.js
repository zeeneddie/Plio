import React, { PropTypes } from 'react';

const MessagesCount = ({ count }) => (
  <p className="list-group-item-text pull-right text-danger">
    <div className="chat-indicator">
      <i className="fa fa-comment"></i>
      <span className="label label-danger">{count}</span>
    </div>
  </p>
);

MessagesCount.propTypes = {
  count: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default MessagesCount;
