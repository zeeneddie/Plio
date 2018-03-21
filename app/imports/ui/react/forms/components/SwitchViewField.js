import PropTypes from 'prop-types';
import React from 'react';
import { Field } from 'react-final-form';

import SwitchView from '../../components/SwitchView';

const renderSwitchView = ({
  input,
  onChange,
  children,
  ...rest
}) => (
  <SwitchView
    {...{ ...input, ...rest }}
    active={input.value}
    onChange={(idx) => {
      input.onChange(idx);
      if (onChange) onChange(idx);
    }}
  >
    {children}
  </SwitchView>
);

renderSwitchView.propTypes = {
  input: PropTypes.object,
  onChange: PropTypes.func,
  children: PropTypes.node.isRequired,
};

const SwitchViewField = props => (
  <Field
    {...props}
    component={renderSwitchView}
  />
);

export default SwitchViewField;
