import { createSelector } from 'reselect';
import { compose } from 'ramda';

import { getStandardBookSections } from '../standardBookSections';
import { createUncategorizedSection } from '../../../../ui/react/standards/helpers';
import sortByTitlePrefix from '../../../../api/helpers/sortByTitlePrefix';
import { withUncategorized } from './util';

const getStandards = (_, { standards }) => standards;

export const makeGetSectionsWithUncategorized = () => createSelector(
  [getStandards, getStandardBookSections],
  (standards, sections) => compose(
    sortByTitlePrefix,
    withUncategorized(
      'sectionId',
      createUncategorizedSection({ standards, sections }),
    ),
  )(standards, sections),
);

export default makeGetSectionsWithUncategorized();
