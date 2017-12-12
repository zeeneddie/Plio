import { createSelector } from 'reselect';
import { compose, filter, map, set, concat, propEq, view, length, tap } from 'ramda';

import { getStandardBookSections } from '../standardBookSections';
import { getSelectedStandardIsDeleted } from './state';
import getSearchInfo from './getSearchInfo';
import { createUncategorizedSection } from '../../../../ui/react/standards/helpers';
import lenses from '../lenses';
import sortByTitlePrefix from '../../../../api/helpers/sortByTitlePrefix';

const getStandards = (_, { standards }) => standards;

// ({ standards: Array }) => Number | Any
const getStandardsLength = compose(length, view(lenses.standards));

// (standards: Array) => (section: Object) => Object
const setFilteredBySectionStandards = standards => section => set(
  lenses.standards,
  filter(propEq('sectionId', section._id), standards),
  section,
);

// getSections(standards: Array, uncategorizedSections: Array, sections: Array) => Array
const getSections = (standards, uncategorizedSections, sections) => compose(
  sortByTitlePrefix,
  filter(getStandardsLength),
  concat(uncategorizedSections),
  map(setFilteredBySectionStandards(standards)),
)(sections);

/*
selector(
  standards: Array,
  standardBookSections: Array,
  isSelectedStandardDeleted: Boolean,
  searchInfo: Object,
) => Object
*/

const selector = (standards, standardBookSections, isSelectedStandardDeleted, searchInfo) => {
  const uncategorized = createUncategorizedSection({
    standards,
    sections: standardBookSections,
  });
  const sections = getSections(standards, [uncategorized], standardBookSections);

  return {
    sections,
    standardBookSections,
    isSelectedStandardDeleted,
    ...searchInfo,
  };
};

export default createSelector([
  getStandards,
  getStandardBookSections,
  getSelectedStandardIsDeleted,
  getSearchInfo,
], selector);
