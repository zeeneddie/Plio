import React from 'react';
import PropTypes from 'prop-types';
import { ButtonGroup, Button } from 'reactstrap';
import Icon from './Icons/Icon';

const Chip = ({ label, onRemove }) => (
  <ButtonGroup>
    <Button disabled>{label}</Button>
    <Button
      className="btn-icon"
      onMouseDown={onRemove}
    >
      <Icon name="times-circle" />
    </Button>
  </ButtonGroup>
);

Chip.propTypes = {
  onRemove: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
};

export default Chip;
