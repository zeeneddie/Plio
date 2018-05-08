import React from 'react';

import InputAdapter from './InputAdapter';

const TextareaAdapter = props => (
  <InputAdapter type="textarea" {...props} />
);

TextareaAdapter.defaultProps = {
  rows: 3,
};

export default TextareaAdapter;
