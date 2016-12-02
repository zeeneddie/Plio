import React from 'react';
import property from 'lodash.property';

import propTypes from './propTypes';
import FieldRead from '../FieldRead';

const renderDepartments = departments =>
  departments.map(property('name')).join(', ');

const DepartmentsRead = ({
  departments = [],
  label = 'Departments',
}) => (
  <FieldRead label={label}>
    {renderDepartments(departments)}
  </FieldRead>
);

DepartmentsRead.propTypes = propTypes;

export default DepartmentsRead;
