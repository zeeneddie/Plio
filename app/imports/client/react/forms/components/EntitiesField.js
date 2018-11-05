import React from 'react';
import { Field } from 'react-final-form';

import EntitiesFieldAdapter from './EntitiesFieldAdapter';

const EntitiesField = props => (
  <Field
    subscription={{ value: true }}
    component={EntitiesFieldAdapter}
    {...props}
  />
);

export default EntitiesField;
