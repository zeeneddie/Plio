import React, { PropTypes } from 'react';

import Button from '../Button';
import Icon from '../../Icon';

const PreloaderButton = ({ size = '2', children }) => (
  <Button type="secondary" size={size} className="disabled">
    <Icon name="spinner spin" margin="right" />
    {children}
  </Button>
);

PreloaderButton.propTypes = {
  size: PropTypes.string,
  children: PropTypes.node,
};

export default PreloaderButton;
