import { createSelector } from 'reselect';
import { map, compose } from 'ramda';

import { getStandards } from './state';
import sortByTitlePrefix from '../../../../api/helpers/sortByTitlePrefix';

const selector = compose(
  map(({ _id, title }) => ({
    value: _id,
    text: title,
  })),
  sortByTitlePrefix,
);

export default createSelector(getStandards, selector);
