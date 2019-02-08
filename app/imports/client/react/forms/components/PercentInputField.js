import React from 'react';
import { Field } from 'react-final-form';
import { InputGroup } from 'reactstrap';
import styled from 'styled-components';

import { InputGroupAddon } from '../../components';
import InputAdapter from './InputAdapter';

const StyledInputGroup = styled(InputGroup)`
  max-width: 95px;
`;

const toPercent = (value) => {
  if (typeof value === 'number') return value; // initial value

  if (!value) return null;

  let percent = Math.abs(parseInt(value, 10)); // convert negative and float to positive integer

  if (percent > 100) percent = 100;

  return percent;
};

const PercentInputField = props => (
  <StyledInputGroup>
    <Field
      {...props}
      type="number"
      min={0}
      max={100}
      component={InputAdapter}
      format={toPercent}
      formatOnBlur
    />
    <InputGroupAddon addonType="append">%</InputGroupAddon>
  </StyledInputGroup>
);

export default PercentInputField;
