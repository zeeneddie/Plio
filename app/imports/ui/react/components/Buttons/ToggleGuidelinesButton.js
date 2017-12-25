import React from 'react';
import PropTypes from 'prop-types';

import Button from './Button';

const ToggleGuidelinesButton = ({ collapsed, onClick, ...props }) => (
  <Button color="link collapse" {...{ ...props, onClick }}>
    {collapsed ? 'Guidelines' : 'Hide guidelines'}
  </Button>
);

ToggleGuidelinesButton.propTypes = {
  collapsed: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default ToggleGuidelinesButton;
