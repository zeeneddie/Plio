import React from 'react';
import PropTypes from 'prop-types';
import { compose, withHandlers, onlyUpdateForKeys } from 'recompose';
import { Input } from 'reactstrap';

const enhance = compose(
  onlyUpdateForKeys(['value']),
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

const LimitNumberField = ({ value, onBlur }) => (
  <Input
    type="number"
    min="1"
    max="99"
    defaultValue={value}
    onBlur={onBlur}
  />
);

LimitNumberField.propTypes = {
  value: PropTypes.number,
  onBlur: PropTypes.func,
};

export default enhance(LimitNumberField);
