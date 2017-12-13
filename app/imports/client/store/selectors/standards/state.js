import { view, compose } from 'ramda';
import { lenses } from '../../../../client/util';

export const getStandards = view(lenses.collections.standards);

export const getStandardsByIds = view(lenses.collections.standardsByIds);

export const getStandardsFiltered = view(lenses.standards.standardsFiltered);

export const getSelectedStandard = state =>
  state.collections.standardsByIds[state.global.urlItemId];

export const getSelectedStandardIsDeleted = compose(
  view(lenses.isDeleted),
  getSelectedStandard,
);
