import { createSelector } from 'reselect';
import { compose } from 'ramda';

import { getStandardBookSections } from '../standardBookSections';
import { createUncategorizedSection } from '../../../../ui/react/standards/helpers';
import sortByTitlePrefix from '../../../../api/helpers/sortByTitlePrefix';
import { lenses, withUncategorized, lensEqById } from '../../../util';
import { getStandardsFromProps } from './state';

// selector(standards: Array, sections: Array) => Array
const selector = (standards, sections) => compose(
  sortByTitlePrefix,
  withUncategorized(
    lensEqById(lenses.sectionId),
    lenses.sectionId,
    lenses.standards,
    createUncategorizedSection({ standards, sections }),
  ),
)(standards, sections);

export const makeGetSectionsWithUncategorized = () => createSelector([
  getStandardsFromProps,
  getStandardBookSections,
], selector);

export default makeGetSectionsWithUncategorized();
