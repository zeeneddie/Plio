import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { useField } from 'react-final-form';

import { FormField, InputField, SelectField, FieldCondition } from '../../components';
import { CUSTOMER_SEQUENTIAL_ID } from '../constants';
import { CustomerTypesNames, CustomerTypes } from '../../../../share/constants';

const customerTypes = Object.values(CustomerTypes).map(type => ({
  value: type,
  text: CustomerTypesNames[type],
}));

const CustomerForm = ({ save }) => {
  const { input: { value: serialNumber } } = useField('serialNumber');

  return (
    <Fragment>
      <FormField>
        Org name
        <InputField
          name="name"
          disabled
          addon={`${CUSTOMER_SEQUENTIAL_ID}${serialNumber}`}
        />
      </FormField>
      <FormField>
        Type
        <SelectField
          name="customerType"
          options={customerTypes}
          onChange={save}
        />
      </FormField>
      <FieldCondition
        when="customerType"
        is={CustomerTypes.TEMPLATE}
      >
        <FormField>
          Sign-up path
          <InputField
            name="signupPath"
            placeholder="Sign-up path"
            onBlur={save}
          />
        </FormField>
      </FieldCondition>
    </Fragment>
  );
};

CustomerForm.propTypes = {
  save: PropTypes.func,
};

export default CustomerForm;
