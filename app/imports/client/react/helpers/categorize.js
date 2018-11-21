import { map, merge, filter, propEq } from 'ramda';

import { CategorizeTypes } from '../../../api/constants';

const getOptionsByType = type => filter(propEq('type', type));
export const getDepartments = getOptionsByType(CategorizeTypes.DEPARTMENT);
export const getProjects = getOptionsByType(CategorizeTypes.PROJECT);

const addCategorizeType = type => map(merge({ type }));
export const addDepartmentType = addCategorizeType(CategorizeTypes.DEPARTMENT);
export const addProjectType = addCategorizeType(CategorizeTypes.PROJECT);
