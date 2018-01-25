import { view } from 'ramda';
import { lenses } from 'plio-util';

export const getStandardTypesByIds = view(lenses.collections.standardTypesByIds);

export const getStandardTypes = view(lenses.collections.standardTypes);

export const getStandardTypeByTypeId = (state, { typeId }) =>
  state.collections.standardTypesByIds[typeId];
