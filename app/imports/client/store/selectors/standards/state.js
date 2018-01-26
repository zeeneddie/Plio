import { view, compose } from 'ramda';
import { lenses } from 'plio-util';

export const getStandards = view(lenses.collections.standards);

export const getStandardsFromProps = (_, { standards }) => standards;

export const getStandardsByIds = view(lenses.collections.standardsByIds);

export const getStandardsFiltered = view(lenses.standards.standardsFiltered);

export const getSelectedStandard = state =>
  state.collections.standardsByIds[state.global.urlItemId];

export const getSelectedStandardIsDeleted = compose(
  view(lenses.isDeleted),
  getSelectedStandard,
);

export const getStandardsInitializing = view(lenses.standards.initializing);

export const getStandardsAreDepsReady = view(lenses.standards.areDepsReady);
