import { view } from 'ramda';

import { lenses } from '../../../util';

export const getActions = view(lenses.collections.actions);

export const getActionsByIds = view(lenses.collections.actionsByIds);
