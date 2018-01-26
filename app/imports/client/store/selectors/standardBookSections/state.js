import { view } from 'ramda';
import { lenses } from 'plio-util';

export const getStandardBookSectionsByIds = view(lenses.collections.standardBookSectionsByIds);

export const getStandardBookSections = view(lenses.collections.standardBookSections);

export const getStandardBookSectionBySectionId = (state, { sectionId }) =>
  state.collections.standardBookSectionsByIds[sectionId];
