import PropTypes from 'prop-types';
import React from 'react';

import Button from '../Button';
import Icon from '../../Icons/Icon';

const PreloaderButton = ({ size = '2', children }) => (
  <Button color="secondary" size={size} className="disabled">
    <Icon name="spinner spin" margin="right" />
    {children}
  </Button>
);

PreloaderButton.propTypes = {
  size: PropTypes.string,
  children: PropTypes.node,
};

export default PreloaderButton;
