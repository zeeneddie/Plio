import React from 'react';
import { Field } from 'react-final-form';

import EditSourceContainer from './EditSourceContainer';

const EditSourceField = props => (
  <Field
    component={EditSourceContainer}
    {...props}
  />
);

export default EditSourceField;
