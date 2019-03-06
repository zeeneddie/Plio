import React from 'react';
import { Field } from 'react-final-form';

import SourceAdapter from './SourceAdapter';

const SourceField = props => (
  <Field
    component={SourceAdapter}
    {...props}
  />
);

export default SourceField;
