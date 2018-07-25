import { view } from 'ramda';
import { lenses } from 'plio-util';

export const getDepartments = view(lenses.collections.departments);

export const getDepartmentsByIds = view(lenses.collections.departmentsByIds);
