import React from 'react';
import PropTypes from 'prop-types';
import { compose, withProps, withHandlers, onlyUpdateForKeys } from 'recompose';
import { Input } from 'reactstrap';

import FormField from '../../forms/components/FormField';

const enhance = compose(
  onlyUpdateForKeys(['valueKey', 'label']),
  withProps(({ valueKey, ...restProps }) => ({
    value: restProps[valueKey],
  })),
  withHandlers({
    onBlur: ({ valueKey, value, changeWorkspaceDefaults }) => (event) => {
      const input = event.target;

      if (value === +input.value) return;

      changeWorkspaceDefaults(
        { [valueKey]: +input.value },
      ).catch(() => {
        input.value = value;
      });
    },
  }),
);

const LimitNumberField = ({ value, label, onBlur }) => (
  <FormField sm="6">
    {label}
    <Input
      type="number"
      min="1"
      max="99"
      defaultValue={value}
      onBlur={onBlur}
    />
  </FormField>
);

LimitNumberField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number,
  onBlur: PropTypes.func,
};

export default enhance(LimitNumberField);
