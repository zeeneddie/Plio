import PropTypes from 'prop-types';
import React from 'react';

const MessagesListHeader = ({ startedAt, startedBy }) => (
  <div className="chat-item chat-item-start">
    <p className="chat-item-text">
      This discussion was started by
      <strong> {startedBy} </strong>
      on
      <strong> {startedAt}</strong>
    </p>
  </div>
);

MessagesListHeader.propTypes = {
  startedAt: PropTypes.string,
  startedBy: PropTypes.string,
};

export default MessagesListHeader;
