import PropTypes from 'prop-types';
import React from 'react';

import Label from '../Label';

const LabelUnreadMessages = ({ children }) => (
  <Label names="danger chat-count" margin="left">
    {children}
  </Label>
);

LabelUnreadMessages.propTypes = {
  children: PropTypes.node,
};

export default LabelUnreadMessages;
