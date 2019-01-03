import createDecorator from 'final-form-calculate';
import { concat, equals } from 'ramda';

import {
  getDepartments,
  getProjects,
  addDepartmentType,
  addProjectType,
} from '../../helpers/categorize';

const updateCategorize = (value, { departments = [], projects = [] }) => concat(
  addDepartmentType(departments),
  addProjectType(projects),
);

export default createDecorator(
  {
    field: 'departments',
    updates: {
      categorize: updateCategorize,
    },
    isEqual: equals,
  },
  {
    field: 'projects',
    updates: {
      categorize: updateCategorize,
    },
    isEqual: equals,
  },
  {
    field: 'categorize',
    updates: {
      departments: getDepartments,
      projects: getProjects,
    },
    isEqual: (value, oldValue) => value ? equals(value, oldValue) : true,
  },
);
