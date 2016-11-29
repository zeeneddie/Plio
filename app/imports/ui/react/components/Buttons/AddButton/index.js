import React, { PropTypes } from 'react';

import Button from '../Button';
import Icon from '../../Icon';

const AddButton = ({ onClick, children }) => (
  <Button
    type="primary"
    onClick={onClick}
  >
    <Icon names="plus" />
    {children}
  </Button>
);

AddButton.propTypes = {
  onClick: PropTypes.func,
  children: PropTypes.node,
};

export default AddButton;
