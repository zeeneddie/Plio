import React from 'react';
import property from 'lodash.property';

import FieldRead from '../FieldRead';

const renderDepartments = departments =>
  departments.map(property('name')).join(', ');

const FieldReadDepartments = ({
  departments = [],
  label = 'Departments',
}) => departments.length ? (
  <FieldRead label={label}>
    {renderDepartments(departments)}
  </FieldRead>
) : null;

export default FieldReadDepartments;
