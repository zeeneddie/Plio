import React from 'react';
import { Field } from 'react-final-form';

import FileCreateAdapter from './FileCreateAdapter';

const FileCreateField = props => (
  <Field
    component={FileCreateAdapter}
    {...props}
  />
);

export default FileCreateField;
