import { createSelector } from 'reselect';
import { lenses, withUncategorized } from 'plio-util';

import { getRisksFromProps } from './state';
import { getProjects } from '../projects';
import { createUncategorizedProject } from '../../../../client/react/risks/helpers';

// selector(risks: Array, departments: Array) => Array
const selector = (risks, projects) => withUncategorized(
  project => risk => (risk.projectIds || []).includes(project && project._id),
  lenses.typeId,
  lenses.risks,
  createUncategorizedProject({ risks, projects }),
  risks,
  projects,
);

export default createSelector([
  getRisksFromProps,
  getProjects,
], selector);
