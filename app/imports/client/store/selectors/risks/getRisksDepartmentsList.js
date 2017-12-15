import { createSelector } from 'reselect';

import { getRisksFromProps } from './state';
import { getDepartments } from '../departments';
import { createUncategorizedDepartment } from '../../../../ui/react/risks/helpers';
import { lenses } from '../../../util';
import { withUncategorized, doesBelongToDepartment } from '../../../util/plio';

// selector(risks: Array, departments: Array) => Array
const selector = (risks, departments) => withUncategorized(
  doesBelongToDepartment,
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
