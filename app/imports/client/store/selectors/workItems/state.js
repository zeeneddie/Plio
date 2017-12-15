import { view } from 'ramda';

import { lenses } from '../../../util';

export const getWorkItems = view(lenses.collections.workItems);

export const getWorkItemsByIds = view(lenses.collections.workItemsByIds);
