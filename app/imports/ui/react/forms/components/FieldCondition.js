import PropTypes from 'prop-types';
import React from 'react';
import { Field } from 'react-final-form';

const FieldCondition = ({
  when,
  is,
  otherwise = null,
  children,
  ...props
}) => (
  <Field name={when} subscription={{ value: true }} {...props}>
    {({ input: { value } }) => (typeof is === 'function' ? is(value) : is === value)
      ? children
      : otherwise}
  </Field>
);

FieldCondition.propTypes = {
  when: PropTypes.string.isRequired,
  is: PropTypes.any,
  otherwise: PropTypes.node,
  children: PropTypes.node,
};

export default FieldCondition;
