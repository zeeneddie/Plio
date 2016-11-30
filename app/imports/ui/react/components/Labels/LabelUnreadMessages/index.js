import React, { PropTypes } from 'react';

import Label from '../Label';

const LabelUnreadMessages = ({ children }) => (
  <Label names="danger chat-count">
    {children}
  </Label>
);

LabelUnreadMessages.propTypes = {
  children: PropTypes.node,
};

export default LabelUnreadMessages;
