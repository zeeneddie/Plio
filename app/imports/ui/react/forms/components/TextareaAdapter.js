import React from 'react';

import InputAdapter from './InputAdapter';

const TextareaAdapter = props => (
  <InputAdapter type="textarea" rows={3} {...props} />
);

export default TextareaAdapter;
