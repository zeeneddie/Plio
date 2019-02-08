import React from 'react';

import InputField from './InputField';

const parseUrl = (value) => {
  if (value && value.search(/^https?:\/\//) === -1) {
    return `http://${value}`;
  }

  return value;
};

const UrlField = props => (
  <InputField
    format={parseUrl}
    formatOnBlur
    {...props}
  />
);

export default UrlField;
