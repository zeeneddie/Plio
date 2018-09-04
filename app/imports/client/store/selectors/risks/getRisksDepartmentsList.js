import { createSelector } from 'reselect';
import { lenses, withUncategorized, belongsToDepartment } from 'plio-util';

import { getRisksFromProps } from './state';
import { getDepartments } from '../departments';
import { createUncategorizedDepartment } from '../../../../client/react/risks/helpers';

// selector(risks: Array, departments: Array) => Array
const selector = (risks, departments) => withUncategorized(
  belongsToDepartment,
  lenses.typeId,
  lenses.risks,
  createUncategorizedDepartment({ risks, departments }),
  risks,
  departments,
);

export default createSelector([
  getRisksFromProps,
  getDepartments,
], selector);
