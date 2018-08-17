import { view } from 'ramda';
import { lenses } from 'plio-util';

export const getActions = view(lenses.collections.actions);

export const getActionsByIds = view(lenses.collections.actionsByIds);
