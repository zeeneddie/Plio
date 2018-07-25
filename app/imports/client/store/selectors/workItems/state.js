import { view } from 'ramda';
import { lenses } from 'plio-util';

export const getWorkItems = view(lenses.collections.workItems);

export const getWorkItemsByIds = view(lenses.collections.workItemsByIds);
