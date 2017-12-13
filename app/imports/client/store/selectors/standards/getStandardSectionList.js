import { createSelector } from 'reselect';
import { compose } from 'ramda';

import { getStandardBookSections } from '../standardBookSections';
import { getSelectedStandardIsDeleted } from './state';
import getSearchInfo from './getSearchInfo';
import { createUncategorizedSection } from '../../../../ui/react/standards/helpers';
import sortByTitlePrefix from '../../../../api/helpers/sortByTitlePrefix';
import { withUncategorized } from './util';

const getStandards = (_, { standards }) => standards;

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
  const sections = compose(
    sortByTitlePrefix,
    withUncategorized,
  )('sectionId', uncategorized, standards, standardBookSections);

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
