import React from 'react';
import { Field } from 'react-final-form';
import { equals } from 'ramda';

import EntitiesFieldAdapter from './EntitiesFieldAdapter';

const EntitiesField = props => (
  <Field
    subscription={{ value: true }}
    isEqual={equals}
    component={EntitiesFieldAdapter}
    {...props}
  />
);

export default EntitiesField;
