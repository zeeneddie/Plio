import PropTypes from 'prop-types';
import React from 'react';
import { Field } from 'react-final-form';
import { getTargetValue } from 'plio-util';

import Select from './Select';

const renderSelect = ({ input, onChange, ...rest }) => (
  <Select
    {...{ ...input, ...rest }}
    onChange={(e) => {
      input.onChange(getTargetValue(e));
      if (onChange) onChange(e);
    }}
  />
);

renderSelect.propTypes = {
  input: PropTypes.object,
  onChange: PropTypes.func,
};

const SelectField = props => (
  <Field
    {...props}
    component={renderSelect}
  />
);

export default SelectField;
