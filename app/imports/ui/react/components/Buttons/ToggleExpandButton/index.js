import React, { PropTypes } from 'react';

import Button from '../Button';

const ToggleExpandButton = ({ onClick, children }) => (
  <Button
    color="secondary"
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
