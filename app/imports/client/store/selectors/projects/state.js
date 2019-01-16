import { view } from 'ramda';
import { lenses } from 'plio-util';

export const getProjects = view(lenses.collections.projects);

export const getProjectsByIds = view(lenses.collections.projectsByIds);
