import { createSelector } from 'reselect';
import { compose } from 'ramda';
import { lenses } from 'plio-util';

import { getStandardBookSections } from '../standardBookSections';
import { createUncategorizedSection } from '../../../../ui/react/standards/helpers';
import sortByTitlePrefix from '../../../../api/helpers/sortByTitlePrefix';
import { lensEqById } from '../../../util';
import { withUncategorized } from '../../../util/plio';
import { getStandardsFromProps } from './state';

// selector(standards: Array, sections: Array) => Array
const selector = (standards, sections) => compose(
  sortByTitlePrefix,
  withUncategorized(
    // (lens: Lens) => (section: Object) => (standard: Object) => Boolean
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
