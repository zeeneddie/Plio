import { createSelector } from 'reselect';
import { compose } from 'ramda';

import { getStandardBookSections } from '../standardBookSections';
import { createUncategorizedSection } from '../../../../ui/react/standards/helpers';
import sortByTitlePrefix from '../../../../api/helpers/sortByTitlePrefix';
import { withUncategorized } from './util';
import { getStandardsFromProps } from './state';

// selector(standards: Array, sections: Array) => Array
const selector = (standards, sections) => compose(
  sortByTitlePrefix,
  withUncategorized(
    'sectionId',
    createUncategorizedSection({ standards, sections }),
  ),
)(standards, sections);

export const makeGetSectionsWithUncategorized = () => createSelector([
  getStandardsFromProps,
  getStandardBookSections,
], selector);

export default makeGetSectionsWithUncategorized();
