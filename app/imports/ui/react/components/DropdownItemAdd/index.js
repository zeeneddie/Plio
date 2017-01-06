import React, { PropTypes } from 'react';
import { DropdownItem } from 'reactstrap';
import Button from '../Buttons/Button';
import Icon from '../Icons/Icon';

const DropdownItemAdd = ({ children, ...other }) => (
  <DropdownItem {...other}>
    {!!children && (
      <Button type="md secondary">
        <Icon name="plus" />
      </Button>
    )}
    <strong>
      {children || 'Start typing...'}
    </strong>
  </DropdownItem>
);

DropdownItemAdd.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
};

export default DropdownItemAdd;
