import React, { PropTypes } from 'react';
import property from 'lodash.property';

import Field from '../Field';

const renderDepartments = departments =>
  departments.map(property('name')).join(', ');

const Departments = ({
  departments = [],
  label = 'Departments',
}) => (
  <Field label={label}>
    {renderDepartments(departments)}
  </Field>
);

Departments.propTypes = {
  departments: PropTypes.array,
  label: PropTypes.string,
};

export default Departments;
