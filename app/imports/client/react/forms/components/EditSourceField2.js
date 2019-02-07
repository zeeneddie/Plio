import React from 'react';
import { Field } from 'react-final-form';

import EditSourceAdapter from './EditSourceAdapter';

const EditSourceField = props => (
  <Field
    component={EditSourceAdapter}
    {...props}
  />
);

export default EditSourceField;
