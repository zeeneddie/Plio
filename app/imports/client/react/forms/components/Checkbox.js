import PropTypes from 'prop-types';
import React from 'react';
import { Label, Input, FormGroup, Button } from 'reactstrap';

import Icon from '../../components/Icons/Icon';

const Checkbox = ({
  checked = false,
  onChange,
  label,
  ...props
}) => (
  <FormGroup check>
    <Label check>
      <Button
        color="secondary"
        className="btn-checkbox"
        active={checked}
        onClick={() => onChange(!checked)}
      >
        <Icon name="check" />
      </Button>
      <Input
        hidden
        readOnly
        type="checkbox"
        {...{ ...props, checked }}
      />
      {label}
    </Label>
  </FormGroup>
);

Checkbox.propTypes = {
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  label: PropTypes.string,
};

export default Checkbox;
