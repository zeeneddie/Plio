import PropTypes from 'prop-types';
import React from 'react';
import { Field } from 'react-final-form';

import ColorPicker from '../../components/ColorPicker';

const renderColorPicker = ({ input, onChange, ...rest }) => (
  <ColorPicker
    {...{ ...input, ...rest }}
    onChange={(color) => {
      input.onChange(color.hex.toUpperCase());
      if (onChange) {
        onChange(color);
      }
    }}
  />
);

renderColorPicker.propTypes = {
  input: PropTypes.object,
  onChange: PropTypes.func,
};

const ColorPickerField = props => (
  <Field
    {...props}
    component={renderColorPicker}
  />
);

export default ColorPickerField;
