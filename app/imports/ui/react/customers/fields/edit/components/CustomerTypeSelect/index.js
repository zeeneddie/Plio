import PropTypes from 'prop-types';
import React from 'react';

import { CustomerTypesNames } from '/imports/share/constants';
import { FormField, Select } from '../../../../../components';
import { createCustomerTypeOptions } from './helpers';

const CustomerTypeSelect = ({ onChange, customerType: value }) => (
  <FormField>
    <span>Type</span>
    <Select
      {...{ value, onChange }}
      options={createCustomerTypeOptions(CustomerTypesNames)}
    />
  </FormField>
);

CustomerTypeSelect.propTypes = {
  _id: PropTypes.string.isRequired,
  customerType: PropTypes.oneOf(Object.keys(CustomerTypesNames).map(Number)).isRequired,
  onChange: PropTypes.func,
};

export default CustomerTypeSelect;
