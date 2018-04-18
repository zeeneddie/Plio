import React from 'react';
import PropTypes from 'prop-types';

import Button from './Button';

const ToggleGuidelinesButton = ({ isOpen, ...props }) => (
  <Button color="link collapse" {...{ ...props }}>
    {isOpen ? 'Hide guidelines' : 'Guidelines'}
  </Button>
);

ToggleGuidelinesButton.propTypes = {
  isOpen: PropTypes.bool,
};

export default ToggleGuidelinesButton;
