import React, { PropTypes } from 'react';

import Button from '../Button';

const ToggleExpandButton = ({ onClick, children }) => (
  <Button
    type="secondary"
    className="toggle-expand-btn"
    onClick={onClick}
  >
    {children}
  </Button>
);

ToggleExpandButton.propTypes = {
  onClick: PropTypes.func,
  children: PropTypes.node,
};

export default ToggleExpandButton;
