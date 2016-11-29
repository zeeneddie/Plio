import React, { PropTypes } from 'react';

import Button from '../Button';
import Icon from '../../Icon';

const EditButton = ({ onClick, children }) => (
  <Button type="primary" onClick={onClick}>
    <Icon names="pencil" className="margin-right" />
    {children}
  </Button>
);

EditButton.propTypes = {
  onClick: PropTypes.func,
  children: PropTypes.node,
};

export default EditButton;
