import React from 'react';
import { Field } from 'react-final-form';

import FileAdapter from './FileAdapter';

const FileField = props => (
  <Field
    component={FileAdapter}
    {...props}
  />
);

export default FileField;
